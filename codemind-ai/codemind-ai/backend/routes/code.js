const express = require('express')
const router = express.Router()
const aiService = require('../services/aiService')
const { optionalAuth } = require('../middleware/auth')
const { aiLimiter } = require('../config/rateLimiter')

// Input sanitizer — basic protection
function sanitize(str, maxLen = 4000) {
  if (typeof str !== 'string') return ''
  return str.slice(0, maxLen).trim()
}

// POST /api/code/generate
router.post('/generate', aiLimiter, optionalAuth, async (req, res) => {
  try {
    const { prompt, language = 'python', mode = 'beginner' } = req.body
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' })

    const result = await aiService.generateCode(sanitize(prompt), sanitize(language, 20), mode)
    res.json(result)
  } catch (err) {
    console.error('Generate error:', err.message)
    res.status(500).json({ error: 'Code generation failed: ' + err.message })
  }
})

// POST /api/code/debug
router.post('/debug', aiLimiter, optionalAuth, async (req, res) => {
  try {
    const { code, language = 'python' } = req.body
    if (!code) return res.status(400).json({ error: 'Code is required' })

    const result = await aiService.detectBugs(sanitize(code), sanitize(language, 20))
    res.json(result)
  } catch (err) {
    console.error('Debug error:', err.message)
    res.status(500).json({ error: 'Bug detection failed: ' + err.message })
  }
})

// POST /api/code/convert
router.post('/convert', aiLimiter, optionalAuth, async (req, res) => {
  try {
    const { code, fromLanguage, toLanguage } = req.body
    if (!code || !fromLanguage || !toLanguage) {
      return res.status(400).json({ error: 'code, fromLanguage, and toLanguage are required' })
    }
    if (fromLanguage === toLanguage) {
      return res.status(400).json({ error: 'Source and target language must be different' })
    }

    const result = await aiService.convertCode(sanitize(code), sanitize(fromLanguage, 20), sanitize(toLanguage, 20))
    res.json(result)
  } catch (err) {
    console.error('Convert error:', err.message)
    res.status(500).json({ error: 'Code conversion failed: ' + err.message })
  }
})

// POST /api/code/complexity
router.post('/complexity', aiLimiter, optionalAuth, async (req, res) => {
  try {
    const { code, language = 'python' } = req.body
    if (!code) return res.status(400).json({ error: 'Code is required' })

    const result = await aiService.analyzeComplexity(sanitize(code), sanitize(language, 20))
    res.json(result)
  } catch (err) {
    console.error('Complexity error:', err.message)
    res.status(500).json({ error: 'Complexity analysis failed: ' + err.message })
  }
})

module.exports = router
