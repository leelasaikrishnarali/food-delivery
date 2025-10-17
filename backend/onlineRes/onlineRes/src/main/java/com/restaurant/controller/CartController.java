package com.restaurant.controller;

import com.restaurant.model.Cart;
import com.restaurant.security.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cartitems")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public Cart addToCart(@RequestParam Long userId,
                            @RequestParam Long foodId,
                            @RequestParam int total){
        return cartService.saveToCart(userId, foodId, total);
    }

    @GetMapping("/user/{userId}")
    public List<Cart> getCartItems(@PathVariable Long userId){
        return cartService.getCartItems(userId);
    }

    @DeleteMapping("/delete/{cartItemId}")
    public void deleteCartItem(@PathVariable Long cartItemId){
        cartService.removeFromCart(cartItemId);
    }

    @GetMapping("/summary/{userId}")
    public Map<String, Object> getCartSummary(@PathVariable Long userId){
        return cartService.getCartSummary(userId);
    }

    @GetMapping("/cartupdate/{cartItemId}")
    public Cart updateQuantity(@PathVariable Long cartItemId,
                               @RequestParam int quantity){
        return cartService.updateQuantity(cartItemId, quantity);
    }
}
