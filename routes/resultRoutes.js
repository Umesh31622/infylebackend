const express = require("express");
const Result = require("../models/Result");

const router = express.Router();

// Create Result
router.post("/", async (req, res) => {
  try {
    const result = new Result(req.body);
    await result.save();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Results
router.get("/", async (req, res) => {
  res.json(await Result.find());
});

// Update Result
router.put("/:id", async (req, res) => {
  res.json(
    await Result.findByIdAndUpdate(req.params.id, req.body, { new: true })
  );
});

// Delete Result
router.delete("/:id", async (req, res) => {
  await Result.findByIdAndDelete(req.params.id);
  res.json({ message: "✅ Result Deleted" });
});

module.exports = router;
