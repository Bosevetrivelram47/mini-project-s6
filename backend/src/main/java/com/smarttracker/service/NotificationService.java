package com.smarttracker.service;

import com.smarttracker.dto.response.NotificationResponse;
import com.smarttracker.entity.Notification;
import com.smarttracker.entity.User;
import com.smarttracker.exception.ResourceNotFoundException;
import com.smarttracker.repository.NotificationRepository;
import com.smarttracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public void createNotification(Long userId, String message, String type) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;
        Notification notification = Notification.builder()
            .user(user)
            .message(message)
            .type(type)
            .read(false)
            .build();
        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public NotificationResponse markAsRead(Long notificationId) {
        Notification n = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));
        n.setRead(true);
        return toResponse(notificationRepository.save(n));
    }

    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndReadFalse(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
            .id(n.getId())
            .userId(n.getUser().getId())
            .message(n.getMessage())
            .type(n.getType())
            .read(n.getRead())
            .createdAt(n.getCreatedAt())
            .build();
    }
}
