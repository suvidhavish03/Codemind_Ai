const express = require('express')
const router = express.Router()
const aiService = require('../services/aiService')
const { optionalAuth } = require('../middleware/auth')
const { aiLimiter } = require('../config/rateLimiter')

// POST /api/chat
router.post('/', aiLimiter, optionalAuth, async (req, res) => {
  try {
    const { messages } = req.body
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' })
    }

    // Validate and sanitize messages
    const sanitized = messages
      .filter(m => m.role && m.content && typeof m.content === 'string')
      .slice(-20) // Keep last 20 messages for context
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content.slice(0, 2000)
      }))

    if (sanitized.length === 0) {
      return res.status(400).json({ error: 'No valid messages provided' })
    }

    const reply = await aiService.chat(sanitized)
    res.json({ reply })
  } catch (err) {
    console.error('Chat error:', err.message)
    res.status(500).json({ error: 'Chat failed: ' + err.message })
  }
})

module.exports = router
