package com.smarttracker.service;

import com.smarttracker.dto.request.AssignTaskRequest;
import com.smarttracker.dto.response.AssignmentResponse;
import com.smarttracker.entity.*;
import com.smarttracker.exception.BusinessException;
import com.smarttracker.repository.TaskAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final TaskAssignmentRepository assignmentRepository;
    private final TaskService taskService;
    private final UserService userService;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;

    public AssignmentResponse assignTask(AssignTaskRequest request, User currentUser) {
        if (assignmentRepository.existsByTaskIdAndAssignedToId(request.getTaskId(), request.getAssignedToUserId())) {
            throw new BusinessException("Task is already assigned to this user.");
        }
        Task task = taskService.findById(request.getTaskId());
        User assignedTo = userService.findById(request.getAssignedToUserId());

        if (task.getStatus() == Task.Status.RESOLVED) {
            throw new BusinessException("Cannot assign a resolved task.");
        }
        if (task.getStatus() == Task.Status.PENDING) {
            task.setStatus(Task.Status.IN_PROGRESS);
        }

        TaskAssignment assignment = TaskAssignment.builder()
            .task(task)
            .assignedTo(assignedTo)
            .assignedBy(currentUser)
            .build();
        TaskAssignment saved = assignmentRepository.save(assignment);

        activityLogService.log(currentUser, "ASSIGN", "TASK", task.getId(),
            "Assigned task '" + task.getTitle() + "' to " + assignedTo.getName());
        notificationService.createNotification(assignedTo.getId(),
            "You have been assigned a new task: " + task.getTitle(), "TASK_ASSIGNED");

        return toResponse(saved);
    }

    public List<AssignmentResponse> getAssignmentsByTask(Long taskId) {
        return assignmentRepository.findByTaskId(taskId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<AssignmentResponse> getAssignmentsByUser(Long userId) {
        return assignmentRepository.findByAssignedToId(userId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<AssignmentResponse> getAllAssignments() {
        return assignmentRepository.findAll()
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private AssignmentResponse toResponse(TaskAssignment a) {
        return AssignmentResponse.builder()
            .id(a.getId())
            .taskId(a.getTask().getId())
            .taskTitle(a.getTask().getTitle())
            .assignedToId(a.getAssignedTo().getId())
            .assignedToName(a.getAssignedTo().getName())
            .assignedById(a.getAssignedBy().getId())
            .assignedByName(a.getAssignedBy().getName())
            .assignedAt(a.getAssignedAt())
            .build();
    }
}
