const { summarize, summarizeStream } = require('../services/gemini.service');

let YoutubeTranscript;
try {
  YoutubeTranscript = require('youtube-transcript').YoutubeTranscript;
} catch (e) {
  YoutubeTranscript = null;
}

const extractVideoId = (url) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

const summarizeVideo = async (req, res) => {
  try {
    const { url, language = 'english' } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, message: 'YouTube URL is required.' });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Invalid YouTube URL.' });
    }

    let transcript = '';

    if (YoutubeTranscript) {
      try {
        const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
        transcript = transcriptData.map(t => t.text).join(' ');
      } catch (transcriptError) {
        return res.status(422).json({
          success: false,
          message: 'Could not fetch video transcript. The video may have captions disabled or be unavailable.',
        });
      }
    } else {
      return res.status(503).json({
        success: false,
        message: 'YouTube transcript service is unavailable. Please paste the video text directly.',
      });
    }

    if (!transcript || transcript.trim().length < 50) {
      return res.status(422).json({
        success: false,
        message: 'Transcript is too short or empty. This video may not have captions.',
      });
    }

    const summary = await summarize(transcript, language);

    res.json({
      success: true,
      videoId,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      transcript: transcript.substring(0, 500) + '...',
      summary,
      language,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const summarizeVideoStream = async (req, res) => {
  try {
    const { url, language = 'english' } = req.body;

    if (!url) {
      res.status(400).json({ success: false, message: 'YouTube URL is required.' });
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      res.status(400).json({ success: false, message: 'Invalid YouTube URL.' });
      return;
    }

    let transcript = '';

    if (YoutubeTranscript) {
      try {
        const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
        transcript = transcriptData.map(t => t.text).join(' ');
      } catch (transcriptError) {
        res.status(422).json({
          success: false,
          message: 'Could not fetch video transcript. The video may have captions disabled or be unavailable.',
        });
        return;
      }
    } else {
      res.status(503).json({
        success: false,
        message: 'YouTube transcript service is unavailable.',
      });
      return;
    }

    if (!transcript || transcript.trim().length < 50) {
      res.status(422).json({
        success: false,
        message: 'Transcript is too short or empty. This video may not have captions.',
      });
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    res.write(`data: ${JSON.stringify({
      meta: {
        videoId,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        language,
      }
    })}\n\n`);

    const { summarizeStream: streamFn } = require('../services/gemini.service');
    await streamFn(transcript, language, res);

  } catch (error) {
    console.error('YouTube stream error:', error.message);
  }
};

module.exports = { summarizeVideo, summarizeVideoStream };
