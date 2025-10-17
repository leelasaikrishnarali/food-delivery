import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './CheckoutPage.css';

const CheckoutPage = ({ userId }) => {
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("authToken");
    setIsPlacingOrder(true);

    try {
      const placeRes = await fetch(`http://localhost:8080/api/orders/place?userId=${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!placeRes.ok) {
        const errorText = await placeRes.text();
        console.error("Order placement failed:", errorText);
        throw new Error("Order placement failed");
      }

      let placedOrder = null;
      try {
        placedOrder = await placeRes.json();
        console.log("✅ Order placed:", placedOrder);
      } catch (jsonError) {
        console.warn("⚠️ Could not parse order response:", jsonError);
      }

      const ordersRes = await fetch(`http://localhost:8080/api/orders/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!ordersRes.ok) {
        throw new Error("Failed to fetch user orders");
      }

      const orders = await ordersRes.json();
      console.log("📦 Orders fetched:", orders);

      if (!orders || orders.length === 0) {
        alert("✅ Order placed, but no order found.");
        return navigate('/orders');
      }

      const latestOrder = orders.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA || b.id - a.id;
      })[0];

      alert("✅ Order placed successfully!");
      navigate(`/orders/${latestOrder.id}`);
    } catch (err) {
      console.error("❌ Checkout error:", err);
      alert("❌ Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-overlay">
        <motion.div
          className="checkout-box"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Confirm Your Order</h2>
          <p>Your order will be delivered to your saved address. Click below to confirm.</p>
          <motion.button
            className="place-order-button"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isPlacingOrder ? "Placing Order..." : "Place Order"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;
