const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile_picture: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  mobileNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  boughtPolicies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BoughtPolicy",
    },
  ],
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
  claimedPolicies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClaimPolicy",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
