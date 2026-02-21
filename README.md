# MERN Stack Calorie Tracker

A full-stack nutritional tracking application that allows users to search for food items, log their daily intake, and monitor their calorie goals.

## Features
- **Secure Authentication:** User registration and login using JWT (JSON Web Tokens) and Bcrypt password hashing.
- **Real-time Food Search:** Integration with the **Edamam API** to fetch accurate nutritional data.
- **Personalized Dashboard:** Track daily totals (Calories, Protein, Carbs, Fats) and manage meal logs.
- **Data Persistence:** User data and meal history are stored securely in a MongoDB database.
- **Protected Routes:** Custom backend middleware ensures only logged-in users can access or modify their data.

## Tech Stack
- **Frontend:** React.js, Axios, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT, LocalStorage

## Installation & Setup

### 1. Backend Setup
- Navigate to the `server` directory.
- Run `npm install`.
- Create a `.env` file and add your credentials:
  ```env
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_random_secret_key