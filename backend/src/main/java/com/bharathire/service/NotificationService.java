package com.bharathire.service;

import com.bharathire.entity.Notification;
import com.bharathire.entity.User;
import com.bharathire.exception.ResourceNotFoundException;
import com.bharathire.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (notif.getUser().getId().equals(userId)) {
            notif.setIsRead(true);
            notificationRepository.save(notif);
        }
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        for (Notification n : list) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(list);
    }

    public void createNotification(User user, String title, String message, String type, Long relatedId) {
        Notification notification = new Notification(user, title, message, type, relatedId);
        notificationRepository.save(notification);
    }
}
