package com.smarttracker.controller;

import com.smarttracker.dto.request.ResolveTaskRequest;
import com.smarttracker.dto.response.ApiResponse;
import com.smarttracker.dto.response.ResolutionResponse;
import com.smarttracker.entity.User;
import com.smarttracker.service.ResolutionService;
import com.smarttracker.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resolutions")
@RequiredArgsConstructor
@Tag(name = "Task Resolution", description = "Resolve tasks with remarks")
@SecurityRequirement(name = "bearerAuth")
public class ResolutionController {

    private final ResolutionService resolutionService;
    private final UserService userService;

    @PostMapping
    @Operation(summary = "Resolve a task")
    public ResponseEntity<ApiResponse<ResolutionResponse>> resolveTask(
            @Valid @RequestBody ResolveTaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Task resolved", resolutionService.resolveTask(request, currentUser)));
    }

    @GetMapping
    @Operation(summary = "Get all resolutions")
    public ResponseEntity<ApiResponse<List<ResolutionResponse>>> getAllResolutions() {
        return ResponseEntity.ok(ApiResponse.success(resolutionService.getAllResolutions()));
    }

    @GetMapping("/task/{taskId}")
    @Operation(summary = "Get resolution for a task")
    public ResponseEntity<ApiResponse<ResolutionResponse>> getByTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(ApiResponse.success(resolutionService.getResolutionByTask(taskId)));
    }
}
