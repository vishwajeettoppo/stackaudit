import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function testGemini() {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const prompt = 'Write a one-sentence summary about AI cost optimization.';
  
  try {
    const result = await model.generateContent(prompt);
    console.log('✅ Gemini works! Response:', result.response.text());
  } catch (error) {
    console.error('❌ Gemini error:', error);
  }
}

testGemini();