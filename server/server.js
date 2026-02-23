require('dotenv').config();
const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());        
app.use(express.json()); 

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/meals', require('./routes/meals'));
app.use('/api/food', require('./routes/food'));

// 1. Connect to MongoDB (Only one connection needed!)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("------------------------------------------");
    console.log("✅ SUCCESS: Connected to MongoDB Atlas!");
    console.log("------------------------------------------");
  })
  .catch((err) => {
    console.log("------------------------------------------");
    console.error("❌ ERROR: Connection Failed.");
    console.error("Reason:", err.message);
    console.log("------------------------------------------");
  });

// 2. Base Route
app.get('/', (req, res) => {
  res.send('Calorie Tracker API is running...');
});

// 3. Start the Server (Must be uncommented to work!)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is humming along on http://localhost:${PORT}`);
});