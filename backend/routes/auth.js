const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { generateToken } = require('../middleware/auth')
const { authLimiter } = require('../config/rateLimiter')

// POST /api/auth/register
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(409).json({
        error: existingUser.email === email ? 'Email already in use' : 'Username already taken'
      })
    }

    const user = await User.create({ username, email, password })
    const token = generateToken(user._id)

    res.status(201).json({ token, user })
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' })
  }
})

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = generateToken(user._id)
    res.json({ token, user })
  } catch (err) {
    res.status(500).json({ error: 'Login failed' })
  }
})

// GET /api/auth/me
router.get('/me', require('../middleware/auth').protect, (req, res) => {
  res.json({ user: req.user })
})

module.exports = router
