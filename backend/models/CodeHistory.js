const mongoose = require('mongoose')

const codeHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['generate', 'debug', 'convert', 'complexity'],
    required: true
  },
  prompt: String,
  language: String,
  fromLanguage: String,
  toLanguage: String,
  inputCode: String,
  outputCode: String,
  result: mongoose.Schema.Types.Mixed,
  tokensUsed: Number,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { timestamps: true })

module.exports = mongoose.model('CodeHistory', codeHistorySchema)
