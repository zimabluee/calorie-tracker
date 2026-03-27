const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

// @route    GET /api/food/search/:query
// @desc     Search Edamam for food 
router.get('/search/:query', auth, async (req, res) => {
  try {
    const { query } = req.params;
    
    // Don't call Edamam if query is empty or too short
    if (!query || query.length < 2) {
      return res.json([]); 
    }

    // The External API Call
    // Fix 1: Renamed 'res' to 'response' to avoid conflict with the Express 'res' object
    // Fix 2: Changed 'searchTerm' to 'query' to match the destructured variable
    // Fix 3: Standardized env variable names 
    const response = await axios.get(`https://api.edamam.com/api/food-database/v2/parser`, {
      params: {
        ingr: query, 
        app_id: process.env.EDAMAM_APP_ID, 
        app_key: process.env.EDAMAM_APP_KEY
      }
    });

    // Return the data
    res.json(response.data.hints || []);

  } catch (err) {
    console.error("Edamam Search Error:", err.message);
    // Fix 4: Standardized error key from 'msg' to 'message' as per feedback
    res.status(500).json({ message: "Failed to fetch food data" });
  }
});

module.exports = router;