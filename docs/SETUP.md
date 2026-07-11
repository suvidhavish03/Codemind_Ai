# Setup Guide

## Prerequisites

- Node.js 18+ (https://nodejs.org)
- npm 9+
- MongoDB (local or Atlas) — optional, needed only for auth/history features
- Anthropic API key (https://console.anthropic.com)

---

## 1. Clone / Extract the project

```bash
cd codemind-ai
```

---

## 2. Frontend Setup (required)

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the dev server:
```bash
npm run dev
# Open http://localhost:5173
```

---

## 3. Backend Setup (optional — needed for auth, history, collaboration)

```bash
cd backend
npm install
```

Create `backend/.env`:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/codemind
JWT_SECRET=replace_with_a_random_32char_string
JWT_EXPIRES_IN=7d
ANTHROPIC_API_KEY=sk-ant-your-key-here
FRONTEND_URL=http://localhost:5173
```

Start:
```bash
npm run dev
```

---

## 4. MongoDB Setup (if using backend)

**Option A — Local MongoDB:**
- Install: https://mongodb.com/try/download/community
- Start: `mongod --dbpath /data/db`

**Option B — MongoDB Atlas (free cloud):**
1. Create account at https://mongodb.com/atlas
2. Create a free M0 cluster
3. Get connection string
4. Replace `MONGODB_URI` in backend `.env`

---

## 5. Build for Production

**Frontend:**
```bash
cd frontend
npm run build
# Deploy the /dist folder to Vercel, Netlify, etc.
```

**Backend:**
```bash
cd backend
NODE_ENV=production node server.js
```

---

## Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import in Vercel dashboard
3. Set `VITE_ANTHROPIC_API_KEY` as environment variable
4. Deploy

### Backend → Railway
1. Push backend to GitHub
2. Create new project in Railway
3. Set all environment variables
4. Deploy

### Backend → Render
1. Create new Web Service
2. Connect GitHub repo
3. Set environment variables
4. Deploy

---

## Security Notes

- NEVER commit `.env` files to git
- In production, move API calls to the backend — don't expose API keys in frontend
- The backend routes all AI calls server-side with your key protected
- Rate limiting is pre-configured (20 AI calls/minute, 100 general/15min)
