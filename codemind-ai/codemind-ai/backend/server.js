require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { createServer } = require('http')
const { Server } = require('socket.io')
const connectDB = require('./config/database')

// Route imports
const authRoutes = require('./routes/auth')
const codeRoutes = require('./routes/code')
const chatRoutes = require('./routes/chat')
const userRoutes = require('./routes/user')

const app = express()
const httpServer = createServer(app)
const PORT = process.env.PORT || 5008

// Socket.io for real-time collaboration
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: '50kb' }))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/code', codeRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/user', userRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  })
})

// ─── Socket.io — Real-time collaboration ─────────────────────────────────────
const rooms = new Map()

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`)

  socket.on('join-room', ({ roomId, username }) => {
    socket.join(roomId)
    if (!rooms.has(roomId)) rooms.set(roomId, { users: [], code: '' })
    const room = rooms.get(roomId)
    room.users.push({ id: socket.id, username })
    socket.to(roomId).emit('user-joined', { username, users: room.users })
    socket.emit('room-state', { code: room.code, users: room.users })
  })

  socket.on('code-change', ({ roomId, code, cursor }) => {
    const room = rooms.get(roomId)
    if (room) room.code = code
    socket.to(roomId).emit('code-update', { code, cursor, userId: socket.id })
  })

  socket.on('chat-message', ({ roomId, message, username }) => {
    io.to(roomId).emit('new-message', { message, username, timestamp: Date.now() })
  })

  socket.on('disconnect', () => {
    rooms.forEach((room, roomId) => {
      room.users = room.users.filter(u => u.id !== socket.id)
      socket.to(roomId).emit('user-left', { userId: socket.id, users: room.users })
    })
  })
})

// ─── Start ────────────────────────────────────────────────────────────────────
async function start() {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB()
    } else {
      console.log('⚠  MONGODB_URI not set — running without database')
    }
    httpServer.listen(PORT, () => {
      console.log(`✅ CodeMind AI server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
