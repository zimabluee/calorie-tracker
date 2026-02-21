import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddMeal from './AddMeal'; 

const Dashboard = ({ token }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(2000);

  // 1. DATE STATE: Defaults to today
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // 2. FETCH MEALS: Filters by the selectedDate
  const fetchMeals = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/meals?date=${selectedDate}`, {
        headers: { 'x-auth-token': token }
      });
      setMeals(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
      setLoading(false);
    }
  };

  // 3. DELETE MEAL: Fixed URL with proper slash and backticks
  const deleteMeal = async (id) => {
    
      try {
        await axios.delete(`http://127.0.0.1:5000/api/meals/${id}`, {
          headers: { 'x-auth-token': token }
        });
        fetchMeals(); 
      } catch (err) {
        console.error("Delete Error:", err.response);
        alert("Could not delete meal. Check backend routes.");
      }
    
  };

  const saveGoal = () => {
    setCalorieGoal(tempGoal);
    setIsEditingGoal(false);
  };

  // 4. FIND MEAL: Runs whenever token or selectedDate changes
  useEffect(() => {
    fetchMeals();
  }, [token, selectedDate]);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const remaining = calorieGoal - totalCalories;
  const isOver = totalCalories > calorieGoal;

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '0 20px', fontFamily: 'Arial' }}>
      
      {/* DATE PICKER SECTION */}
      <div style={{ marginBottom: '20px', textAlign: 'center', backgroundColor: '#fff', padding: '15px', borderRadius: '8px' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>View Date:</label>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      {/* CALORIE SUMMARY CARD */}
      <div style={{
        backgroundColor: isOver ? '#ffebee' : '#e8f5e9',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center',
        border: `2px solid ${isOver ? '#ef5350' : '#66bb6a'}`,
        marginBottom: '20px'
      }}>
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
        
        <div style={{ width: '100%', backgroundColor: '#ddd', borderRadius: '10px', height: '10px', marginTop: '10px' }}>
          <div style={{ 
            width: `${Math.min((totalCalories / calorieGoal) * 100, 100)}%`, 
            backgroundColor: isOver ? '#ef5350' : '#66bb6a',
            height: '100%', borderRadius: '10px'
          }}></div>
        </div>
      </div>

      <h3 style={{ borderBottom: '2px solid #333' }}>Add Food</h3>
      {/*  selectedDate to AddMeal */}
      <AddMeal token={token} onMealAdded={fetchMeals} selectedDate={selectedDate} />

      <h3 style={{ marginTop: '30px' }}>Today's Log</h3>
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        {meals.length > 0 ? (
          meals.map(meal => (
            <div key={meal._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee' }}>
              <div>
                <span style={{ display: 'block', fontWeight: '500' }}>{meal.foodName}</span>
                {/*Using meal data */}
                <small style={{ color: '#888' }}>
                  {meal.calories} kcal | P: {meal.protein || 0}g | C: {meal.carbs || 0}g | F: {meal.fat || 0}g
                </small>
              </div>
              <button onClick={() => deleteMeal(meal._id)} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <p style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No meals logged for this date.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;