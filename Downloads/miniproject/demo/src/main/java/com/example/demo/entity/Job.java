package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String skill;
    private Double wage;
    private String location;
    private Double latitude;
    private Double longitude;

    @ManyToOne
    @JoinColumn(name = "employer_id")
    private User employer;

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    @CreationTimestamp
    private LocalDateTime createdDate;

    public enum JobStatus {
        OPEN, CLOSED, COMPLETED
    }
}

