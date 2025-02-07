const mongoose = require('mongoose');
const SurveyResponseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  answers: [{
    questionId: {
      type: Number,
      required: true
    },
    answer: {
      type: [String],
      required: true
    }
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SurveyResponse', SurveyResponseSchema);
