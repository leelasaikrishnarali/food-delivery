package com.restaurant.controller;

import com.restaurant.model.Food;
import com.restaurant.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "*")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @PostMapping("/create/{restaurantId}")
    public Food createFood(@RequestBody Food food, @PathVariable Long restaurantId) {
        return foodService.saveFood(food, restaurantId);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<Food> getFoodByRestaurantId(@PathVariable Long restaurantId) {
        return foodService.getFoodByRestaurantId(restaurantId);
    }

    @GetMapping
    public List<Food> getAllFoods() {
        return foodService.getAllFoods();
    }

    @GetMapping("/{id}")
    public Food getFoodById(@PathVariable Long id) {
        return foodService.getFoodById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteFood(@PathVariable Long id) {
        foodService.deleteFood(id);
    }
}
