/**
 * @component AddMeal
 * @description The form used to log new meals.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddMeal = ({ token, onMealAdded, selectedDate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]); 

  const performSearch = async (searchTerm) => {
    try {
      //Send the food detail and selected date
      const res = await axios.get(`https://calorie-tracker-a0im.onrender.com/api/food/search/${searchTerm}`, {
        headers: { 'x-auth-token': token }
      });
      setResults(res.data);
    } catch (err) {
      console.error("Search error", err);
    }
  };

useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 1) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const selectFood = async (food) => {
    try {
      await axios.post('https://calorie-tracker-a0im.onrender.com/api/meals', {
        foodName: food.food.label,
        calories: Math.round(food.food.nutrients.ENERC_KCAL),
        protein: Math.round(food.food.nutrients.PROCNT) || 0,
        carbs: Math.round(food.food.nutrients.CHOCDF) || 0,
        fat: Math.round(food.food.nutrients.FAT) || 0,
        date: selectedDate 
      }, {
        headers: { 'x-auth-token': token }
      });
      
      setQuery('');
      setResults([]);
      onMealAdded();
    } catch (err) {
      alert("Error adding food");
    }
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <input
        type="text"
        placeholder="Search for a food (e.g. Chicken)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      {results.length > 0 && (
        <div style={{ 
          border: '1px solid #eee', 
          borderRadius: '4px', 
          marginTop: '5px', 
          maxHeight: '200px', 
          overflowY: 'auto',
          backgroundColor: '#fff'
        }}>
          {results.map((item, index) => (
            <div 
              key={index} 
              onClick={() => selectFood(item)}
              style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #f9f9f9' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#fff'}
            >
              {item.food.label} <small style={{ color: '#888' }}>({Math.round(item.food.nutrients.ENERC_KCAL)} kcal)</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddMeal;