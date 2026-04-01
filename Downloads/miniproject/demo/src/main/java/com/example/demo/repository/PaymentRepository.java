package com.example.demo.repository;

import com.example.demo.entity.Payment;
import com.example.demo.entity.Job;
import com.example.demo.entity.User;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByWorker(User worker);
    List<Payment> findByJob(Job job);
    List<Payment> findByWorkerAndStatus(User worker, Payment.PaymentStatus status);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM Payment p WHERE p.job.id = :jobId")
    void deleteByJobId(@Param("jobId") Long jobId);
}
