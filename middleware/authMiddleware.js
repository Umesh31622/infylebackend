// const jwt = require("jsonwebtoken");

// const protect = (req, res, next) => {
//   let token = req.headers.authorization;

//   if (token && token.startsWith("Bearer")) {
//     token = token.split(" ")[1];

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = decoded;
//       next();
//     } catch (error) {
//       return res.status(401).json({ message: "Invalid Token" });
//     }
//   } else {
//     return res.status(401).json({ message: "No Token Provided" });
//   }
// };

// module.exports = protect;

const jwt = require("jsonwebtoken");

// ✅ Protected Route Middleware
const protect = (req, res, next) => {
  let token = req.headers.authorization;

  // Check Token Exists
  if (token && token.startsWith("Bearer")) {
    token = token.split(" ")[1];

    try {
      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach User Data
      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "❌ Invalid or Expired Token",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "❌ No Token Provided",
    });
  }
};

module.exports = protect;
