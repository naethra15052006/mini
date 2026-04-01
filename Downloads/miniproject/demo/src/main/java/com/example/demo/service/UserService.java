package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import com.example.demo.repository.JobRepository;
import com.example.demo.entity.Job;
import com.example.demo.service.JobService;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

@Autowired
    private PasswordEncoder passwordEncoder;

@Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobService jobService;

    public User registerUser(User user) {
        // Check if email already exists
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getAllWorkers() {
        return userRepository.findAll().stream()
            .filter(u -> u.getRole() == User.Role.WORKER)
            .toList();
    }

    public List<User> getAllEmployers() {
        return userRepository.findAll().stream()
            .filter(u -> u.getRole() == User.Role.EMPLOYER)
            .toList();
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Map<String, Object> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalWorkers", userRepository.countByRoleAndStatus(User.Role.WORKER, User.Status.ACTIVE));
        stats.put("totalEmployers", userRepository.countByRoleAndStatus(User.Role.EMPLOYER, User.Status.ACTIVE));
        stats.put("totalJobs", jobRepository.count());
        long blockedUsers = userRepository.countByStatus(User.Status.BLOCKED);
        stats.put("blockedUsers", blockedUsers);
        stats.put("activeUsers", userRepository.countByStatus(User.Status.ACTIVE));
        return stats;
    }

    public List<User> getRecentUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "id")).stream().limit(5).toList();
    }

    public User updateUserStatus(Long id, User.Status status) {
        User user = findById(id);
        user.setStatus(status);
        if (status == User.Status.BLOCKED && user.getRole() == User.Role.EMPLOYER) {
            List<Job> employerJobs = jobService.getJobsByEmployer(user);
            for (Job job : employerJobs) {
                jobService.deleteJob(job.getId());
            }
        }
        return updateUser(user);
    }

    public List<User> getWorkersByStatus(User.Status status) {
        return getAllWorkers().stream()
            .filter(u -> u.getStatus() == status)
            .toList();
    }

    public List<User> getEmployersByStatus(User.Status status) {
        return getAllEmployers().stream()
            .filter(u -> u.getStatus() == status)
            .toList();
    }
}
