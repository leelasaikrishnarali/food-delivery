import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="confirmation-container">
      <div className="confirmation-overlay">
        <motion.div
          className="confirmation-box"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>🎉 Order Placed Successfully!</h2>
          <p>Your food is on its way. You can track your order in the order history.</p>

          <div className="confirmation-actions">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/menu')}
            >
              Back to Menu
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/orders')}
            >
              View My Orders
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
