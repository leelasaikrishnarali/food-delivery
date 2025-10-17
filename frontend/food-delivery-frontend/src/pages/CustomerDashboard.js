import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './CustomerDashboard.css';

function CustomerDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestOrderId, setLatestOrderId] = useState(null);
  const navigate = useNavigate();

  const userId = parseInt(localStorage.getItem("userId"));
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!userId || !token) {
      navigate('/login');
      return;
    }

    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/restaurants', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLatestOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/orders/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const orders = response.data;
        if (orders && orders.length > 0) {
          const latest = orders.sort((a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0) || b.id - a.id
          )[0];
          setLatestOrderId(latest.id);
        }
      } catch (error) {
        console.error('Error fetching latest order:', error);
      }
    };

    fetchRestaurants();
    fetchLatestOrder();
  }, [userId, token, navigate]);

  const handleViewMenu = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}/menu`);
  };

  const handleViewOrderStatus = () => {
    if (latestOrderId) {
      navigate(`/orders/${latestOrderId}`);
    } else {
      alert("No recent orders found.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (loading) return <div className="customer-dashboard">Loading...</div>;

  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <h2>Welcome, Foodie!</h2>
        <div className="dashboard-actions">
          <Link to="/cart" className="cart-link">🛒 Cart</Link>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <motion.div
        className="restaurant-list"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <motion.div
              key={restaurant.id}
              className="restaurant-card"
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={restaurant.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'}
                alt={restaurant.name}
              />
              <h3>{restaurant.name}</h3>
              <p>{restaurant.description}</p>
              <p><strong>Cuisine:</strong> {restaurant.cuisineType}</p>
              <button onClick={() => handleViewMenu(restaurant.id)}>View Menu</button>
            </motion.div>
          ))
        ) : (
          <p>No restaurants available.</p>
        )}
      </motion.div>

      <div className="dashboard-footer">
        <button onClick={handleViewOrderStatus}>View Latest Order Status</button>
      </div>
    </div>
  );
}

export default CustomerDashboard;
