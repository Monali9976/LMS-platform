const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const SARVAM_BASE = process.env.SARVAM_BASE || 'https://api.sarvam.ai';
const SARVAM_KEY = process.env.SARVAM_API_KEY;

async function callSarvam(messages, max_tokens = 400) {
  if (!SARVAM_KEY) throw new Error('SARVAM_API_KEY not set');
  const payload = {
    model: 'sarvam-m',
    messages,
    max_tokens
  };
  const headers = { 'api-subscription-key': SARVAM_KEY, 'Content-Type': 'application/json' };
  const resp = await axios.post(`${SARVAM_BASE}/chat/completions`, payload, { headers });
  return resp.data?.choices?.[0]?.message?.content || resp.data?.output || '';
}

async function findBestSectionsForQuestion(question, chunks) {
  // Provide a small context of chunks and ask Sarvam to return JSON mapping
  const examples = chunks.slice(0,6).map((c,i)=>`[${i+1}] page:${c.pageNumber || 'N/A'} text:${c.text.slice(0,300)}`).join('\n\n');
  const prompt = `Map this question to the best matching chunk(s) from the material.\nQuestion: "${question}"\n\nMaterial excerpts:\n${examples}\n\nReturn strictly JSON: {"section":"<short summary>","pageNumber":<num>,"chunkIndex":<index>,"reason":"one sentence"}`;
  const msg = [{ role: 'system', content: 'You are a document retriever' }, { role: 'user', content: prompt }];
  const out = await callSarvam(msg, 300);
  try {
    const jsonStart = out.indexOf('{');
    const parsed = JSON.parse(out.slice(jsonStart));
    return parsed;
  } catch (e) {
    return { section: out.slice(0,400) };
  }
}

async function generateAdaptiveQuiz(weakSections, n = 10) {
  const sections = weakSections.map(s => `${s.section} (count:${s.count})`).join('\n');
  const prompt = `Create ${n} short multiple choice questions (4 options each) focusing on these sections:\n${sections}\nReturn JSON array [{"question":"..","options":[..],"answer":"a","source":".."}]`;
  const msg = [{ role: 'system', content: 'You are a question generator' }, { role: 'user', content: prompt }];
  const out = await callSarvam(msg, 800);
  try { return JSON.parse(out); } catch (e) { return { raw: out }; }
}

module.exports = { findBestSectionsForQuestion, generateAdaptiveQuiz };
