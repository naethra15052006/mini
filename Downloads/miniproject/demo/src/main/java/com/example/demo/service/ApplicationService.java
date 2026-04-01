package com.example.demo.service;

import com.example.demo.entity.Application;
import com.example.demo.entity.User;
import com.example.demo.entity.Job;
import com.example.demo.repository.ApplicationRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.JobRepository;
import com.example.demo.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private NotificationService notificationService;

    public void deleteByJobId(Long jobId) {
        applicationRepository.deleteByJobId(jobId);
    }

    public List<Application> getMyApplications(Long workerId) {
        return applicationRepository.findByWorkerIdOrderByAppliedDateDesc(workerId);
    }

    public Application applyToJob(Long workerId, Long jobId, Application application) {
        // Check if already applied
        if (applicationRepository.existsByWorkerIdAndJobId(workerId, jobId)) {
            throw new RuntimeException("Already applied to this job");
        }

        User worker = userRepository.findById(workerId)
            .orElseThrow(() -> new RuntimeException("Worker not found"));

        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));

        // Fill null fields from frontend form (phone may be empty)
        if (application.getPhoneNumber() == null) {
            application.setPhoneNumber("");
        }
        
        
        
        application.setWorker(worker);
        application.setJob(job);
        Application saved = applicationRepository.save(application);
        
        return saved;
    }
    
    public List<Application> getEmployerApplications(Long employerId) {
        return applicationRepository.findAll().stream()
            .filter(app -> app.getJob() != null && app.getJob().getEmployer() != null && app.getJob().getEmployer().getId().equals(employerId))
            .peek(app -> {
                if (app.getPhoneNumber() == null || app.getPhoneNumber().isEmpty()) {
                    app.setPhoneNumber("N/A");
                }
            })
            .toList();
    }
    
    public List<Application> getApplicationsByJobIdWithAuth(Long jobId, Long employerId) {
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));
        if (!job.getEmployer().getId().equals(employerId)) {
            throw new RuntimeException("Unauthorized - not your job");
        }
        return applicationRepository.findAll().stream()
            .filter(app -> app.getJob().getId().equals(jobId))
            .toList();
    }
    
    public Application getApplicationByIdWithEmployer(Long applicationId, Long employerId) {
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        if (!application.getJob().getEmployer().getId().equals(employerId)) {
            throw new RuntimeException("Unauthorized - not your job application");
        }
        return application;
    }
    
    public void updateApplicationStatus(Long applicationId, String status) {
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        
        application.setStatus(Application.ApplicationStatus.valueOf(status));
        applicationRepository.save(application);
        
        // Notify worker
        try {
            notificationService.createNotification(
                application.getWorker(),
                "APPLICATION_" + status,
                status.equals("APPROVED") ? "✅ Application Approved!" : "❌ Application Rejected",
                "Your application for '" + application.getJob().getTitle() + "' has been " + status.toLowerCase()
            );
        } catch (Exception e) {
            // Log but don't fail status update
            System.err.println("Notification failed: " + e.getMessage());
        }
    }
}

