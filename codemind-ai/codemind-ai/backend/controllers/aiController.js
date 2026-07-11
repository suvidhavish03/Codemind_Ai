/**
 * CodeMind AI - AI Controller
 * Handles all AI-related HTTP requests.
 */

const claude = require('../services/claudeService');
const ChatHistory = require('../models/ChatHistory');
const Snippet = require('../models/Snippet');

// POST /api/ai/generate
exports.generate = async (req, res, next) => {
  try {
    const { prompt, language = 'python', mode = 'beginner' } = req.body;
    if (!prompt) return res.status(400).json({ error: 'prompt is required' });
    if (prompt.length > 2000) return res.status(400).json({ error: 'Prompt too long (max 2000 chars)' });

    const result = await claude.generateCode({ prompt, language, mode });

    // Optionally save to user history
    if (req.userId) {
      await Snippet.create({
        userId: req.userId,
        type: 'generated',
        language,
        prompt,
        code: result.code,
      });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// POST /api/ai/debug
exports.debug = async (req, res, next) => {
  try {
    const { code, language = 'python' } = req.body;
    if (!code) return res.status(400).json({ error: 'code is required' });
    if (code.length > 10000) return res.status(400).json({ error: 'Code too long (max 10000 chars)' });

    const result = await claude.debugCode({ code, language });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// POST /api/ai/convert
exports.convert = async (req, res, next) => {
  try {
    const { code, fromLang, toLang } = req.body;
    if (!code || !fromLang || !toLang) {
      return res.status(400).json({ error: 'code, fromLang, and toLang are required' });
    }
    if (fromLang === toLang) {
      return res.status(400).json({ error: 'Source and target language must differ' });
    }

    const result = await claude.convertCode({ code, fromLang, toLang });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// POST /api/ai/complexity
exports.complexity = async (req, res, next) => {
  try {
    const { code, language = 'python' } = req.body;
    if (!code) return res.status(400).json({ error: 'code is required' });

    const result = await claude.analyzeComplexity({ code, language });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// POST /api/ai/chat
exports.chat = async (req, res, next) => {
  try {
    const { messages, sessionId } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }
    // Keep last 20 turns to stay within context window
    const trimmed = messages.slice(-20);

    const result = await claude.chat({ messages: trimmed });

    // Persist chat history if user is authenticated
    if (req.userId && sessionId) {
      await ChatHistory.findOneAndUpdate(
        { userId: req.userId, sessionId },
        {
          $set: { updatedAt: new Date() },
          $push: {
            messages: {
              $each: [
                messages[messages.length - 1],          // last user message
                { role: 'assistant', content: result.reply },
              ],
            },
          },
        },
        { upsert: true }
      );
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};
