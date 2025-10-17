import React, { useState } from 'react';
import './RegisterPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // ✅ Add animation

function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_CUSTOMER');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/users/register', {
        fullname: fullName,
        email,
        password,
        role,
        status: true
      });

      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <motion.form
        className="register-form"
        onSubmit={handleRegister}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="back-link" onClick={() => navigate('/login')}>← Back to Login</p>

        <h2>Register</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

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

        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="ROLE_CUSTOMER">Customer</option>
          <option value="ROLE_RESTAURANT_OWNER">Restaurant Owner</option>
        </select>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Register
        </motion.button>
      </motion.form>
    </div>
  );
}

export default RegisterPage;
