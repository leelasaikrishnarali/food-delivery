import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerDashboard from './pages/CustomerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import CreateRestaurant from './pages/CreateRestaurant';
import ProtectedRoute from './mycomponents/ProtectedRoute';
import RestaurantMenu from './pages/RestaurantMenu';
import RestaurantFoods from './pages/RestaurantFoods';
import CartPage from './pages/CartPage'; // ✅ NEW
import CheckoutPage from './pages/CheckoutPage';
import { CartProvider } from './CartContext';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderStatusPage from './pages/OrderStatusPage';

function App() {
  return (
    <CartProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create-restaurant" element={<CreateRestaurant />} />
        <Route path="/menu" element={<CustomerDashboard />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/orders/:orderId" element={<OrderStatusPage />} />

        {/* Role-Based Protected Routes */}
        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute allowedRole="ROLE_CUSTOMER">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner-dashboard"
          element={
            <ProtectedRoute allowedRole="ROLE_RESTAURANT_OWNER">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/foods"
          element={
            <ProtectedRoute allowedRole="ROLE_RESTAURANT_OWNER">
              <RestaurantFoods />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/menu"
          element={
            <ProtectedRoute allowedRole="ROLE_CUSTOMER">
              <RestaurantMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRole="ROLE_CUSTOMER">
              <CartPage userId={parseInt(localStorage.getItem("userId"))} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRole="ROLE_CUSTOMER">
              <CheckoutPage userId={parseInt(localStorage.getItem("userId"))} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </CartProvider>
  );
}

export default App;
