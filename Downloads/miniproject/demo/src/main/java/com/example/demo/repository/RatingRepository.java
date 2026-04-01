package com.example.demo.repository;

import com.example.demo.entity.Rating;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByGivenTo(User givenTo);
    List<Rating> findByGivenBy(User givenBy);
}
