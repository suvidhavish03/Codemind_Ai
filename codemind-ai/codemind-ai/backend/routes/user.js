const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { protect } = require('../middleware/auth')

// GET /api/user/profile
router.get('/profile', protect, async (req, res) => {
  res.json({ user: req.user })
})

// PATCH /api/user/preferences
router.patch('/preferences', protect, async (req, res) => {
  try {
    const { preferredLanguage, skillLevel } = req.body
    const updates = {}
    if (preferredLanguage) updates.preferredLanguage = preferredLanguage
    if (skillLevel && ['beginner', 'intermediate', 'advanced'].includes(skillLevel)) {
      updates.skillLevel = skillLevel
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update preferences' })
  }
})

// POST /api/user/snippets — save a code snippet
router.post('/snippets', protect, async (req, res) => {
  try {
    const { title, code, language } = req.body
    if (!title || !code || !language) {
      return res.status(400).json({ error: 'title, code, and language are required' })
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { savedSnippets: { title, code, language } } },
      { new: true }
    )
    res.json({ snippets: user.savedSnippets })
  } catch (err) {
    res.status(500).json({ error: 'Failed to save snippet' })
  }
})

// GET /api/user/snippets
router.get('/snippets', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('savedSnippets')
    res.json({ snippets: user.savedSnippets || [] })
  } catch (err) {
    res.status(500).json({ error: 'Failed to get snippets' })
  }
})

// DELETE /api/user/snippets/:id
router.delete('/snippets/:id', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { savedSnippets: { _id: req.params.id } } }
    )
    res.json({ message: 'Snippet deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete snippet' })
  }
})

module.exports = router
