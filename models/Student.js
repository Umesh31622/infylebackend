const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  fatherName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    required: true
  },
  collegeName: {
    type: String,
    required: true
  },
  batch: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true
  },
  aptitudeTest: {
    score: Number,
    totalQuestions: Number,
    correctAnswers: Number,
    submittedAt: Date,
    answers: [{
      questionId: Number,
      selectedOption: String,
      isCorrect: Boolean
    }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);