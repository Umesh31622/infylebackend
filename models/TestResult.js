// const mongoose = require("mongoose");

// const testResultSchema = new mongoose.Schema(
//   {
//     // Student Info
//     name: String,
//     fatherName: String,
//     email: String,
//     address: String,
//     collegeName: String,
//     batch: String,
//     semester: String,
//     mobile: String,

//     // Quiz Info
//     answers: Array,
//     score: Number,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("TestResult", testResultSchema);
const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema(
  {
    // Student Info
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    collegeName: { type: String, required: true },
    batch: { type: String, required: true },
    semester: { type: String, required: true },
    mobile: { type: String, required: true },

    // Quiz Info
    answers: {
      type: Map,
      of: String,
      default: {}
    },
    score: { type: Number, default: 0 },
    
    // Section-wise scores
    aptitudeScore: { type: Number, default: 0 },
    reasoningScore: { type: Number, default: 0 },
    englishScore: { type: Number, default: 0 },
    
    // Detailed answers with correct/incorrect tracking
    answerDetails: [{
      questionIndex: Number,
      question: String,
      selectedAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean,
      category: String
    }],
    
    // Test metadata
    totalQuestions: { type: Number, default: 25 },
    timeTaken: { type: Number }, // in seconds
    completedAt: { type: Date, default: Date.now },
    
    // Status
    status: { type: String, enum: ['completed', 'partial', 'abandoned'], default: 'completed' }
  },
  { timestamps: true }
);

// Index for better query performance
testResultSchema.index({ email: 1 });
testResultSchema.index({ collegeName: 1 });
testResultSchema.index({ createdAt: -1 });

module.exports = mongoose.model("TestResult", testResultSchema);