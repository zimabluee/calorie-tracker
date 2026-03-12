require('dotenv').config();
const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const corsOptions = { 
  origin: ['https://vercel.com/zimabluees-projects/calorie-tracker/EDWX9NrtCFr4iHs5MdPvpQrKCBY7', 'http://localhost:3000'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));      
app.use(express.json()); 

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/meals', require('./routes/meals'));
app.use('/api/food', require('./routes/food'));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("------------------------------------------");
    console.log("✅ SUCCESS: Connected to MongoDB Atlas!");
    console.log("------------------------------------------");
    // Only start listening once the DB is ready
    app.listen(PORT, () => {
    console.log(`🚀 Server is humming along on http://localhost:${PORT}`);
});
  })
  .catch((err) => {
    console.log("------------------------------------------");
    console.error("❌ ERROR: Connection Failed.");
    console.error("Reason:", err.message);
    console.log("------------------------------------------");
    // Exit the process so we don't have a zombie server
    process.exit(1);
  });