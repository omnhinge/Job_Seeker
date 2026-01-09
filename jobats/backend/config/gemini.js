const { GoogleGenerativeAI } = require('@google/generative-ai');

// Check if API key exists
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in .env file!');
  process.exit(1);
}

if (process.env.GEMINI_API_KEY.length < 30) {
  console.error('❌ GEMINI_API_KEY appears to be invalid (too short)');
  process.exit(1);
}

console.log('✅ Gemini API Key loaded (length:', process.env.GEMINI_API_KEY.length + ')');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getGeminiModel = () => {
  // Update from 'gemini-1.5-flash' to a current model
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

module.exports = { getGeminiModel };