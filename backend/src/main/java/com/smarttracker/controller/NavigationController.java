package com.smarttracker.controller;

import com.smarttracker.dto.request.NavigationLogRequest;
import com.smarttracker.dto.response.ApiResponse;
import com.smarttracker.dto.response.NavigationLogResponse;
import com.smarttracker.service.NavigationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/navigation")
@RequiredArgsConstructor
@Tag(name = "Navigation Logs", description = "Track user navigation and page visits")
@SecurityRequirement(name = "bearerAuth")
public class NavigationController {

    private final NavigationService navigationService;

    @PostMapping("/log")
    @Operation(summary = "Log a page visit")
    public ResponseEntity<ApiResponse<NavigationLogResponse>> logNavigation(
            @Valid @RequestBody NavigationLogRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Navigation logged", navigationService.logNavigation(request)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all navigation logs (admin)")
    public ResponseEntity<ApiResponse<Page<NavigationLogResponse>>> getAllLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(navigationService.getAllLogs(pageable)));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get navigation logs for a specific user")
    public ResponseEntity<ApiResponse<List<NavigationLogResponse>>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(navigationService.getLogsByUser(userId)));
    }
}
