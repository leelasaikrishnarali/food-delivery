package com.restaurant.service;

import com.restaurant.model.Cart;
import com.restaurant.model.Order;
import com.restaurant.model.OrderItem;
import com.restaurant.model.User;
import com.restaurant.repository.CartRepository;
import com.restaurant.repository.OrderRepository;
import com.restaurant.repository.RestaurantRepository;
import com.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    public Order placeOrder(Long userId){
        User user = userRepository.findById(userId).orElseThrow();
        List<Cart> cartItems = cartRepository.findByUserId(userId);

        if (cartItems.isEmpty()){
            throw new RuntimeException("Cart is Empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setDeliveryAddress(user.getAddress());
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        double totalPrice = 0;
        int totalItems = 0;

        for (Cart cart:cartItems){
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setFood(cart.getFood());
            item.setPrice(cart.getFood().getPrice() * cart.getTotal());
            item.setQuantity(cart.getTotal());

            totalItems += cart.getTotal();
            totalPrice += item.getPrice();

            orderItems.add(item);
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalPrice);
        order.setTotalItem(totalItems);
        order.setTotalPrice(totalPrice);
        order.setOrderStatus("PENDING");

        order.setRestaurant(cartItems.get(0).getFood().getRestaurant());

        Order savedOrder = orderRepository.save(order);

        cartRepository.deleteAll(cartItems);

        return savedOrder;
    }

    public List<Order> getOrdersForUser (Long userId){
        return orderRepository.findByUserId(userId);
    }

    public void updateOrderStatus(Long orderId, String status){
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setOrderStatus(status);
        orderRepository.save(order);
    }
}
