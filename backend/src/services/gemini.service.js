const { GoogleGenAI } = require('@google/genai');
const NodeCache = require('node-cache');
require('dotenv').config();

function loadApiKeys() {
  const keys = [];

  if (process.env.GEMINI_API_KEY) {
    const split = process.env.GEMINI_API_KEY.split(',').map(k => k.trim()).filter(Boolean);
    keys.push(...split);
  }

  for (let i = 1; i <= 10; i++) {
    const k = process.env[`GEMINI_API_KEY_${i}`];
    if (k && k.trim()) keys.push(k.trim());
  }

  return [...new Set(keys)];
}

class KeyRotator {
  constructor(keys) {
    this.keys = keys;
    this.currentIndex = 0;
    this.rateLimitedAt = {};
    this.cooldownMs = 60 * 1000;
  }

  getKey() {
    const now = Date.now();
    for (let i = 0; i < this.keys.length; i++) {
      const idx = (this.currentIndex + i) % this.keys.length;
      const key = this.keys[idx];
      const limitedAt = this.rateLimitedAt[key];
      if (!limitedAt || now - limitedAt > this.cooldownMs) {
        this.currentIndex = (idx + 1) % this.keys.length;
        return key;
      }
    }
    const oldest = this.keys.reduce((a, b) =>
      (this.rateLimitedAt[a] || 0) < (this.rateLimitedAt[b] || 0) ? a : b
    );
    console.warn('All API keys rate-limited. Using oldest key.');
    return oldest;
  }

  markRateLimited(key) {
    this.rateLimitedAt[key] = Date.now();
    console.warn(`Key ...${key.slice(-8)} rate-limited. Rotating to next key.`);
  }

  get count() { return this.keys.length; }

  status() {
    const now = Date.now();
    return this.keys.map((k, i) => ({
      index: i,
      keySuffix: `...${k.slice(-8)}`,
      available: !this.rateLimitedAt[k] || now - this.rateLimitedAt[k] > this.cooldownMs,
      cooldownLeft: this.rateLimitedAt[k]
        ? Math.max(0, Math.round((this.cooldownMs - (now - this.rateLimitedAt[k])) / 1000))
        : 0,
    }));
  }
}


const responseCache = new NodeCache({ stdTTL: 3600, checkperiod: 300 });

const crypto = require('crypto');

function makeCacheKey(prompt, systemInstruction) {
  const raw = (systemInstruction || '') + '|||' + (typeof prompt === 'string' ? prompt : JSON.stringify(prompt));
  return 'gemini_' + crypto.createHash('sha256').update(raw).digest('hex');
}

const ALL_KEYS = loadApiKeys();

if (ALL_KEYS.length === 0) {
  console.error('No Gemini API key found! Add GEMINI_API_KEY to backend/.env');
} else {
  console.log(`Gemini: ${ALL_KEYS.length} API key(s) loaded.`);
}

const rotator = new KeyRotator(ALL_KEYS);

const MODEL = 'gemini-3.6-flash';   // higher quality — primary
const MODEL_FALLBACK = 'gemini-3.5-flash-lite'; // fastest — fallback

// Limit input text to avoid slow responses on huge documents
const trimText = (text, maxLen = 8000) => {
  if (!text || text.length <= maxLen) return text;
  const half = Math.floor(maxLen / 2);
  return text.slice(0, half) + '\n\n[... content trimmed for speed ...]\n\n' + text.slice(-half);
};

function isRateLimitError(err) {
  const msg = err.message || '';
  return msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota') || msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE') || msg.includes('403') || msg.includes('PERMISSION_DENIED');
}

const callGemini = async (prompt, systemInstruction = null) => {
  const cacheKey = makeCacheKey(prompt, systemInstruction);
  const cached = responseCache.get(cacheKey);
  if (cached) return cached;

  const config = {};
  if (systemInstruction) config.systemInstruction = systemInstruction;

  const attempts = ALL_KEYS.length > 0 ? ALL_KEYS.length * 2 : 1;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const key = rotator.getKey();
    const model = attempt < ALL_KEYS.length ? MODEL : MODEL_FALLBACK;
    const client = new GoogleGenAI({ apiKey: key });

    try {
      const response = await client.models.generateContent({ model, contents: prompt, config });
      const text = response.text;
      responseCache.set(cacheKey, text);
      return text;
    } catch (error) {
      if (error.message?.includes('API key not valid')) {
        throw new Error(`Invalid API key (...${key.slice(-8)}). Please check your .env file.`);
      }
      if (isRateLimitError(error)) {
        rotator.markRateLimited(key);
        if (attempt < attempts - 1) continue;
        throw new Error('All API keys have hit rate limits. Please wait ~1 minute and try again.');
      }
      throw new Error('AI Service error: ' + error.message);
    }
  }
};

const callGeminiStream = async (prompt, systemInstruction = null, res) => {
  const config = {};
  if (systemInstruction) config.systemInstruction = systemInstruction;

  if (!res.headersSent) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();
  }

  const doStream = async (key, model) => {
    const client = new GoogleGenAI({ apiKey: key });
    const stream = await client.models.generateContentStream({ model, contents: prompt, config });

    let fullText = '';
    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
      }
    }
    res.write(`data: ${JSON.stringify({ done: true, fullText })}\n\n`);
    res.end();
    return fullText;
  };

  const attempts = ALL_KEYS.length > 0 ? ALL_KEYS.length * 2 : 1;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const key = rotator.getKey();
    const model = attempt < ALL_KEYS.length ? MODEL : MODEL_FALLBACK;

    try {
      return await doStream(key, model);
    } catch (error) {
      if (error.message?.includes('API key not valid')) {
        res.write(`data: ${JSON.stringify({ error: `Invalid API key (...${key.slice(-8)}).` })}\n\n`);
        res.end();
        throw error;
      }
      if (isRateLimitError(error)) {
        rotator.markRateLimited(key);
        if (attempt < attempts - 1) continue;
        const msg = 'All API keys have hit rate limits. Please wait ~1 minute and try again.';
        res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
        res.end();
        throw new Error(msg);
      }
      res.write(`data: ${JSON.stringify({ error: 'AI Service error. Please try again.' })}\n\n`);
      res.end();
      throw error;
    }
  }
};

const summarize = async (text, language = 'english') => {
  const langNote = language === 'bangla' ? 'Respond in Bangla language.' : 'Respond in English.';
  const systemInstruction = `You are an expert academic summarizer. ${langNote} Provide structured, clear summaries with key points highlighted.`;
  const prompt = `Please summarize the following content concisely and clearly. 
Extract the most important concepts, key points, and main ideas.
Format the response with:
1. A brief overview (2-3 sentences)
2. Key Points (bullet list)
3. Important Concepts (brief explanations)

Content:
${trimText(text)}`;
  return callGemini(prompt, systemInstruction);
};

const summarizeStream = async (text, language = 'english', res) => {
  const langNote = language === 'bangla' ? 'Respond in Bangla language.' : 'Respond in English.';
  const systemInstruction = `You are an expert academic summarizer. ${langNote} Provide structured, clear summaries with key points highlighted.`;
  const prompt = `Please summarize the following content concisely and clearly. 
Extract the most important concepts, key points, and main ideas.
Format the response with:
1. A brief overview (2-3 sentences)
2. Key Points (bullet list)
3. Important Concepts (brief explanations)

Content:
${trimText(text)}`;
  return callGeminiStream(prompt, systemInstruction, res);
};

const explainConcept = async (concept, context = '', language = 'english') => {
  const langNote = language === 'bangla' ? 'Respond in Bangla language.' : 'Respond in English.';
  const systemInstruction = `You are a friendly, knowledgeable AI teacher who explains concepts clearly and engagingly for students. ${langNote} Use analogies, examples, and a conversational tone.`;
  const prompt = `${context ? `Context: ${context}\n\n` : ''}Please explain the following concept in a way that a student can easily understand: "${concept}"
  
  Include:
  - A simple, clear definition
  - A real-world analogy or example
  - Why it's important
  - Any related concepts to explore`;
  return callGemini(prompt, systemInstruction);
};

const explainConceptStream = async (concept, context = '', language = 'english', res) => {
  const langNote = language === 'bangla' ? 'Respond in Bangla language.' : 'Respond in English.';
  const systemInstruction = `You are a friendly, knowledgeable AI teacher who explains concepts clearly and engagingly for students. ${langNote} Use analogies, examples, and a conversational tone.`;
  const prompt = `${context ? `Context: ${context}\n\n` : ''}Please explain the following concept in a way that a student can easily understand: "${concept}"
  
  Include:
  - A simple, clear definition
  - A real-world analogy or example
  - Why it's important
  - Any related concepts to explore`;
  return callGeminiStream(prompt, systemInstruction, res);
};

const generateNotes = async (text, language = 'english') => {
  const langNote = language === 'bangla' ? 'Respond in Bangla language.' : 'Respond in English.';
  const systemInstruction = `You are an expert note-taker and academic coach. ${langNote} Create comprehensive, well-structured revision notes.`;
  const prompt = `Generate clear, structured revision notes from the following content. 
Format them with:
- Clear headings and subheadings
- Bullet points for key facts
- Bold important terms
- A "Key Takeaways" section at the end

Content:
${trimText(text)}`;
  return callGemini(prompt, systemInstruction);
};

const generateNotesStream = async (text, language = 'english', res) => {
  const langNote = language === 'bangla' ? 'Respond in Bangla language.' : 'Respond in English.';
  const systemInstruction = `You are an expert note-taker and academic coach. ${langNote} Create comprehensive, well-structured revision notes.`;
  const prompt = `Generate clear, structured revision notes from the following content. 
Format them with:
- Clear headings and subheadings
- Bullet points for key facts
- Bold important terms
- A "Key Takeaways" section at the end

Content:
${trimText(text)}`;
  return callGeminiStream(prompt, systemInstruction, res);
};

const generateQuiz = async (text, questionCount = 10, language = 'english') => {
  const langNote = language === 'bangla' ? 'Respond in Bangla language.' : 'Respond in English.';
  const systemInstruction = `You are an expert educator creating assessment materials. ${langNote} Always respond with valid JSON.`;
  const prompt = `Generate a quiz with exactly ${questionCount} questions from the content below.
Return ONLY a JSON array (no markdown, no explanation) in this format:
[
  {
    "type": "mcq",
    "question": "...",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "answer": "A) ...",
    "explanation": "..."
  },
  {
    "type": "truefalse",
    "question": "...",
    "answer": "True",
    "explanation": "..."
  },
  {
    "type": "short",
    "question": "...",
    "answer": "..."
  }
]

Mix MCQs, True/False, and Short Answer questions.

Content:
${trimText(text)}`;

  const raw = await callGemini(prompt, systemInstruction);
  try {
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : raw);
  } catch {
    return { error: 'Could not parse quiz JSON', raw };
  }
};

const generateFlashcards = async (text, language = 'english') => {
  const langNote = language === 'bangla' ? 'Respond in Bangla language.' : 'Respond in English.';
  const systemInstruction = `You are an expert at creating concise study flashcards. ${langNote} Always respond with valid JSON.`;
  const prompt = `Create study flashcards from the following content.
Return ONLY a JSON array (no markdown, no explanation) in this format:
[
  { "front": "Term or Question", "back": "Definition or Answer" }
]

Generate 10-15 flashcards covering the most important concepts.

Content:
${trimText(text)}`;

  const raw = await callGemini(prompt, systemInstruction);
  try {
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : raw);
  } catch {
    return { error: 'Could not parse flashcards JSON', raw };
  }
};

const chatWithDocument = async (question, documentText, history = [], language = 'english') => {
  const langNote = language === 'bangla' ? 'Respond in Bangla language.' : 'Respond in English.';
  const systemInstruction = `You are a helpful AI assistant. Answer questions ONLY based on the provided document content. ${langNote} If the answer is not in the document, say so clearly.`;
  const historyContext = history.slice(-6).map(h => `${h.role === 'user' ? 'Student' : 'AI'}: ${h.content}`).join('\n');
  const prompt = `Document Content:
${trimText(documentText, 8000)}

${historyContext ? `Previous conversation:\n${historyContext}\n\n` : ''}Student Question: ${question}

Please answer based strictly on the document content above.`;
  return callGemini(prompt, systemInstruction);
};

const chatWithDocumentStream = async (question, documentText, history = [], language = 'english', res) => {
  const langNote = language === 'bangla' ? 'Respond in Bangla language.' : 'Respond in English.';
  const systemInstruction = `You are a helpful AI assistant. Answer questions ONLY based on the provided document content. ${langNote} If the answer is not in the document, say so clearly.`;
  const historyContext = history.slice(-6).map(h => `${h.role === 'user' ? 'Student' : 'AI'}: ${h.content}`).join('\n');
  const prompt = `Document Content:
${trimText(documentText, 8000)}

${historyContext ? `Previous conversation:\n${historyContext}\n\n` : ''}Student Question: ${question}

Please answer based strictly on the document content above.`;
  return callGeminiStream(prompt, systemInstruction, res);
};

const getKeyStatus = () => ({
  totalKeys: rotator.count,
  cacheSize: responseCache.keys().length,
  keys: rotator.status(),
});

module.exports = {
  summarize, summarizeStream,
  explainConcept, explainConceptStream,
  generateNotes, generateNotesStream,
  generateQuiz,
  generateFlashcards,
  chatWithDocument, chatWithDocumentStream,
  callGemini, callGeminiStream,
  getKeyStatus,
};
