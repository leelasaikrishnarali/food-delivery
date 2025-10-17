import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './CartPage.css';

const CartPage = ({ userId }) => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ items: [], totalitems: 0, totalprice: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      console.warn("❌ No userId found");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("❌ No auth token found");
      return;
    }

    fetch(`http://localhost:8080/api/cartitems/summary/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch cart summary");
        return res.json();
      })
      .then(data => {
        console.log("✅ Cart summary received:", data);
        setSummary({
          items: Array.isArray(data.items) ? data.items : [],
          totalitems: data.totalitems || 0,
          totalprice: data.totalprice || 0
        });
      })
      .catch(err => {
        console.error("❌ Cart summary error:", err);
        setSummary({ items: [], totalitems: 0, totalprice: 0 });
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const removeItem = (id) => {
    const token = localStorage.getItem("authToken");
    const itemToRemove = summary.items.find(item => item.id === id);
    if (!itemToRemove) return;

    fetch(`http://localhost:8080/api/cartitems/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to delete item");
        const updatedItems = summary.items.filter(item => item.id !== id);
        const updatedTotalPrice = summary.totalprice - itemToRemove.food.price * itemToRemove.total;
        const updatedTotalItems = summary.totalitems - 1;

        setSummary({
          ...summary,
          items: updatedItems,
          totalitems: updatedTotalItems,
          totalprice: updatedTotalPrice
        });
      })
      .catch(err => console.error("❌ Remove item error:", err));
  };

  const updateQuantity = (id, quantity) => {
    const token = localStorage.getItem("authToken");

    fetch(`http://localhost:8080/api/cartitems/cartupdate/${id}?quantity=${quantity}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update quantity");
        return res.json();
      })
      .then(updatedItem => {
        const updatedItems = summary.items.map(item =>
          item.id === id ? { ...item, total: updatedItem.total } : item
        );
        const updatedTotalPrice = updatedItems.reduce(
          (sum, item) => sum + item.food.price * item.total,
          0
        );

        setSummary({
          ...summary,
          items: updatedItems,
          totalprice: updatedTotalPrice
        });
      })
      .catch(err => console.error("❌ Update quantity error:", err));
  };

  if (!userId) {
    return <p>User ID not found. Please log in again.</p>;
  }

  const cartItems = Array.isArray(summary.items) ? summary.items : [];

  return (
    <div className="cart-container">
      <motion.div
        className="cart-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>Your Cart</h2>

        <button className="back-button" onClick={() => navigate('/menu')}>
          ← Back to Menu
        </button>

        {loading ? (
          <p>Loading cart...</p>
        ) : cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-summary">
              <p>Total Items: {summary.totalitems}</p>
              <p>Total Price: ₹{summary.totalprice}</p>
              <p>Total Quantity: {cartItems.reduce((sum, item) => sum + item.total, 0)}</p>
            </div>

            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.food.imageUrl || 'https://via.placeholder.com/150x100?text=No+Image'}
                  alt={item.food.name}
                  className="cart-food-image"
                />
                <div className="cart-food-details">
                  <h4>{item.food.name}</h4>
                  <p>{item.food.description}</p>
                  <p><strong>₹{item.food.price}</strong> • {item.food.foodCategory}</p>
                  <div className="quantity-row">
                    <input
                      type="number"
                      min="1"
                      value={item.total}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    />
                    <button onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}

            <button className="checkout-button" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default CartPage;
