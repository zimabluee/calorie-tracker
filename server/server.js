require('dotenv').config(); // Loads .env variables
const authRoutes = require('./routes/auth');
const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const Meal = require('./models/Meal');

// Middleware
app.use(cors());       
app.use(express.json()); 
app.use('/api/auth', require('./routes/auth'));
app.use('/api/meals', require('./routes/meals'));
app.use('/api/food', require('./routes/food'));

// 1. Connect to MongoDB --- Only local now
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("------------------------------------------");
    console.log("✅ SUCCESS: Connected to LOCAL MongoDB!");
    console.log("------------------------------------------");
  })
  .catch((err) => {
    console.log("------------------------------------------");
    console.error("❌ ERROR: Connection Failed.");
    console.error("Reason:", err.message);
    console.log("------------------------------------------");
  });
// 2. Test if the server is alive
app.get('/', (req, res) => {
  res.send('Calorie Tracker API is running...');
});

// 3. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running'));