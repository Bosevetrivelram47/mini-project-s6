package com.smarttracker.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NavigationLogResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String page;
    private String url;
    private Long timeSpentSeconds;
    private LocalDateTime visitedAt;
}
