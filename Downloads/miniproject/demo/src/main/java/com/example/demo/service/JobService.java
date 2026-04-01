package com.example.demo.service;

import com.example.demo.entity.Job;
import com.example.demo.entity.User;
import com.example.demo.repository.JobRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ApplicationService;
import com.example.demo.service.NotificationService;
import com.example.demo.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {
    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
@Autowired
    private ApplicationService applicationService;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    public Job postJob(Job job) {
        if (job.getEmployer().getStatus() != User.Status.ACTIVE) {
            throw new RuntimeException("Employer is blocked and cannot post jobs");
        }
        if (job.getLocation() == null || job.getLocation().trim().isEmpty()) {
            job.setLocation("Location not specified");
        }
        job.setStatus(Job.JobStatus.OPEN);
        Job savedJob = jobRepository.save(job);
        
        // Skill match notifications
        if (job.getSkill() != null) {
          String skill = job.getSkill().toLowerCase();
          List<User> matchingWorkers = userRepository.findAll().stream()
              .filter(u -> "WORKER".equals(u.getRole().name()))
              .filter(u -> u.getSkills() != null && u.getSkills().toLowerCase().contains(skill))
              .limit(5)
              .collect(Collectors.toList());
          
          for (User worker : matchingWorkers) {
              try {
                  notificationService.createNotification(
                      worker,
                      "JOB_MATCH",
                      "New Job Match!",
                      "New '" + job.getTitle() + "' job posted matching your '" + skill + "' skills!"
                  );
              } catch (Exception e) {
                  System.err.println("Notification failed for worker " + worker.getId() + ": " + e.getMessage());
              }
          }
        }
        
        return savedJob;
    }

    public List<Job> getAllOpenJobs() {
        return jobRepository.findAll().stream()
            .filter(job -> job.getStatus() == Job.JobStatus.OPEN)
            .toList();
    }

    public List<Job> getJobsWithin5km(Double latitude, Double longitude) {
        return jobRepository.findAll();
    }

    public List<Job> getJobsByEmployer(User employer) {
        return jobRepository.findAll().stream()
            .filter(job -> job.getEmployer() != null && job.getEmployer().getId().equals(employer.getId()))
            .toList();
    }

    public Job updateJob(Job job) {
        return jobRepository.save(job);
    }

    public void closeJob(Long jobId) {
        Job job = jobRepository.findById(jobId).orElseThrow();
        job.setStatus(Job.JobStatus.CLOSED);
        jobRepository.save(job);
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public void deleteJob(Long id) {
        applicationService.deleteByJobId(id);
        paymentRepository.deleteByJobId(id);
        jobRepository.deleteById(id);
    }
}

