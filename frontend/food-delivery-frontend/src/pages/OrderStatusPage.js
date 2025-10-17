import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './OrderStatusPage.css';

const OrderStatusPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = parseInt(localStorage.getItem("userId"));
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/orders/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Order fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, token]);

  const handleBack = () => {
    navigate('/customer-dashboard');
  };

  if (loading) return <div className="order-status-container">Loading orders...</div>;
  if (orders.length === 0) return <div className="order-status-container">No orders found.</div>;

  return (
    <div className="order-status-container">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Orders
      </motion.h2>

      {orders.map((order) => (
        <motion.div
          key={order.id}
          className="order-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Status:</strong> {order.orderStatus}</p>
          <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
          <p><strong>Items:</strong> {order.totalItem}</p>
          <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>

          <div className="status-tracker">
            {["PENDING", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"].map((stage, index) => (
              <div
                key={index}
                className={`status-step ${order.orderStatus === stage ? "active" : ""}`}
              >
                {stage.replace(/_/g, " ")}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <motion.button
        className="back-button"
        onClick={handleBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back to Dashboard
      </motion.button>
    </div>
  );
};

export default OrderStatusPage;
