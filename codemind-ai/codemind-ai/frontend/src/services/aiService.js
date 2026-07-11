/**
 * CodeMind AI — AI Service Layer
 * Handles all calls to the Anthropic Claude API.
 * In direct mode: calls api.anthropic.com from browser (good for dev/demo).
 * In backend mode: routes through your Express server (recommended for production).
 */

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'
const MAX_TOKENS = 2000

// Reads from Vite env vars (set in .env file)
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || ''
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const AI_MODE = import.meta.env.VITE_AI_MODE || 'direct'

/**
 * Core API caller — direct to Anthropic
 */
async function callAnthropicDirect(system, messages, maxTokens = MAX_TOKENS) {
  const res = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${res.status}`)
  }
  const data = await res.json()
  return data.content.map(b => b.text || '').join('')
}

/**
 * Core API caller — via backend proxy
 */
async function callBackend(endpoint, payload) {
  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message || `Request failed ${res.status}`)
  }
  const data = await res.json()
  return data.result
}

/**
 * Universal caller — switches between direct and backend mode
 */
async function callAI(system, userMessage, maxTokens = MAX_TOKENS) {
  const messages = typeof userMessage === 'string'
    ? [{ role: 'user', content: userMessage }]
    : userMessage

  if (AI_MODE === 'backend') {
    return callBackend('/ai/chat', { system, messages, maxTokens })
  }
  return callAnthropicDirect(system, messages, maxTokens)
}

// ─── Prompt Templates ────────────────────────────────────────

const PROMPTS = {
  generate: (lang, mode) => `You are CodeMind AI, an expert code generator.
Generate clean, well-commented ${lang} code.
${mode === 'beginner'
  ? 'Use simple variable names. Add beginner-friendly comments explaining every concept.'
  : 'Use optimal patterns, design principles, and production-grade practices.'}
RESPOND ONLY WITH VALID JSON (no markdown fences, no extra text):
{
  "code": "the actual code with \\n for newlines",
  "explanations": [
    { "line": 1, "code": "first line of code", "explanation": "what it does in ${mode === 'beginner' ? 'simple beginner-friendly' : 'concise technical'} terms" }
  ],
  "summary": "one sentence describing what the code does"
}
Provide an explanation entry for every meaningful line.`,

  debug: (lang) => `You are an expert code debugger.
Analyze the given ${lang} code for all bugs, errors, anti-patterns, and security issues.
RESPOND ONLY WITH VALID JSON (no markdown fences):
{
  "bugs": [
    {
      "line": 5,
      "severity": "error|warning|info",
      "issue": "short description",
      "fix": "exactly how to fix it",
      "explanation": "why this is a bug"
    }
  ],
  "fixed_code": "the corrected code",
  "summary": "overall assessment in one sentence",
  "score": 85
}
score = 0-100 code health. If no bugs, return empty array and score 100.`,

  convert: (from, to) => `You are an expert code converter.
Convert code from ${from} to ${to} preserving all logic, algorithms, and functionality exactly.
RESPOND ONLY WITH VALID JSON (no markdown fences):
{
  "converted_code": "the converted code",
  "notes": ["any important differences or considerations"],
  "warnings": ["things the developer should verify after conversion"]
}`,

  complexity: (lang) => `You are an algorithm complexity expert.
Analyze the given ${lang} code for computational complexity.
RESPOND ONLY WITH VALID JSON (no markdown fences):
{
  "time_complexity": "O(n^2)",
  "space_complexity": "O(n)",
  "time_explanation": "detailed explanation",
  "space_explanation": "detailed explanation",
  "best_case": "O(n)",
  "worst_case": "O(n^2)",
  "average_case": "O(n log n)",
  "bottlenecks": ["specific performance bottleneck descriptions"],
  "optimizations": ["specific, actionable optimization suggestions"],
  "overall_rating": "excellent|good|fair|poor"
}`,

  chat: `You are CodeMind AI, a friendly and expert coding assistant.
Help with code generation, debugging, algorithm design, best practices, and learning.
Keep responses practical and clear. Use triple backtick code blocks for all code examples.
Use markdown formatting: **bold**, \`inline code\`, bullet lists.`
}

// ─── Public API ────────────────────────────────────────────

/**
 * Generate code from a natural language prompt.
 * Returns { code, explanations, summary }
 */
export async function generateCode(prompt, language, mode = 'beginner') {
  const raw = await callAI(PROMPTS.generate(language, mode), `Generate ${language} code for: ${prompt}`)
  return JSON.parse(raw.replace(/```json|```/g, '').trim())
}

/**
 * Detect bugs in code.
 * Returns { bugs, fixed_code, summary, score }
 */
export async function detectBugs(code, language) {
  const raw = await callAI(PROMPTS.debug(language), `Debug this ${language} code:\n\n${code}`)
  return JSON.parse(raw.replace(/```json|```/g, '').trim())
}

/**
 * Convert code between languages.
 * Returns { converted_code, notes, warnings }
 */
export async function convertCode(code, fromLang, toLang) {
  const raw = await callAI(PROMPTS.convert(fromLang, toLang), `Convert this ${fromLang} code to ${toLang}:\n\n${code}`)
  return JSON.parse(raw.replace(/```json|```/g, '').trim())
}

/**
 * Analyze code complexity.
 * Returns { time_complexity, space_complexity, bottlenecks, optimizations, ... }
 */
export async function analyzeComplexity(code, language) {
  const raw = await callAI(PROMPTS.complexity(language), `Analyze this ${language} code:\n\n${code}`)
  return JSON.parse(raw.replace(/```json|```/g, '').trim())
}

/**
 * Send a chat message with full conversation history.
 * messages = [{ role: 'user'|'assistant', content: string }]
 * Returns the assistant reply string.
 */
export async function sendChatMessage(messages) {
  return callAI(PROMPTS.chat, messages, 1500)
}
