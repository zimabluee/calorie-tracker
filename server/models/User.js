const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Prevents two people from using the same email
  },
  password: {
    type: String,
    required: true,
  },
  dailyCalorieGoal: {
    type: Number,
    default: 2000, // A default goal to start with
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('User', UserSchema);