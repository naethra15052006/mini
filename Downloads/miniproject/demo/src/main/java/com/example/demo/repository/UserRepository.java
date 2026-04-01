package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    List<User> findByRole(User.Role role);
    
    long countByRoleAndStatus(User.Role role, User.Status status);
    
    long countByStatus(User.Status status);
}

