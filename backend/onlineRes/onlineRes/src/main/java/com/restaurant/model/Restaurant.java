package com.restaurant.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;
    private String description;
    private String cuisineType;
    private String address;
    @Column(length = 1000)
    private String imageUrl;
    private String openingHours;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @JsonManagedReference
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Food> foodItems;


}
