const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Student registration
router.post('/register', studentController.addStudent);

// Get aptitude questions
router.get('/questions', studentController.getAptitudeQuestions);

// Submit aptitude test
router.post('/submit-test', studentController.submitAptitudeTest);

// Get student result
router.get('/result/:studentId', studentController.getStudentResult);

module.exports = router;