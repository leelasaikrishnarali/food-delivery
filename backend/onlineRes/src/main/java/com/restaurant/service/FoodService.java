package com.restaurant.service;

import com.restaurant.model.Food;
import com.restaurant.model.Restaurant;
import com.restaurant.repository.FoodRepository;
import com.restaurant.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodService {

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    public Food saveFood(Food food, Long restaurantId){
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElseThrow();
        food.setRestaurant(restaurant);
        return foodRepository.save(food);
    }

    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    public Food getFoodById(Long id) {
        return foodRepository.findById(id).orElse(null);
    }

    public void deleteFood(Long id) {
        foodRepository.deleteById(id);
    }

    public List<Food> getFoodByRestaurantId (Long restaurantId){
       return foodRepository.findByRestaurantId(restaurantId);
    }
}
