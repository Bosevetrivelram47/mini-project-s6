package com.smarttracker.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationResponse {
    private Long id;
    private Long userId;
    private String message;
    private String type;
    private Boolean read;
    private LocalDateTime createdAt;
}
