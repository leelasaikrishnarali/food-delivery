package com.restaurant.security;

import com.restaurant.model.Cart;
import com.restaurant.model.Food;
import com.restaurant.model.User;
import com.restaurant.repository.CartRepository;
import com.restaurant.repository.FoodRepository;
import com.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private UserRepository userRepository;

    public Cart saveToCart(Long userId, Long foodId, int quantity){
        Food food = foodRepository.findById(foodId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();

        Optional<Cart> existing = cartRepository.findByUserIdAndFoodId(userId, foodId);
        if (existing.isPresent()){
            Cart item = existing.get();
            item.setTotal(item.getTotal()+ quantity);
            return cartRepository.save(item);
        }

        Cart newItem = new Cart(user, food, quantity);
        return cartRepository.save(newItem);
    }

    public List<Cart> getCartItems(Long userId){
        return cartRepository.findByUserId(userId);
    }

    public void removeFromCart(Long cartItemId){
        cartRepository.deleteById(cartItemId);
    }

    public Map<String, Object> getCartSummary(Long userId){
        List<Cart> items = cartRepository.findByUserId(userId);

        double total = items.stream()
                .mapToDouble(item -> item.getFood().getPrice() * item.getTotal())
                .sum();

        Map<String, Object> summary = new HashMap<>();
        summary.put("items", items);
        summary.put("totalprice", total);
        summary.put("totalitems", items.size());

        return summary;
    }

    public Cart updateQuantity(Long cartItemId, int quantity){
        Cart item = cartRepository.findById(cartItemId).orElseThrow();
        item.setTotal(quantity);
        return cartRepository.save(item);
    }
}
