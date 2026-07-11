/**
 * CodeMind AI - User Controller
 * Saved snippets and chat history.
 */

const Snippet = require('../models/Snippet');
const ChatHistory = require('../models/ChatHistory');

// GET /api/user/history
exports.getHistory = async (req, res, next) => {
  try {
    const snippets = await Snippet.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json({ snippets });
  } catch (err) {
    next(err);
  }
};

// POST /api/user/save
exports.saveSnippet = async (req, res, next) => {
  try {
    const { language, prompt, code, title } = req.body;
    if (!code) return res.status(400).json({ error: 'code is required' });

    const snippet = await Snippet.create({
      userId: req.userId,
      type: 'saved',
      language,
      prompt,
      code,
      title: title || `${language} snippet`,
    });
    res.status(201).json({ snippet });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/user/history/:id
exports.deleteSnippet = async (req, res, next) => {
  try {
    const snippet = await Snippet.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!snippet) return res.status(404).json({ error: 'Snippet not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

// GET /api/user/chats
exports.getChatSessions = async (req, res, next) => {
  try {
    const chats = await ChatHistory.find({ userId: req.userId })
      .sort({ updatedAt: -1 })
      .limit(20)
      .select('sessionId title updatedAt')
      .lean();
    res.json({ chats });
  } catch (err) {
    next(err);
  }
};
