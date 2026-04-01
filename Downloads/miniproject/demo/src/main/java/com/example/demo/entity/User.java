package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(unique = true)
    private String email;
    
    private String password;


    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    private Double latitude;
    private Double longitude;
    private String skills;
    private String availability;
    private Double rating;
    
    // Additional worker fields
    private Integer age;
    private String experience;
    private String phoneNumber;

public enum Role {
        WORKER, EMPLOYER, ADMIN
    }

    public enum Status {
        ACTIVE, BLOCKED
    }
}
