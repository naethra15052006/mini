package com.example.demo.controller;

import com.example.demo.entity.Job;
import com.example.demo.entity.User;
import com.example.demo.service.JobService;
import com.example.demo.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import com.example.demo.service.ApplicationService;
import com.example.demo.entity.Application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class JobController {
    @Autowired
    private JobService jobService;

@Autowired
    private UserService userService;

@Autowired
    private ApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<Job> postJob(@RequestBody Job job, @AuthenticationPrincipal UserDetails userDetails) {
        User employer = userService.findByEmail(userDetails.getUsername()).orElseThrow();
        job.setEmployer(employer);
        return ResponseEntity.ok(jobService.postJob(job));
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAllOpenJobs() {
        return ResponseEntity.ok(jobService.getAllOpenJobs());
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Job>> getNearbyJobs(@RequestParam Double latitude, @RequestParam Double longitude) {
        return ResponseEntity.ok(jobService.getJobsWithin5km(latitude, longitude));
    }

    @GetMapping("/my-jobs")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Job>> getMyJobs(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        System.out.println("=== JobController getMyJobs: Called for username: " + username + " ===");
        User employer = userService.findByEmail(username).orElseThrow();
        List<Job> jobs = jobService.getJobsByEmployer(employer);
        System.out.println("=== JobController getMyJobs: Found " + jobs.size() + " jobs for " + username + " ===");
        return ResponseEntity.ok(jobs);
    }



    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<Job> closeJob(@PathVariable Long id) {
        jobService.closeJob(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin/jobs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Job>> getAllJobsAdmin() {
        return ResponseEntity.ok(jobService.getAllJobs()); // will add to service
    }

    @DeleteMapping("/admin/jobs/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteJobAdmin(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/admin/jobs/{id}/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Job> updateJobStatusAdmin(@PathVariable Long id, @PathVariable String status) {
        Job job = jobService.getJobById(id);
        job.setStatus(Job.JobStatus.valueOf(status.toUpperCase()));
        return ResponseEntity.ok(jobService.updateJob(job));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{jobId}/applications")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<Application>> getJobApplications(
        @PathVariable Long jobId, 
        @AuthenticationPrincipal User employer
    ) {
        return ResponseEntity.ok(applicationService.getApplicationsByJobIdWithAuth(jobId, employer.getId()));
    }

    @GetMapping("/admin/employer/{employerId}/jobs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Job>> getJobsByEmployerAdmin(@PathVariable Long employerId) {
        User employer = userService.findById(employerId);
        return ResponseEntity.ok(jobService.getJobsByEmployer(employer));
    }
}

