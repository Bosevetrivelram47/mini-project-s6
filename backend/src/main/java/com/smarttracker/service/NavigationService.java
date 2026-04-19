package com.smarttracker.service;

import com.smarttracker.dto.request.NavigationLogRequest;
import com.smarttracker.dto.response.NavigationLogResponse;
import com.smarttracker.entity.NavigationLog;
import com.smarttracker.entity.User;
import com.smarttracker.repository.NavigationLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NavigationService {

    private final NavigationLogRepository navigationLogRepository;
    private final UserService userService;

    public NavigationLogResponse logNavigation(NavigationLogRequest request) {
        User user = userService.findById(request.getUserId());
        NavigationLog log = NavigationLog.builder()
            .user(user)
            .page(request.getPage())
            .url(request.getUrl())
            .timeSpentSeconds(request.getTimeSpentSeconds() != null ? request.getTimeSpentSeconds() : 0L)
            .build();
        return toResponse(navigationLogRepository.save(log));
    }

    public Page<NavigationLogResponse> getAllLogs(Pageable pageable) {
        return navigationLogRepository.findAllByOrderByVisitedAtDesc(pageable).map(this::toResponse);
    }

    public List<NavigationLogResponse> getLogsByUser(Long userId) {
        return navigationLogRepository.findByUserIdOrderByVisitedAtDesc(userId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private NavigationLogResponse toResponse(NavigationLog log) {
        return NavigationLogResponse.builder()
            .id(log.getId())
            .userId(log.getUser().getId())
            .userName(log.getUser().getName())
            .page(log.getPage())
            .url(log.getUrl())
            .timeSpentSeconds(log.getTimeSpentSeconds())
            .visitedAt(log.getVisitedAt())
            .build();
    }
}
