import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import './CreateRestaurant.css';

function CreateRestaurant() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    cuisineType: '',
    address: '',
    openingHours: '',
    imageUrl: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in to create a restaurant.');
        return;
      }

      const decoded = jwtDecode(token);
      const email = decoded.sub || decoded.email;

      const payload = {
        ...form,
        ownerEmail: email,
      };

      const response = await axios.post('http://localhost:8080/api/restaurants/create', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const createdRestaurant = response.data;
      const restaurantId = createdRestaurant.id;

      navigate(`/restaurant/${restaurantId}/foods`);
    } catch (error) {
      console.error('Failed to create restaurant:', error);
      alert('Error creating restaurant. Please try again.');
    }
  };

  const backgroundStyle = {
    backgroundImage: form.imageUrl
      ? `url(${form.imageUrl})`
      : `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')`,
  };

  return (
    <div className="page-container" style={backgroundStyle}>
      <div className="overlay">
        <motion.div
          className="form-box"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Create Your Restaurant</h2>
          <form onSubmit={handleSubmit}>
            <label>Restaurant Name:</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required />

            <label>Description:</label>
            <input type="text" name="description" value={form.description} onChange={handleChange} required />

            <label>Cuisine Type:</label>
            <input type="text" name="cuisineType" value={form.cuisineType} onChange={handleChange} required />

            <label>Address:</label>
            <input type="text" name="address" value={form.address} onChange={handleChange} required />

            <label>Opening Hours:</label>
            <input type="text" name="openingHours" value={form.openingHours} onChange={handleChange} required />

            <label>Background Image URL:</label>
            <input type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange} required />

            {form.imageUrl && (
              <div className="preview">
                <p>Image Preview:</p>
                <img src={form.imageUrl} alt="Preview" />
              </div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Create Restaurant
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default CreateRestaurant;
