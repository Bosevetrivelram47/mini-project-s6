package com.smarttracker.repository;

import com.smarttracker.entity.TaskAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, Long> {
    List<TaskAssignment> findByTaskId(Long taskId);
    List<TaskAssignment> findByAssignedToId(Long userId);
    Optional<TaskAssignment> findByTaskIdAndAssignedToId(Long taskId, Long userId);
    boolean existsByTaskIdAndAssignedToId(Long taskId, Long userId);
}
