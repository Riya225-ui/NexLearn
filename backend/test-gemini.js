const { summarize } = require('./src/services/gemini.service');

async function test() {
  try {
    console.log('Testing gemini...');
    const result = await summarize('This is a test transcript for a video about Node.js and React.', 'english');
    console.log('Result:', result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
