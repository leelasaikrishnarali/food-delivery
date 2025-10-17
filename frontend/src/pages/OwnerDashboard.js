import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateRestaurant from './CreateRestaurant';
import './OwnerDashboard.css';

function OwnerDashboard() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
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

        if (response.data && Object.keys(response.data).length > 0) {
          setRestaurant(response.data);
        } else {
          setRestaurant(null);
        }
      } catch (err) {
        console.error('Error fetching restaurant:', err);
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  const handleEnter = () => {
    if (restaurant?.id) {
      navigate(`/restaurant/${restaurant.id}/foods`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  if (loading) return <div className="owner-dashboard">Loading...</div>;

  return (
    <div className="owner-dashboard">
      <div className="dashboard-header">
        <h2>My Restaurant</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      {restaurant ? (
        <div className="restaurant-card">
          <h3>{restaurant.name}</h3>
          <p><strong>Description:</strong> {restaurant.description}</p>
          <p><strong>Cuisine:</strong> {restaurant.cuisineType}</p>
          <p><strong>Address:</strong> {restaurant.address}</p>
          <p><strong>Opening Hours:</strong> {restaurant.openingHours}</p>
          <img
            src={restaurant.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'}
            alt="Restaurant"
            className="restaurant-image"
          />
          <button className="enter-button" onClick={handleEnter}>Enter</button>
        </div>
      ) : (
        <CreateRestaurant />
      )}
    </div>
  );
}

export default OwnerDashboard;
