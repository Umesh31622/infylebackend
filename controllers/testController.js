// const TestResult = require("../models/TestResult");

// // ✅ Submit Test + Save Result
// exports.submitTest = async (req, res) => {
//   try {
//     const data = new TestResult(req.body);
//     await data.save();

//     res.status(201).json({
//       message: "✅ Test Submitted Successfully",
//       result: data,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "❌ Submit Error",
//       error: error.message,
//     });
//   }
// };

// // ✅ Get All Results
// exports.getResults = async (req, res) => {
//   try {
//     const results = await TestResult.find().sort({ createdAt: -1 });
//     res.json(results);
//   } catch (error) {
//     res.status(500).json({
//       message: "❌ Fetch Error",
//       error: error.message,
//     });
//   }
// };
const TestResult = require("../models/TestResult");
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// ✅ Submit Test + Save Result
exports.submitTest = async (req, res) => {
  try {
    const { answers, score, ...studentInfo } = req.body;
    
    // Calculate section-wise scores
    const questions = [
      // Aptitude (0-9)
      { q: "What is 25% of 480?", answer: "120", category: "Aptitude" },
      { q: "Train travels 60 km in 1 hour. Distance in 2.5 hours?", answer: "150", category: "Aptitude" },
      { q: "Next number: 2, 4, 8, 16, ?", answer: "32", category: "Aptitude" },
      { q: "Speed 72 km/h. Distance in 25 seconds?", answer: "500m", category: "Aptitude" },
      { q: "Solve: x² − 9x + 20 = 0", answer: "4, 5", category: "Aptitude" },
      { q: "Square of 12?", answer: "144", category: "Aptitude" },
      { q: "5 workers finish in 10 days. 10 workers finish in?", answer: "5", category: "Aptitude" },
      { q: "Series: 2, 6, 12, 20, 30, ?", answer: "42", category: "Aptitude" },
      { q: "10% discount on ₹500. Selling price?", answer: "450", category: "Aptitude" },
      { q: "√x = 7, x = ?", answer: "49", category: "Aptitude" },
      // Reasoning (10-19)
      { q: "Missing number: 5, 11, 23, 47, ?", answer: "95", category: "Reasoning" },
      { q: "Odd one out?", answer: "Cube", category: "Reasoning" },
      { q: "Series: 3, 6, 9, 12, ?", answer: "15", category: "Reasoning" },
      { q: "Monday + 5 days?", answer: "Saturday", category: "Reasoning" },
      { q: "All programmers are gamers. Some gamers are students. Conclusion?", answer: "Some programmers may be gamers", category: "Reasoning" },
      { q: "Mirror image of 3:25?", answer: "8:35", category: "Reasoning" },
      { q: "If A=1, B=2, C=3 then CAB = ?", answer: "312", category: "Reasoning" },
      { q: "Mirror image of LEFT?", answer: "TFEL", category: "Reasoning" },
      // English (20-24)
      { q: "Correct spelling?", answer: "Receive", category: "English" },
      { q: "Synonym of Happy?", answer: "Joyful", category: "English" },
      { q: "Correct sentence?", answer: "He doesn't know", category: "English" },
      { q: "Fill blank: She ___ going to school.", answer: "is", category: "English" },
      { q: "Correct sentence?", answer: "He goes", category: "English" },
      { q: "Meaning of Honest?", answer: "Truthful", category: "English" },
      { q: "Plural of Child?", answer: "Children", category: "English" },
    ];

    // Calculate section scores and prepare answer details
    let aptitudeScore = 0;
    let reasoningScore = 0;
    let englishScore = 0;
    const answerDetails = [];

    questions.forEach((q, index) => {
      const selectedAnswer = answers[index] || '';
      const isCorrect = selectedAnswer === q.answer;
      
      answerDetails.push({
        questionIndex: index,
        question: q.q,
        selectedAnswer,
        correctAnswer: q.answer,
        isCorrect,
        category: q.category
      });

      if (isCorrect) {
        if (q.category === 'Aptitude') aptitudeScore++;
        else if (q.category === 'Reasoning') reasoningScore++;
        else if (q.category === 'English') englishScore++;
      }
    });

    // Create test result with all data
    const testData = {
      ...studentInfo,
      answers,
      score,
      aptitudeScore,
      reasoningScore,
      englishScore,
      answerDetails,
      totalQuestions: 25,
      status: 'completed'
    };

    const data = new TestResult(testData);
    await data.save();

    res.status(201).json({
      message: "✅ Test Submitted Successfully",
      result: data,
    });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({
      message: "❌ Submit Error",
      error: error.message,
    });
  }
};

// ✅ Get All Results with filters
exports.getResults = async (req, res) => {
  try {
    const { search, college, batch, fromDate, toDate } = req.query;
    
    // Build filter query
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (college) {
      query.collegeName = { $regex: college, $options: 'i' };
    }
    
    if (batch) {
      query.batch = batch;
    }
    
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    const results = await TestResult.find(query)
      .sort({ createdAt: -1 })
      .select('-answerDetails'); // Exclude answer details for list view

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({
      message: "❌ Fetch Error",
      error: error.message,
    });
  }
};

// ✅ Get Single Result by ID
exports.getResultById = async (req, res) => {
  try {
    const result = await TestResult.findById(req.params.id);
    
    if (!result) {
      return res.status(404).json({
        message: "❌ Result not found"
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Fetch Error",
      error: error.message,
    });
  }
};

// ✅ Export to Excel
exports.exportToExcel = async (req, res) => {
  try {
    const results = await TestResult.find().sort({ createdAt: -1 });

    // Prepare data for Excel
    const excelData = results.map((result, index) => ({
      'S.No': index + 1,
      'Name': result.name,
      "Father's Name": result.fatherName,
      'Email': result.email,
      'Mobile': result.mobile,
      'College': result.collegeName,
      'Batch': result.batch,
      'Semester': result.semester,
      'Address': result.address,
      'Total Score': result.score,
      'Aptitude Score': result.aptitudeScore,
      'Reasoning Score': result.reasoningScore,
      'English Score': result.englishScore,
      'Percentage': `${((result.score / 25) * 100).toFixed(2)}%`,
      'Status': result.status,
      'Submitted On': new Date(result.createdAt).toLocaleString()
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Test Results');
    
    // Set column widths
    const colWidths = [
      { wch: 5 },  // S.No
      { wch: 20 }, // Name
      { wch: 20 }, // Father's Name
      { wch: 25 }, // Email
      { wch: 15 }, // Mobile
      { wch: 25 }, // College
      { wch: 10 }, // Batch
      { wch: 10 }, // Semester
      { wch: 25 }, // Address
      { wch: 12 }, // Total Score
      { wch: 15 }, // Aptitude Score
      { wch: 15 }, // Reasoning Score
      { wch: 15 }, // English Score
      { wch: 10 }, // Percentage
      { wch: 10 }, // Status
      { wch: 20 }  // Submitted On
    ];
    ws['!cols'] = colWidths;

    // Generate Excel file
    const filename = `test_results_${Date.now()}.xlsx`;
    const filepath = path.join(__dirname, '../exports', filename);
    
    // Ensure exports directory exists
    if (!fs.existsSync(path.join(__dirname, '../exports'))) {
      fs.mkdirSync(path.join(__dirname, '../exports'));
    }

    XLSX.writeFile(wb, filepath);
    
    // Send file to client
    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      // Delete file after download
      fs.unlinkSync(filepath);
    });

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      message: "❌ Export Error",
      error: error.message,
    });
  }
};

// ✅ Import from Excel
exports.importFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "❌ No file uploaded"
      });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const importedResults = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      try {
        const row = data[i];
        
        // Validate required fields
        if (!row['Name'] || !row['Email'] || !row['Mobile']) {
          errors.push(`Row ${i + 2}: Missing required fields (Name, Email, Mobile)`);
          continue;
        }

        // Create test result from imported data
        const testResult = new TestResult({
          name: row['Name'],
          fatherName: row["Father's Name"] || '',
          email: row['Email'],
          mobile: row['Mobile'],
          collegeName: row['College'] || '',
          batch: row['Batch'] || '',
          semester: row['Semester'] || '',
          address: row['Address'] || '',
          score: row['Total Score'] || 0,
          aptitudeScore: row['Aptitude Score'] || 0,
          reasoningScore: row['Reasoning Score'] || 0,
          englishScore: row['English Score'] || 0,
          status: row['Status'] || 'completed'
        });

        await testResult.save();
        importedResults.push(testResult);
      } catch (err) {
        errors.push(`Row ${i + 2}: ${err.message}`);
      }
    }

    // Delete uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: `✅ Imported ${importedResults.length} records successfully`,
      imported: importedResults.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({
      message: "❌ Import Error",
      error: error.message,
    });
  }
};

// ✅ Get Statistics
exports.getStatistics = async (req, res) => {
  try {
    const totalTests = await TestResult.countDocuments();
    const averageScore = await TestResult.aggregate([
      { $group: { _id: null, avg: { $avg: "$score" } } }
    ]);
    
    const collegeStats = await TestResult.aggregate([
      { $group: { 
        _id: "$collegeName", 
        count: { $sum: 1 },
        avgScore: { $avg: "$score" }
      }},
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const scoreDistribution = await TestResult.aggregate([
      { $bucket: {
        groupBy: "$score",
        boundaries: [0, 5, 10, 15, 20, 25],
        default: "25",
        output: {
          count: { $sum: 1 }
        }
      }}
    ]);

    res.json({
      success: true,
      data: {
        totalTests,
        averageScore: averageScore[0]?.avg || 0,
        collegeStats,
        scoreDistribution
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "❌ Statistics Error",
      error: error.message,
    });
  }
};

// ✅ Delete Result
exports.deleteResult = async (req, res) => {
  try {
    const result = await TestResult.findByIdAndDelete(req.params.id);
    
    if (!result) {
      return res.status(404).json({
        message: "❌ Result not found"
      });
    }

    res.json({
      success: true,
      message: "✅ Result deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "❌ Delete Error",
      error: error.message,
    });
  }
};