package com.smarttracker.service;

import com.smarttracker.entity.UserActivityLog;
import com.smarttracker.entity.User;
import com.smarttracker.repository.UserActivityLogRepository;
import com.smarttracker.dto.response.ActivityLogResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final UserActivityLogRepository activityLogRepository;

    public void log(User user, String action, String entityType, Long entityId, String description) {
        UserActivityLog logEntry = UserActivityLog.builder()
            .user(user)
            .action(UserActivityLog.Action.valueOf(action))
            .entityType(entityType)
            .entityId(entityId)
            .description(description)
            .build();
        activityLogRepository.save(logEntry);
    }

    public Page<ActivityLogResponse> getAllLogs(Pageable pageable) {
        return activityLogRepository.findAllByOrderByCreatedAtDesc(pageable)
            .map(this::toResponse);
    }

    public List<ActivityLogResponse> getLogsByUser(Long userId) {
        return activityLogRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private ActivityLogResponse toResponse(UserActivityLog log) {
        return ActivityLogResponse.builder()
            .id(log.getId())
            .userId(log.getUser().getId())
            .userName(log.getUser().getName())
            .action(log.getAction().name())
            .entityType(log.getEntityType())
            .entityId(log.getEntityId())
            .description(log.getDescription())
            .createdAt(log.getCreatedAt())
            .build();
    }
}
