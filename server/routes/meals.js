/**
 * @route   READ, UPDATE, DELETE /api/meals/:id
 * @description    Browse, update, or delete meal.
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const Meal = require('../models/Meal');

router.post('/', auth, async (req, res) => {
  try {
    
    const { foodName, calories, protein, carbs, fat, date } = req.body; 
    const newMeal = new Meal({
      user: req.user.id, 
      foodName,
      calories,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      date: date || Date.now()
    });
    
    const meal = await newMeal.save();
    res.json(meal);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, date } = req.query; 
    let query = { user: req.user.id };

    // Range Query Logic
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid date range format" });
      }

      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    } 
    // Single Date Logic (Default)
    else if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      const start = new Date(parsedDate);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(parsedDate);
      end.setUTCHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    // Sort ascending so the chart draws from past to present
    const meals = await Meal.find(query).sort({ date: 1 });
    res.json(meals);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    
    // 1. Find the meal ID
    const meal = await Meal.findById(req.params.id);
    
    // 2. Check if the meal exists
    if (!meal) return res.status(404).json({ msg: 'Meal not found' });
    
    // 3. Verify owner of the meal
    if (!meal.user || meal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to delete this meal' });
    }

    // 4. Perform the deletion
    await Meal.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Meal removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;