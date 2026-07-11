// Groq API utility — uses LLaMA 3 (open source model)

const API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile' // Free, fast, very capable

async function callGroq(systemPrompt, messages, maxTokens = 2000) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) throw new Error('Missing VITE_GROQ_API_KEY in .env')

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ]
    })
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error?.message || 'Groq API error')
  }

  const data = await response.json()
  return data.choices[0].message.content
}

export async function generateCode(prompt, language, mode = 'beginner') {
  const modeNote = mode === 'beginner'
    ? 'Use simple names and beginner-friendly comments.'
    : 'Use optimal patterns and production-grade practices.'

  const system = `You are CodeMind AI, an expert code generator. ${modeNote}
RESPOND ONLY WITH VALID JSON — no markdown fences:
{
  "code": "the code using \\n for newlines",
  "explanations": [{"line": 1, "code": "exact line", "explanation": "what it does"}],
  "summary": "one sentence summary"
}`

  const raw = await callGroq(system, [{ role: 'user', content: `Generate ${language} code for: ${prompt}` }])
  return JSON.parse(raw.replace(/```json|```/g, '').trim())
}

export async function chatWithAI(messages) {
  const system = `You are CodeMind AI, a friendly expert coding assistant.
Help with code, debugging, algorithms, and concepts.
Use triple backtick code blocks for code. Be concise and practical.`

  return callGroq(system, messages, 1500)
}

export async function detectBugs(code, language) {
  const system = `You are an expert ${language} debugger.
RESPOND ONLY WITH VALID JSON:
{
  "bugs": [{"line": 1, "severity": "error|warning|info", "issue": "...", "fix": "...", "explanation": "..."}],
  "fixed_code": "corrected code",
  "summary": "assessment",
  "score": 85
}`
  const raw = await callGroq(system, [{ role: 'user', content: `Debug this ${language} code:\n\n${code}` }])
  return JSON.parse(raw.replace(/```json|```/g, '').trim())
}

export async function convertCode(code, fromLang, toLang) {
  const system = `You are an expert polyglot programmer.
RESPOND ONLY WITH VALID JSON:
{
  "converted_code": "converted code",
  "notes": ["conversion notes"],
  "warnings": ["warnings"]
}`
  const raw = await callGroq(system, [{ role: 'user', content: `Convert this ${fromLang} code to ${toLang}:\n\n${code}` }])
  return JSON.parse(raw.replace(/```json|```/g, '').trim())
}

export async function analyzeComplexity(code, language) {
  const system = `You are an algorithm complexity expert.
RESPOND ONLY WITH VALID JSON:
{
  "time_complexity": "O(n)",
  "space_complexity": "O(1)",
  "best_case": "O(n)",
  "worst_case": "O(n^2)",
  "average_case": "O(n)",
  "time_explanation": "...",
  "space_explanation": "...",
  "bottlenecks": ["..."],
  "optimizations": ["..."],
  "overall_rating": "good"
}`
  const raw = await callGroq(system, [{ role: 'user', content: `Analyze complexity:\n\n${code}` }])
  return JSON.parse(raw.replace(/```json|```/g, '').trim())
}