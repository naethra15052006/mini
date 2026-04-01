package com.example.demo.service;

import com.example.demo.entity.Payment;
import com.example.demo.entity.Job;
import com.example.demo.entity.User;
import com.example.demo.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    public Payment markAsPaid(Job job, User worker) {
        Payment payment = new Payment();
        payment.setJob(job);
        payment.setWorker(worker);
        payment.setAmount(job.getWage());
        payment.setStatus(Payment.PaymentStatus.PAID);
        return paymentRepository.save(payment);
    }

    public List<Payment> getPaymentsByWorker(User worker) {
        return paymentRepository.findByWorker(worker);
    }

    public List<Payment> getPaymentsByJob(Job job) {
        return paymentRepository.findByJob(job);
    }
}
