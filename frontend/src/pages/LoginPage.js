import React, { useState } from 'react';
import './LoginPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion'; // ✅ Add animation

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem('authToken', token);

      const decoded = jwtDecode(token);
      const role = decoded.role;
      const userId = decoded.userId || decoded.id || decoded.sub;

      if (!userId) {
        alert("Login failed: userId not found in token.");
        return;
      }

      localStorage.setItem('userRole', role);
      localStorage.setItem('userId', userId);

      alert('Login successful!');
      if (role === 'ROLE_CUSTOMER') {
        navigate('/customer-dashboard');
      } else if (role === 'ROLE_RESTAURANT_OWNER') {
        navigate('/owner-dashboard');
      }
    } catch (error) {
      alert('Login failed. Please check your credentials.');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <motion.form
        className="login-form"
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="back-link" onClick={() => navigate('/')}>← Back to Home</p>

        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Login
        </motion.button>

        <p className="register-link">
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')}>Register here</span>
        </p>
      </motion.form>
    </div>
  );
}

export default LoginPage;
