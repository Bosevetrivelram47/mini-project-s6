package com.smarttracker.repository;

import com.smarttracker.entity.TaskResolution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface TaskResolutionRepository extends JpaRepository<TaskResolution, Long> {
    Optional<TaskResolution> findByTaskId(Long taskId);
    List<TaskResolution> findByResolvedById(Long userId);
    boolean existsByTaskId(Long taskId);
}
