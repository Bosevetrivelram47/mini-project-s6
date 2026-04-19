package com.smarttracker.service;

import com.smarttracker.dto.request.CreateTaskRequest;
import com.smarttracker.dto.response.TaskResponse;
import com.smarttracker.entity.Task;
import com.smarttracker.entity.User;
import com.smarttracker.exception.ResourceNotFoundException;
import com.smarttracker.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ActivityLogService activityLogService;

    public TaskResponse createTask(CreateTaskRequest request, User currentUser) {
        Task task = Task.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .priority(request.getPriority() != null ? request.getPriority() : Task.Priority.MEDIUM)
            .dueDate(request.getDueDate())
            .createdBy(currentUser)
            .status(Task.Status.PENDING)
            .build();
        Task saved = taskRepository.save(task);
        activityLogService.log(currentUser, "CREATE", "TASK", saved.getId(), "Created task: " + saved.getTitle());
        return toResponse(saved);
    }

    public Page<TaskResponse> getTasks(String status, String priority, String search, Pageable pageable) {
        Task.Status taskStatus = (status != null && !status.isBlank()) ? Task.Status.valueOf(status.toUpperCase()) : null;
        Task.Priority taskPriority = (priority != null && !priority.isBlank()) ? Task.Priority.valueOf(priority.toUpperCase()) : null;
        String searchTerm = (search != null && !search.isBlank()) ? search : null;
        return taskRepository.findWithFilters(taskStatus, taskPriority, searchTerm, pageable).map(this::toResponse);
    }

    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long id) {
        return toResponse(findById(id));
    }

    public TaskResponse updateStatus(Long id, String status, User currentUser) {
        Task task = findById(id);
        Task.Status newStatus = Task.Status.valueOf(status.toUpperCase());
        task.setStatus(newStatus);
        Task saved = taskRepository.save(task);
        activityLogService.log(currentUser, "UPDATE", "TASK", saved.getId(),
            "Updated task status to " + newStatus + ": " + saved.getTitle());
        return toResponse(saved);
    }

    public Task findById(Long id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    public long countByStatus(Task.Status status) {
        return taskRepository.countByStatus(status);
    }

    public TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
            .id(task.getId())
            .title(task.getTitle())
            .description(task.getDescription())
            .status(task.getStatus().name())
            .priority(task.getPriority().name())
            .dueDate(task.getDueDate())
            .createdById(task.getCreatedBy().getId())
            .createdByName(task.getCreatedBy().getName())
            .createdAt(task.getCreatedAt())
            .updatedAt(task.getUpdatedAt())
            .build();
    }
}
