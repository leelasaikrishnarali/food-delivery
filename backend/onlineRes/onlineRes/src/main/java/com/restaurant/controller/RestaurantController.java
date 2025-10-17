package com.restaurant.controller;

import com.restaurant.model.Restaurant;
import com.restaurant.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*")
public class RestaurantController {
    @Autowired
    private RestaurantService restaurantService;

    @PostMapping("/create")
    public Restaurant createRestaurant(@RequestBody Restaurant restaurant, Authentication auth){
        String email = auth.getName();
        return restaurantService.createRestaurant(restaurant, email);
    }

    @GetMapping("/my")
    public Optional<Restaurant> getRestaurantsByOwner(Authentication auth){
        String email = auth.getName();
        return restaurantService.getRestaurantsByOwner(email);
    }

    @GetMapping
    public List<Restaurant> getAllRestaurants(){
        return restaurantService.getAllRestaurants();
    }

    @GetMapping("/owner/{email}")
    public ResponseEntity<?> getRestaurantByOwner(@PathVariable String email) {
        Optional<Restaurant> restaurant = restaurantService.getRestaurantsByOwner(email);
        return restaurant.isPresent()
                ? ResponseEntity.ok(restaurant.get())
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body("No restaurant found");
    }

}
