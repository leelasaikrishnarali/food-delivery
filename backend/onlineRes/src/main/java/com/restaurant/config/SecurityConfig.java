package com.restaurant.config;

import org.springframework.http.HttpMethod;
import com.restaurant.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/users/login", "/api/users/register").permitAll()
                        .requestMatchers("/api/users/**").hasAuthority("ROLE_CUSTOMER")
                        .requestMatchers("/api/cartitems/**").hasAuthority("ROLE_CUSTOMER")
                        .requestMatchers(HttpMethod.POST, "/api/orders/place").hasAuthority("ROLE_CUSTOMER") // ✅ Add this
                        .requestMatchers("/api/orders/**").hasAuthority("ROLE_CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/api/foods/restaurant/**").hasAnyAuthority("ROLE_CUSTOMER", "ROLE_RESTAURANT_OWNER")
                        .requestMatchers("/api/foods/**").hasAuthority("ROLE_RESTAURANT_OWNER")
                        .requestMatchers(HttpMethod.GET, "/api/restaurants").hasAnyAuthority("ROLE_RESTAURANT_OWNER", "ROLE_CUSTOMER")
                        .requestMatchers("/api/restaurants/**").hasAuthority("ROLE_RESTAURANT_OWNER")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
