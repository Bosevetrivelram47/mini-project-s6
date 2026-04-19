package com.smarttracker.controller;

import com.smarttracker.dto.request.AssignTaskRequest;
import com.smarttracker.dto.response.ApiResponse;
import com.smarttracker.dto.response.AssignmentResponse;
import com.smarttracker.entity.User;
import com.smarttracker.service.AssignmentService;
import com.smarttracker.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
@Tag(name = "Task Assignment", description = "Assign and track task assignments")
@SecurityRequirement(name = "bearerAuth")
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Assign task to a user")
    public ResponseEntity<ApiResponse<AssignmentResponse>> assignTask(
            @Valid @RequestBody AssignTaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Task assigned", assignmentService.assignTask(request, currentUser)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get all assignments")
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getAllAssignments() {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAllAssignments()));
    }

    @GetMapping("/task/{taskId}")
    @Operation(summary = "Get assignments by task ID")
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getByTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentsByTask(taskId)));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get assignments for a user")
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentsByUser(userId)));
    }
}
