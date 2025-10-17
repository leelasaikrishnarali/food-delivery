package com.restaurant.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Food food;

    private int total;

    public Cart(User customer, Food items, int total) {
        this.user = customer;
        this.food = items;
        this.total = total;
    }


}
