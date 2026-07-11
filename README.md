# CodeMind AI 🧠⚡

A production-ready AI-powered code generator, explainer, debugger, and assistant platform.

## Features

- ⚡ **AI Code Generator** — Generate code in 18+ languages from plain English
- 🎓 **Line-by-Line Explainer** — Every line explained in beginner or advanced mode
- 💬 **Chat Assistant** — ChatGPT-style coding assistant with conversation memory
- 🐛 **Bug Detector** — AI finds bugs, explains them, and provides fixes
- 🔄 **Code Converter** — Convert code between any two languages
- 📊 **Complexity Analyzer** — Time/space complexity with Big-O notation
- 🎤 **Voice Input** — Speak prompts using Web Speech API

## Quick Start

### Frontend Only (simplest)
```bash
cd frontend
npm install
cp .env.example .env
# Add VITE_ANTHROPIC_API_KEY to .env
npm run dev
# Open http://localhost:5173
```

### Full Stack
```bash
# Terminal 1
cd backend && npm install && cp .env.example .env && npm run dev

# Terminal 2
cd frontend && npm install && cp .env.example .env && npm run dev
```

## Environment Variables

**frontend/.env**
```
VITE_ANTHROPIC_API_KEY=your_key_here
VITE_API_BASE_URL=http://localhost:5000/api
```

**backend/.env**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codemind
JWT_SECRET=your_jwt_secret
ANTHROPIC_API_KEY=your_key_here
FRONTEND_URL=http://localhost:5173
```

## Tech Stack
- Frontend: React 18 + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt
- AI: Anthropic Claude API
- Realtime: Socket.io
