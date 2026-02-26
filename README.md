# Calorie Tracker

A full-stack nutritional tracking application that allows users to search for food items, log their daily intake, and monitor their calorie goals and visualize with charts.

## Live Demo
* **Frontend:** https://vercel.com/zimabluees-projects/calorie-tracker/EDWX9NrtCFr4iHs5MdPvpQrKCBY7
* **Backend:** https://calorie-tracker-a0im.onrender.com

## Features
- **Secure Authentication:** User registration and login using JWT (JSON Web Tokens) and Bcrypt password hashing.
- **Real-time Food Search:** Integration with the **Edamam API** to fetch accurate nutritional data.
- **Personalized Dashboard:** Track daily totals (Calories, Protein, Carbs, Fats) and manage meal logs.
- **Data Persistence:** User data and meal history are stored securely in a MongoDB database.
- **Protected Routes:** Custom backend middleware ensures only logged-in users can access or modify their data.

## Tech Stack
- **Frontend:** React.js, Axios, Recharts, JWT-Decode
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Cloud
- **Auth:** JWT, LocalStorage

## Installation & Setup

1. Clone the repository:

   git clone https://github.com/zimabluee/calorie-tracker

2. Install Backend:
  
   cd calorie-tracker
   npm install

3. Install Frontend:

   cd client
   npm install
   Environment Variables:

4. Create a .env file in the root directory and add:

   ---Code snippet---
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   Run the App:

5. Run this command on the backend server:
   
   npm run dev (from root)
   npm start (from client folder)