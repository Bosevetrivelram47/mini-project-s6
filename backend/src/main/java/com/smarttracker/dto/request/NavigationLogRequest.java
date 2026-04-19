package com.smarttracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NavigationLogRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Page name is required")
    private String page;

    private String url;
    private Long timeSpentSeconds = 0L;
}
