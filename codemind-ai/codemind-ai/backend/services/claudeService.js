/**
 * CodeMind AI - Claude Service
 * Central service layer for all Anthropic API calls.
 */

const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-sonnet-4-20250514';

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function ask(system, userMessage, maxTokens = 2000) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: userMessage }],
  });
  return response.content.map(b => b.text || '').join('');
}

async function askWithHistory(system, messages, maxTokens = 1500) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages,
  });
  return response.content.map(b => b.text || '').join('');
}

function parseJSON(raw) {
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

// ─── Code Generator ──────────────────────────────────────────────────────────

async function generateCode({ prompt, language, mode = 'beginner' }) {
  const modeNote = mode === 'beginner'
    ? 'Use simple variable names and add beginner-friendly comments explaining every concept.'
    : 'Use idiomatic patterns, design principles, and production-grade practices.';

  const system = `You are CodeMind AI, an expert code generator. Generate clean, well-commented ${language} code.
${modeNote}
RESPOND ONLY WITH VALID JSON (no markdown fences):
{
  "code": "the code with \\n for newlines",
  "explanations": [
    { "line": 1, "code": "snippet", "explanation": "what it does" }
  ],
  "summary": "one-sentence description"
}
Provide an explanation for every meaningful line. Keep them ${mode === 'beginner' ? 'simple for beginners' : 'technical and concise'}.`;

  const raw = await ask(system, `Generate ${language} code for: ${prompt}`);
  return parseJSON(raw);
}

// ─── Bug Detector ────────────────────────────────────────────────────────────

async function debugCode({ code, language }) {
  const system = `You are an expert ${language} debugger. Find all bugs, errors, and issues.
RESPOND ONLY WITH VALID JSON:
{
  "bugs": [
    {
      "line": 5,
      "severity": "error|warning|info",
      "issue": "short title",
      "explanation": "why this is a bug",
      "fix": "how to fix it"
    }
  ],
  "fixed_code": "the corrected full code",
  "summary": "overall assessment",
  "score": 85
}
If no bugs found, return empty bugs array with score 100.`;

  const raw = await ask(system, `Debug this ${language} code:\n\n${code}`);
  return parseJSON(raw);
}

// ─── Code Converter ──────────────────────────────────────────────────────────

async function convertCode({ code, fromLang, toLang }) {
  const system = `You are a polyglot programmer. Convert code between languages preserving all logic.
RESPOND ONLY WITH VALID JSON:
{
  "converted_code": "the converted code",
  "notes": ["significant conversion differences"],
  "warnings": ["potential issues to verify"]
}`;

  const raw = await ask(system, `Convert this ${fromLang} code to ${toLang}:\n\n${code}`);
  return parseJSON(raw);
}

// ─── Complexity Analyzer ─────────────────────────────────────────────────────

async function analyzeComplexity({ code, language }) {
  const system = `You are an algorithms expert. Analyze code for time and space complexity.
RESPOND ONLY WITH VALID JSON:
{
  "time_complexity": "O(n^2)",
  "space_complexity": "O(n)",
  "time_explanation": "why",
  "space_explanation": "why",
  "best_case": "O(n)",
  "average_case": "O(n log n)",
  "worst_case": "O(n^2)",
  "bottlenecks": ["bottleneck descriptions"],
  "optimizations": ["optimization suggestions"],
  "overall_rating": "excellent|good|fair|poor"
}`;

  const raw = await ask(system, `Analyze complexity of this ${language} code:\n\n${code}`);
  return parseJSON(raw);
}

// ─── Chat ────────────────────────────────────────────────────────────────────

const CHAT_SYSTEM = `You are CodeMind AI, a friendly expert coding assistant. Help with code generation,
debugging, algorithm design, best practices, and learning concepts.
Be concise and practical. Use triple-backtick code blocks with language tags.`;

async function chat({ messages }) {
  const reply = await askWithHistory(CHAT_SYSTEM, messages);
  return { reply };
}

module.exports = { generateCode, debugCode, convertCode, analyzeComplexity, chat };
