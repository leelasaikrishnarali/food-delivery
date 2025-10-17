import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './RestaurantDashboard.css';

function RestaurantDashboard() {
  const [restaurant, setRestaurant] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:8080/api/restaurants/my', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRestaurant(response.data);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      }
    };

    fetchRestaurant();
  }, []);

  const backgroundImage =
    restaurant?.imageUrl ||
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80';

  return (
    <div
      className="dashboard-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="overlay" />
      <div className="dashboard-content">
        {restaurant ? (
          <motion.div
            className="restaurant-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3>{restaurant.name}</h3>
            <p><strong>Description:</strong> {restaurant.description}</p>
            <p><strong>Cuisine:</strong> {restaurant.cuisineType}</p>
            <p><strong>Address:</strong> {restaurant.address}</p>
            <p><strong>Hours:</strong> {restaurant.openingHours}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/restaurant/${restaurant.id}/foods`)}
            >
              Enter
            </motion.button>
          </motion.div>
        ) : (
          <motion.p
            className="empty-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            No restaurant found.
          </motion.p>
        )}
      </div>
    </div>
  );
}

export default RestaurantDashboard;
