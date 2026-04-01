package com.example.demo.controller;

import com.example.demo.entity.Rating;
import com.example.demo.entity.User;
import com.example.demo.service.RatingService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "http://localhost:3000")
public class RatingController {
    @Autowired
    private RatingService ratingService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Rating> giveRating(
            @RequestParam Long userId,
            @RequestParam Double ratingValue,
            @AuthenticationPrincipal User currentUser) {
        User userToRate = userService.findById(userId);
        return ResponseEntity.ok(ratingService.giveRating(currentUser, userToRate, ratingValue));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Rating>> getRatingsForUser(@PathVariable Long userId) {
        User user = userService.findById(userId);
        return ResponseEntity.ok(ratingService.getRatingsForUser(user));
    }

    @GetMapping("/user/{userId}/average")
    public ResponseEntity<Map<String, Double>> getAverageRating(@PathVariable Long userId) {
        User user = userService.findById(userId);
        Double average = ratingService.getAverageRating(user);
        Map<String, Double> response = new HashMap<>();
        response.put("average", average);
        return ResponseEntity.ok(response);
    }
}
