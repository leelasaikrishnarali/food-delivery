import React from 'react';
import './WelcomePage.css';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function WelcomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="home">
      <div className="overlay">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Welcome to</h1>
          <h2>Food Delivery App</h2>
          <p>Order your favorite meals from nearby restaurants.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default WelcomePage;
