const Student = require('../models/Student');
const AptitudeQuestion = require('../models/AptitudeQuestion');

// Add student from form
exports.addStudent = async (req, res) => {
  try {
    const { name, fatherName, email, address, collegeName, batch, semester, mobileNumber } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ 
      $or: [{ email }, { mobileNumber }] 
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email or mobile number already exists'
      });
    }

    const student = new Student({
      name,
      fatherName,
      email,
      address,
      collegeName,
      batch,
      semester,
      mobileNumber
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      studentId: student._id
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering student',
      error: error.message
    });
  }
};

// Get all aptitude questions
exports.getAptitudeQuestions = async (req, res) => {
  try {
    const questions = await AptitudeQuestion.find().sort({ section: 1, questionNumber: 1 });
    res.json({
      success: true,
      questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message
    });
  }
};

// Submit aptitude test answers
exports.submitAptitudeTest = async (req, res) => {
  try {
    const { studentId, answers } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const questions = await AptitudeQuestion.find();
    
    // Calculate score
    let correctAnswers = 0;
    const processedAnswers = answers.map(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      const isCorrect = question && question.correctAnswer === answer.selectedOption;
      if (isCorrect) correctAnswers++;
      
      return {
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        isCorrect
      };
    });

    // Update student with test results
    student.aptitudeTest = {
      score: correctAnswers,
      totalQuestions: questions.length,
      correctAnswers: correctAnswers,
      submittedAt: new Date(),
      answers: processedAnswers
    };

    await student.save();

    res.json({
      success: true,
      message: 'Test submitted successfully',
      result: {
        score: correctAnswers,
        total: questions.length,
        percentage: ((correctAnswers / questions.length) * 100).toFixed(2)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting test',
      error: error.message
    });
  }
};

// Get student result
exports.getStudentResult = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (!student.aptitudeTest) {
      return res.json({
        success: true,
        message: 'Test not attempted yet',
        testAttempted: false
      });
    }

    res.json({
      success: true,
      testAttempted: true,
      student: {
        name: student.name,
        email: student.email,
        collegeName: student.collegeName
      },
      result: {
        score: student.aptitudeTest.score,
        totalQuestions: student.aptitudeTest.totalQuestions,
        percentage: ((student.aptitudeTest.score / student.aptitudeTest.totalQuestions) * 100).toFixed(2),
        submittedAt: student.aptitudeTest.submittedAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching result',
      error: error.message
    });
  }
};