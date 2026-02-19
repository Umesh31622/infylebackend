// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const connectDB = require("./config/db");

// const authRoutes = require("./routes/authRoutes");
// const testRoutes = require("./routes/testRoutes");



// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Connect DB
// connectDB();

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/test", testRoutes);
// // Test Route
// app.get("/", (req, res) => {
//   res.send("✅ Backend Working Perfectly");
// });

// // Start Server
// const PORT = process.env.PORT || 9007;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");

const app = express();

// ✅ Allowed Origins List
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://test.infyle.in",
  "https://admintest.infyle.in",
];

// ✅ CORS Middleware Fix
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
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
