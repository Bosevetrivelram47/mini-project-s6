package com.smarttracker.controller;

import com.smarttracker.dto.response.ActivityLogResponse;
import com.smarttracker.dto.response.ApiResponse;
import com.smarttracker.service.ActivityLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/activity-logs")
@RequiredArgsConstructor
@Tag(name = "Activity Logs", description = "Track all user actions")
@SecurityRequirement(name = "bearerAuth")
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all activity logs (admin)")
    public ResponseEntity<ApiResponse<Page<ActivityLogResponse>>> getAllLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(activityLogService.getAllLogs(pageable)));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get activity logs for a specific user")
    public ResponseEntity<ApiResponse<List<ActivityLogResponse>>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(activityLogService.getLogsByUser(userId)));
    }
}
