package com.smarttracker.service;

import com.smarttracker.dto.request.ResolveTaskRequest;
import com.smarttracker.dto.response.ResolutionResponse;
import com.smarttracker.entity.*;
import com.smarttracker.exception.BusinessException;
import com.smarttracker.repository.TaskResolutionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResolutionService {

    private final TaskResolutionRepository resolutionRepository;
    private final TaskService taskService;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;

    public ResolutionResponse resolveTask(ResolveTaskRequest request, User currentUser) {
        Task task = taskService.findById(request.getTaskId());

        if (task.getStatus() == Task.Status.RESOLVED) {
            throw new BusinessException("Task is already resolved.");
        }
        if (resolutionRepository.existsByTaskId(request.getTaskId())) {
            throw new BusinessException("A resolution already exists for this task.");
        }

        // Auto-update task status to RESOLVED
        task.setStatus(Task.Status.RESOLVED);

        TaskResolution resolution = TaskResolution.builder()
            .task(task)
            .resolvedBy(currentUser)
            .remarks(request.getRemarks())
            .build();
        TaskResolution saved = resolutionRepository.save(resolution);

        activityLogService.log(currentUser, "RESOLVE", "TASK", task.getId(),
            "Resolved task: " + task.getTitle());
        notificationService.createNotification(task.getCreatedBy().getId(),
            "Task '" + task.getTitle() + "' has been resolved by " + currentUser.getName(), "TASK_RESOLVED");

        return toResponse(saved);
    }

    public List<ResolutionResponse> getAllResolutions() {
        return resolutionRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ResolutionResponse getResolutionByTask(Long taskId) {
        TaskResolution resolution = resolutionRepository.findByTaskId(taskId)
            .orElseThrow(() -> new BusinessException("No resolution found for task: " + taskId));
        return toResponse(resolution);
    }

    private ResolutionResponse toResponse(TaskResolution r) {
        return ResolutionResponse.builder()
            .id(r.getId())
            .taskId(r.getTask().getId())
            .taskTitle(r.getTask().getTitle())
            .resolvedById(r.getResolvedBy().getId())
            .resolvedByName(r.getResolvedBy().getName())
            .remarks(r.getRemarks())
            .resolvedAt(r.getResolvedAt())
            .build();
    }
}
