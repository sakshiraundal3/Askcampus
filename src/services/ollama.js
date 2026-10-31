const db = require('../config/db');
async function answerQuestion(question) {
  const { rows } = await db.query(
    `SELECT question, answer FROM faqs
     WHERE is_active = TRUE AND (question ILIKE $1 OR answer ILIKE $1)
     ORDER BY updated_at DESC LIMIT 8`, [`%${question}%`]
  );
  const context = rows.map((r, i) => `${i + 1}. Q: ${r.question}\nA: ${r.answer}`).join('\n\n');
  const prompt = `You are AskCampus, a helpful college admission assistant. Answer using the institutional FAQ context when relevant. If the answer is not in the context, clearly say the student should confirm with the college admission office. Do not invent dates, fees, eligibility rules, or contact details.\n\nFAQ CONTEXT:\n${context || 'No matching FAQ was found.'}\n\nSTUDENT QUESTION:\n${question}\n\nAnswer in clear, friendly language.`;
  const base = (process.env.OLLAMA_URL || 'http://localhost:11434').replace(/\/$/, '');
  const response = await fetch(`${base}/api/generate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: process.env.OLLAMA_MODEL || 'llama3.2', prompt, stream: false })
  });
  if (!response.ok) throw new Error(`Ollama returned HTTP ${response.status}`);
  const data = await response.json();
  return { answer: data.response, matchedFaqs: rows.length };
}
module.exports = { answerQuestion };
