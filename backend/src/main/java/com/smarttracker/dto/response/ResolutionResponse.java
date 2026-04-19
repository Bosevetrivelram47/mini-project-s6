package com.smarttracker.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResolutionResponse {
    private Long id;
    private Long taskId;
    private String taskTitle;
    private Long resolvedById;
    private String resolvedByName;
    private String remarks;
    private LocalDateTime resolvedAt;
}
