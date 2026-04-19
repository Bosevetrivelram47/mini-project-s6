package com.smarttracker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "navigation_logs", indexes = {
    @Index(name = "idx_nav_log_user", columnList = "user_id"),
    @Index(name = "idx_nav_log_visited_at", columnList = "visited_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NavigationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String page;

    @Column(length = 300)
    private String url;

    @Column(name = "time_spent_seconds")
    @Builder.Default
    private Long timeSpentSeconds = 0L;

    @Column(name = "visited_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime visitedAt = LocalDateTime.now();
}
