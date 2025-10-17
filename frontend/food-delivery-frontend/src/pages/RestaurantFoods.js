import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './RestaurantFoods.css';

function RestaurantFoods() {
  const { restaurantId } = useParams();
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    price: '',
    foodCategory: '',
  });

  const fetchFoods = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`http://localhost:8080/api/foods/restaurant/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFoods(response.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [restaurantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`http://localhost:8080/api/foods/create/${restaurantId}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setForm({ name: '', description: '', imageUrl: '', price: '', foodCategory: '' });
      fetchFoods();
    } catch (error) {
      console.error('Error adding food:', error);
    }
  };

  const handleDelete = async (foodId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:8080/api/foods/${foodId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchFoods();
    } catch (error) {
      console.error('Error deleting food:', error);
    }
  };

  return (
    <div className="foods-container">
      <div className="foods-overlay" />
      <motion.div
        className="foods-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="top-bar">
          <Link to="/owner-dashboard" className="back-link">← Back to Dashboard</Link>
          <h2>Food Items</h2>
        </div>

        <form onSubmit={handleSubmit} className="food-form">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
          <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} required />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input name="foodCategory" placeholder="Category" value={form.foodCategory} onChange={handleChange} required />
          <button type="submit">Add Food</button>
        </form>

        <div className="food-list">
          {Array.isArray(foods) && foods.length > 0 ? (
            foods.map((food) => (
              <motion.div
                key={food.id}
                className="food-card"
                whileHover={{ scale: 1.02 }}
              >
                <img src={food.imageUrl} alt={food.name} />
                <h4>{food.name}</h4>
                <p>{food.description}</p>
                <p><strong>₹{food.price}</strong> • {food.foodCategory}</p>
                <button className="delete-button" onClick={() => handleDelete(food.id)}>🗑️</button>
              </motion.div>
            ))
          ) : (
            <p>No food items found.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default RestaurantFoods;
