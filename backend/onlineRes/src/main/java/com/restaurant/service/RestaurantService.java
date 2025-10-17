package com.restaurant.service;

import com.restaurant.model.Restaurant;
import com.restaurant.model.User;
import com.restaurant.repository.RestaurantRepository;
import com.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private UserRepository userRepository;

    public Restaurant createRestaurant(@RequestBody Restaurant restaurant, String ownerEmail){
        User owner = userRepository.findByEmail(ownerEmail).orElseThrow();
        restaurant.setOwner(owner);
        return restaurantRepository.save(restaurant);
    }

    public List<Restaurant> getAllRestaurants(){
        return restaurantRepository.findAll();
    }

    public Optional<Restaurant> getRestaurantsByOwner(String email){
        return restaurantRepository.findByOwnerEmail(email);
    }
}
