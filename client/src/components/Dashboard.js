import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 
import axios from 'axios';
import AddMeal from './AddMeal';  
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CalorieChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: '100%', height: '300px', marginBottom: '30px', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <h4 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>Calorie Trend (Current View)</h4>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="calories" stroke="#8884d8" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const Dashboard = ({ token }) => {
  const [userEmail, setUserEmail] = useState('');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(2000);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchMeals = async () => {
    try {
      const res = await axios.get(`https://calorie-tracker-a0im.onrender.com/api/meals?date=${selectedDate}`, {
        headers: { 'x-auth-token': token }
      });
      setMeals(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
      setLoading(false);
    }
  };

  const deleteMeal = async (id) => {
    try {
      await axios.delete(`https://calorie-tracker-a0im.onrender.com/api/meals/${id}`, {
        headers: { 'x-auth-token': token }
      });
      fetchMeals(); 
    } catch (err) {
      alert(err.response?.data?.msg || "Error deleting meal");
    }
  };

  const saveGoal = () => {
    setCalorieGoal(tempGoal);
    setIsEditingGoal(false);
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Only works if backend includes email in payload
        setUserEmail(decoded.email || 'User'); 
      } catch (err) {
        console.error("Invalid token format");
      }
      fetchMeals();
    }
  }, [token, selectedDate]);

  const chartData = meals.map((meal) => ({
    name: meal.foodName.substring(0, 8),
    calories: meal.calories
  }));

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const isOver = totalCalories > calorieGoal;

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '0 20px', fontFamily: 'Arial' }}>
      
      {/* 1. Logged in Status */}
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <span style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
          Logged in as: <strong>{userEmail}</strong>
        </span>
      </div>

      {/* 2. Date Picker */}
      <div style={{ marginBottom: '20px', textAlign: 'center', backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>View Date:</label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
      </div>

      <CalorieChart data={chartData} />

      {/* 3. Goal Section */}
      <div style={{ backgroundColor: isOver ? '#ffebee' : '#e8f5e9', padding: '20px', borderRadius: '12px', textAlign: 'center', border: `2px solid ${isOver ? '#ef5350' : '#66bb6a'}`, marginBottom: '20px' }}>
        {!isEditingGoal ? (
          <div onClick={() => setIsEditingGoal(true)} style={{ cursor: 'pointer' }}>
            <h2 style={{ margin: 0 }}>{totalCalories} / {calorieGoal} kcal</h2>
            <small>(Click to edit goal)</small>
          </div>
        ) : (
          <div>
            <input type="number" value={tempGoal} onChange={(e) => setTempGoal(e.target.value)} style={{ width: '80px' }} />
            <button onClick={saveGoal} style={{ marginLeft: '10px' }}>Save</button>
          </div>
        )}
      </div>

      <h3 style={{ borderBottom: '2px solid #333' }}>Add Food</h3>
      <AddMeal token={token} onMealAdded={fetchMeals} selectedDate={selectedDate} />

      <h3 style={{ marginTop: '30px' }}>Log</h3>
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        {meals.length > 0 ? (
          meals.map(meal => (
            <div key={meal._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee' }}>
              <div>
                <span style={{ fontWeight: '500' }}>{meal.foodName}</span>
                <br />
                <small style={{ color: '#888' }}>{meal.calories} kcal</small>
              </div>
              <button onClick={() => deleteMeal(meal._id)} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }}>Delete</button>
            </div>
          ))
        ) : (
          <p style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No meals logged.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;