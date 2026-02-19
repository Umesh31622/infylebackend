// // const express = require("express");
// // const cors = require("cors");
// // require("dotenv").config();

// // const connectDB = require("./config/db");

// // const authRoutes = require("./routes/authRoutes");
// // const testRoutes = require("./routes/testRoutes");



// // const app = express();

// // // Middleware
// // app.use(cors());
// // app.use(express.json());

// // // Connect DB
// // connectDB();

// // // Routes
// // app.use("/api/auth", authRoutes);
// // app.use("/api/test", testRoutes);
// // // Test Route
// // app.get("/", (req, res) => {
// //   res.send("✅ Backend Working Perfectly");
// // });

// // // Start Server
// // const PORT = process.env.PORT || 9007;

// // app.listen(PORT, () => {
// //   console.log(`🚀 Server running on port ${PORT}`);
// // });

// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const connectDB = require("./config/db");

// const authRoutes = require("./routes/authRoutes");
// const testRoutes = require("./routes/testRoutes");

// const app = express();

// // ✅ Allowed Frontend Origins
// const allowedOrigins = [
//   "http://localhost:3000",
//   "http://localhost:3001",
//   "https://test.infyle.in",
//   "https://admintest.infyle.in",
// ];

// // ✅ CORS Middleware (Render Safe)
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("❌ Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // ✅ Manual OPTIONS Fix (Render Preflight Safe)
// app.use((req, res, next) => {
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

// // Middleware
// app.use(express.json());

// // Connect Database
// connectDB();

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/test", testRoutes);

// // Root Route
// app.get("/", (req, res) => {
//   res.send("✅ Backend Working Perfectly on Render");
// });

// // Server Start
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

// Middleware
app.use(express.json());

// CORS Allowed Origins
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://test.infyle.in",
      "https://admintest.infyle.in",
    ],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

app.get("/", (req, res) => {
  res.send("✅ Backend Working Perfectly on Render");
});

// Connect DB
connectDB();

// ✅ Render Port Binding Fix
const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
