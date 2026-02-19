// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     password: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// // ✅ Correct Password Hash Middleware
// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) return;

//   this.password = await bcrypt.hash(this.password, 10);
// });

// module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
