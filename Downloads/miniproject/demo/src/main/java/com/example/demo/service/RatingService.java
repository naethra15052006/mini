package com.example.demo.service;

import com.example.demo.entity.Rating;
import com.example.demo.entity.User;
import com.example.demo.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingService {
    @Autowired
    private RatingRepository ratingRepository;

    public Rating giveRating(User givenBy, User givenTo, Double ratingValue) {
        Rating rating = new Rating();
        rating.setGivenBy(givenBy);
        rating.setGivenTo(givenTo);
        rating.setRatingValue(ratingValue);
        return ratingRepository.save(rating);
    }

    public List<Rating> getRatingsForUser(User user) {
        return ratingRepository.findByGivenTo(user);
    }

    public Double getAverageRating(User user) {
        List<Rating> ratings = getRatingsForUser(user);
        if (ratings.isEmpty()) return 0.0;
        return ratings.stream().mapToDouble(Rating::getRatingValue).average().orElse(0.0);
    }
}
