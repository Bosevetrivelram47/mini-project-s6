package com.smarttracker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "task_resolutions", indexes = {
    @Index(name = "idx_resolution_task", columnList = "task_id"),
    @Index(name = "idx_resolution_user", columnList = "resolved_by")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResolution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false, unique = true)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by", nullable = false)
    private User resolvedBy;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "resolved_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime resolvedAt = LocalDateTime.now();
}
