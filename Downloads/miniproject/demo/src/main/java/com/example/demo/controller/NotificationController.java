package com.example.demo.controller;

import com.example.demo.entity.Notification;
import com.example.demo.entity.User;
import com.example.demo.service.NotificationService;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByEmail(username).orElseThrow();
        Long userId = user.getId();
        List<Notification> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByEmail(username).orElseThrow();
        Long userId = user.getId();
        Long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }
    
    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByEmail(username).orElseThrow();
        Notification notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(notification);
    }
    
    @PutMapping("/mark-all-read")
    public ResponseEntity<String> markAllAsRead(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByEmail(username).orElseThrow();
        Long userId = user.getId();
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok("All notifications marked as read");
    }
}

