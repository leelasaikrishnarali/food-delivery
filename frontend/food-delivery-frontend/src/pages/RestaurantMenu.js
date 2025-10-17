import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './RestaurantMenu.css';

function RestaurantMenu() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const foodRes = await axios.get(
          `http://localhost:8080/api/foods/restaurant/${restaurantId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFoods(foodRes.data);
      } catch (error) {
        console.error('Error fetching food items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId]);

  const handleBack = () => {
    navigate('/customer-dashboard');
  };

  const addToCart = async (foodId) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');

    try {
      await axios.post(
        `http://localhost:8080/api/cartitems/add?userId=${userId}&foodId=${foodId}&total=1`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Item added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart.');
    }
  };

  if (loading) return <div className="restaurant-menu">Loading menu...</div>;

  return (
    <div className="restaurant-menu">
      <div className="menu-overlay" />
      <motion.div
        className="menu-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button className="back-button" onClick={handleBack}>
          ← Back to Restaurants
        </button>
        <h2>Menu</h2>
        <div className="food-list">
          {foods.length > 0 ? (
            foods.map((food) => (
              <motion.div
                key={food.id}
                className="food-card"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={food.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={food.name}
                />
                <h4>{food.name}</h4>
                <p>{food.description}</p>
                <p>
                  <strong>₹{food.price}</strong> • {food.foodCategory}
                </p>
                <button onClick={() => addToCart(food.id)}>Add to Cart</button>
              </motion.div>
            ))
          ) : (
            <p>No food items available.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default RestaurantMenu;
