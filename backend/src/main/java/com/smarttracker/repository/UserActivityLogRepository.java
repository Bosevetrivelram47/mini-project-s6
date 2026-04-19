package com.smarttracker.repository;

import com.smarttracker.entity.UserActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserActivityLogRepository extends JpaRepository<UserActivityLog, Long> {
    List<UserActivityLog> findByUserIdOrderByCreatedAtDesc(Long userId);
    Page<UserActivityLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<UserActivityLog> findByAction(UserActivityLog.Action action);
}
