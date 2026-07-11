const Anthropic = require('@anthropic-ai/sdk')

// Initialize client — uses ANTHROPIC_API_KEY from environment
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MODEL = 'claude-sonnet-4-20250514'

/**
 * Base AI call wrapper with error handling
 */
async function callAI(system, messages, maxTokens = 2000) {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages
  })
  return response.content.map(b => b.text || '').join('')
}

/**
 * Parse JSON from AI response (strips markdown fences if present)
 */
function parseJSON(raw) {
  return JSON.parse(raw.replace(/```json\n?|```\n?/g, '').trim())
}

// ─── Code Generation ──────────────────────────────────────────────────────────
async function generateCode(prompt, language, mode = 'beginner') {
  const modeInstructions = mode === 'beginner'
    ? 'Use simple variable names, add beginner-friendly comments on every line, explain each concept.'
    : 'Use optimal patterns, SOLID principles, production-grade error handling, and idiomatic code.'

  const system = `You are CodeMind AI, an expert code generator and teacher.
Generate clean, well-commented ${language} code. ${modeInstructions}

RESPOND ONLY WITH VALID JSON (no markdown, no extra text):
{
  "code": "the complete code as a string using \\n for newlines",
  "explanations": [
    {"line": 1, "code": "the exact code on that line", "explanation": "what it does in ${mode === 'beginner' ? 'simple beginner-friendly' : 'technical'} terms"}
  ],
  "summary": "one sentence describing what this code does"
}

Provide an explanation for every meaningful line. Be accurate, educational, and precise.`

  const raw = await callAI(system, [{ role: 'user', content: `Generate ${language} code for: ${prompt}` }])
  return parseJSON(raw)
}

// ─── Bug Detection ────────────────────────────────────────────────────────────
async function detectBugs(code, language) {
  const system = `You are an expert ${language} code reviewer and debugger.
Find ALL bugs, errors, anti-patterns, and issues in the provided code.

RESPOND ONLY WITH VALID JSON:
{
  "bugs": [
    {
      "line": 5,
      "severity": "error|warning|info",
      "issue": "concise description",
      "fix": "how to fix it",
      "explanation": "why this is a bug and what it causes"
    }
  ],
  "fixed_code": "fully corrected code",
  "summary": "overall code quality assessment",
  "score": 85
}

score 0-100 (100 = perfect). severity: error=crashes/wrong output, warning=bad practice, info=style.`

  const raw = await callAI(system, [{ role: 'user', content: `Debug this ${language} code:\n\n${code}` }])
  return parseJSON(raw)
}

// ─── Code Conversion ──────────────────────────────────────────────────────────
async function convertCode(code, fromLang, toLang) {
  const system = `You are an expert polyglot programmer. Convert code between languages while preserving all logic exactly. Use idiomatic patterns for the target language.

RESPOND ONLY WITH VALID JSON:
{
  "converted_code": "the converted code",
  "notes": ["important conversion notes"],
  "warnings": ["potential issues to review manually"]
}`

  const raw = await callAI(system, [{
    role: 'user',
    content: `Convert this ${fromLang} code to ${toLang}. Preserve all logic:\n\n${code}`
  }])
  return parseJSON(raw)
}

// ─── Complexity Analysis ──────────────────────────────────────────────────────
async function analyzeComplexity(code, language) {
  const system = `You are an algorithm complexity expert. Analyze the ${language} code for computational complexity.

RESPOND ONLY WITH VALID JSON:
{
  "time_complexity": "O(n^2)",
  "space_complexity": "O(n)",
  "best_case": "O(n)",
  "worst_case": "O(n^2)",
  "average_case": "O(n log n)",
  "time_explanation": "clear explanation of time complexity",
  "space_explanation": "clear explanation of space usage",
  "bottlenecks": ["specific performance bottlenecks"],
  "optimizations": ["concrete optimization suggestions with expected Big-O improvement"],
  "overall_rating": "excellent|good|fair|poor"
}`

  const raw = await callAI(system, [{ role: 'user', content: `Analyze complexity:\n\n${code}` }])
  return parseJSON(raw)
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
async function chat(messages) {
  const system = `You are CodeMind AI, a friendly and expert coding assistant.
Help with: code generation, debugging, algorithm design, best practices, learning concepts.
Keep responses practical and focused. Use triple-backtick code blocks for code examples.
Always specify the language after the opening backticks. Be encouraging and clear.`

  return callAI(system, messages, 1500)
}

module.exports = { generateCode, detectBugs, convertCode, analyzeComplexity, chat }
