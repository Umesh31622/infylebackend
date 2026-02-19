const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");



const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("✅ Backend Working Perfectly");
});

// Start Server
const PORT = process.env.PORT || 9007;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
