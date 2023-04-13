const mongoose = require("mongoose");
const schema = require("mongoose").Schema;
const UserSchema = new schema({
  username: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
    minLength: [3, "Name cannot be less than 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    trim: true,
    maxlength: [50, "Email cannot be more than 50 characters"],
    minLength: [3, "Email cannot be less than 3 characters"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    trim: true,

    minLength: [3, "Password cannot be less than 3 characters"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
