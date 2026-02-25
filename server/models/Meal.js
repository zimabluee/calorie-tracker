/**
 * @model Meal
 * @description Defines the Meal Schema for MongoDB. 
 * Every meal is linked to a user ID.
 */
const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  // The 'user' field links a meal to a specific account
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  foodName: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meal', MealSchema);