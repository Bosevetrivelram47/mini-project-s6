package com.smarttracker.controller;

import com.smarttracker.dto.response.ApiResponse;
import com.smarttracker.entity.Task;
import com.smarttracker.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard analytics and statistics")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final NotificationRepository notificationRepository;
    private final TaskAssignmentRepository assignmentRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findByActive(true).size();
        long totalTasks = taskRepository.count();
        long pendingTasks = taskRepository.countByStatus(Task.Status.PENDING);
        long inProgressTasks = taskRepository.countByStatus(Task.Status.IN_PROGRESS);
        long resolvedTasks = taskRepository.countByStatus(Task.Status.RESOLVED);
        long totalAssignments = assignmentRepository.count();

        Map<String, Object> stats = Map.of(
            "totalUsers", totalUsers,
            "activeUsers", activeUsers,
            "totalTasks", totalTasks,
            "pendingTasks", pendingTasks,
            "inProgressTasks", inProgressTasks,
            "resolvedTasks", resolvedTasks,
            "totalAssignments", totalAssignments
        );
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
