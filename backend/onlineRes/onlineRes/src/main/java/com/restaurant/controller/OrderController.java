package com.restaurant.controller;

import com.restaurant.model.Order;
import com.restaurant.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(@RequestParam Long userId) {
        Order order = orderService.placeOrder(userId);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrders(@PathVariable Long userId){
        return orderService.getOrdersForUser(userId);
    }

    @PutMapping("/status")
    public void updateStatus(@RequestParam Long orderId,
                             @RequestParam String status){
        orderService.updateOrderStatus(orderId, status);
    }
}
