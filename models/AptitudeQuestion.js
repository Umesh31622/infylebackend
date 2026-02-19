const mongoose = require('mongoose');

const aptitudeQuestionSchema = new mongoose.Schema({
  section: {
    type: String,
    enum: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability'],
    required: true
  },
  questionNumber: {
    type: Number,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    A: String,
    B: String,
    C: String,
    D: String
  },
  correctAnswer: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('AptitudeQuestion', aptitudeQuestionSchema);