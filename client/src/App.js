/**
 * @file App.js
 * @description Main component that manages whether to show the Login/Register screen
 */

import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  // Initialize token to keep user logged in on page refresh
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // Switch between Login and Register views
  const [showRegister, setShowRegister] = useState(false);

  // Sync if the token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Logout handler
  const logout = () => {
    setToken(null);
  };

  // 1. If the user is logged in, show the Dashboard
  if (token) {
    return (
      <div className="app-container">
        <nav style={styles.nav}>
          <h1>Calorie Tracker</h1>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </nav>
        <Dashboard token={token} />
      </div>
    );
  }

  // 2. If user is not logged in, show the Register page
  return (
    <div style={styles.authWrapper}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#333' }}>Calorie Tracker</h1>
        <p style={{ color: '#666' }}>Track your meals with Edamam API</p>
      </header>

      <div style={styles.card}>
        {showRegister ? (
          <Register setToken={setToken} />
        ) : (
          <Login setToken={setToken} />
        )}

        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => setShowRegister(!showRegister)} 
            style={styles.toggleBtn}
          >
            {showRegister 
              ? "Already have an account? Log In" 
              : "Don't have an account? Register here"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  authWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f7f6',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center'
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff'
  },
  logoutBtn: {
    padding: '8px 15px',
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '0.9rem'
  }
};

export default App;