const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

// @route   GET /api/food/search/:query
// @desc    Search Edamam for food 
router.get('/search/:query', auth, async (req, res) => {
  try {
    const { query } = req.params;
    
    // Don't call Edamam if query is empty or too short, causing api limit errors
    if (!query || query.length < 2) {
      return res.json([]); 
    }

    const appId = process.env.EDAMAM_APP_ID;
    const appKey = process.env.EDAMAM_APP_KEY;

    const response = await axios.get(
      `https://api.edamam.com/api/food-database/v2/parser?app_id=${appId}&app_key=${appKey}&ingr=${query}`
    );

    // Only return the hints
    res.json(response.data.hints || []);
  } catch (err) {
    console.error("Edamam Search Error:", err.message);
    res.status(500).json({ msg: "Failed to fetch food data" });
  }
});

module.exports = router;