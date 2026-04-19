package com.smarttracker.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResolveTaskRequest {
    @NotNull(message = "Task ID is required")
    private Long taskId;
    private String remarks;
}
