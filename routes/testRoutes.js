// const express = require("express");
// const { submitTest, getResults } = require("../controllers/testController");

// const router = express.Router();

// // Submit Test
// router.post("/submit", submitTest);

// // Get All Results
// router.get("/results", getResults);

// module.exports = router;
const express = require("express");
const multer = require('multer');
const path = require('path');
const { 
  submitTest, 
  getResults, 
  getResultById,
  exportToExcel, 
  importFromExcel,
  getStatistics,
  deleteResult
} = require("../controllers/testController");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.xlsx' && ext !== '.xls') {
      return cb(new Error('Only Excel files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Submit Test
router.post("/submit", submitTest);

// Get All Results (with filters)
router.get("/results", getResults);

// Get Statistics
router.get("/statistics", getStatistics);

// Get Single Result
router.get("/result/:id", getResultById);

// Export to Excel
router.get("/export", exportToExcel);

// Import from Excel
router.post("/import", upload.single('file'), importFromExcel);

// Delete Result
router.delete("/result/:id", deleteResult);

module.exports = router;