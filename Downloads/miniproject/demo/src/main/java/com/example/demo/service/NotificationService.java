package com.example.demo.service;

import com.example.demo.entity.Notification;
import com.example.demo.entity.User;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;
    
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(userId);
    }
    
    public List<Notification> getUserUnreadNotifications(Long userId) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(userId).stream()
                .filter(n -> !n.isRead())
                .toList();
    }
    
    public Long getUnreadCount(Long userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }
    
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }
    
    public Notification createNotification(User user, String type, String title, String message) {
        Notification notification = new Notification(user, type, title, message);
        return notificationRepository.save(notification);
    }
    
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow();
        notification.setRead(true);
        return notificationRepository.save(notification);
    }
}

