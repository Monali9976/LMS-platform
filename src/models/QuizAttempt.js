const mongoose2 = require('mongoose');
const Schema2 = mongoose2.Schema;

const AttemptSchema = new Schema2({
  studentId: String,
  quizId: String,
  answers: Array,
  mappings: Array,
  score: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose2.model('QuizAttempt', AttemptSchema);