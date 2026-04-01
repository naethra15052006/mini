package com.example.demo.controller;

import com.example.demo.entity.Payment;
import com.example.demo.entity.Job;
import com.example.demo.entity.User;
import com.example.demo.service.PaymentService;
import com.example.demo.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @Autowired
    private JobService jobService;

    @PostMapping("/pay/{jobId}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<Payment> markAsPaid(@PathVariable Long jobId, @AuthenticationPrincipal User employer) {
        Job job = jobService.getJobsByEmployer(employer).stream().filter(j -> j.getId().equals(jobId)).findFirst().orElseThrow();
        // Find the approved worker for this job
        User worker = null; // This should be implemented based on applications
        return ResponseEntity.ok(paymentService.markAsPaid(job, worker));
    }

    @GetMapping("/my-payments")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<List<Payment>> getMyPayments(@AuthenticationPrincipal User worker) {
        return ResponseEntity.ok(paymentService.getPaymentsByWorker(worker));
    }
}
