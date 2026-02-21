import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
        const res = await axios.post('http://127.0.0.1:5000/api/auth/login', { email, password });
      const receivedToken = res.data.token;
      localStorage.setItem('token', receivedToken);
      setToken(res.data.token);
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Check credentials.";
      alert(msg);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
        <br />
        <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
        <br />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
