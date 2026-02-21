const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const Meal = require('../models/Meal');

// @route   POST /api/meals
// @desc    Add a meal to a specific date
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
    console.error("POST Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/meals
// @desc    Get all meals for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const { date } = req.query; 
    let query = { user: req.user.id };

    if (date) {
      const start = new Date(date);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setUTCHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const meals = await Meal.find(query).sort({ date: -1 });
    res.json(meals);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/meals/:id
// @desc    Delete a meal
router.delete('/:id', auth, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ msg: 'Meal not found' });
    }

    // Verify ownership
    if (!meal.user || meal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to delete this meal' });
    }

    await Meal.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Meal removed' });
  } catch (err) {
    console.error("DELETE Error:", err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;