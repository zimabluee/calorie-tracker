require('dotenv').config();
const dns = require('node:dns/promises');
dns.setDefaultResultOrder('ipv4first');
const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const corsOptions = { 
  origin: ['https://calorie-tracker-two-taupe.vercel.app', 'http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true, // Recommended for handling tokens/cookies
  optionsSuccessStatus: 200
};

app.use(express.json()); 
app.use(cors(corsOptions));      

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/meals', require('./routes/meals'));
app.use('/api/food', require('./routes/food'));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000, // Wait 10 seconds
  family: 4 // Force IPv4
})
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