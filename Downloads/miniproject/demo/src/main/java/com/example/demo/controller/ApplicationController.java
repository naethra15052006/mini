package com.example.demo.controller;

import com.example.demo.entity.Application;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/my-applications")
    public ResponseEntity<List<Application>> getMyApplications(Authentication authentication) {
        String username = authentication.getName();
        User currentUser = userRepository.findByEmail(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        List<Application> applications = applicationService.getMyApplications(currentUser.getId());
        return ResponseEntity.ok(applications);
    }

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<Map<String, String>> applyToJob(
            @PathVariable Long jobId,
            @RequestBody Application application,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            Application saved = applicationService.applyToJob(currentUser.getId(), jobId, application);
            return ResponseEntity.ok(Map.of("message", "Application submitted successfully", "id", saved.getId().toString()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/my-applications-employer")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Application>> getEmployerApplications(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        User employer = userRepository.findByEmail(username).orElseThrow();
        List<Application> applications = applicationService.getEmployerApplications(employer.getId());
        return ResponseEntity.ok(applications);
    }
    
    @PutMapping("/{applicationId}/accept")
    public ResponseEntity<String> acceptApplication(@PathVariable Long applicationId, Authentication authentication) {
        String username = authentication.getName();
        User employer = userRepository.findByEmail(username).orElseThrow();
        Application application = applicationService.getApplicationByIdWithEmployer(applicationId, employer.getId());
        applicationService.updateApplicationStatus(applicationId, "APPROVED");
        return ResponseEntity.ok("Application approved");
    }
    
    @PutMapping("/{applicationId}/reject")
    public ResponseEntity<String> rejectApplication(@PathVariable Long applicationId, Authentication authentication) {
        String username = authentication.getName();
        User employer = userRepository.findByEmail(username).orElseThrow();
        Application application = applicationService.getApplicationByIdWithEmployer(applicationId, employer.getId());
        applicationService.updateApplicationStatus(applicationId, "REJECTED");
        return ResponseEntity.ok("Application rejected");
    }
    
    @PutMapping("/{applicationId}/status/{status}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> updateApplicationStatus(@PathVariable Long applicationId, @PathVariable String status, Authentication authentication) {
        String username = authentication.getName();
        User employer = userRepository.findByEmail(username).orElseThrow();
        Application application = applicationService.getApplicationByIdWithEmployer(applicationId, employer.getId());
        applicationService.updateApplicationStatus(applicationId, status);
        return ResponseEntity.ok("Status updated to " + status);
    }
}

