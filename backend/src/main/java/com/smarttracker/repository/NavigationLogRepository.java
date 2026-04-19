package com.smarttracker.repository;

import com.smarttracker.entity.NavigationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NavigationLogRepository extends JpaRepository<NavigationLog, Long> {
    List<NavigationLog> findByUserIdOrderByVisitedAtDesc(Long userId);
    Page<NavigationLog> findAllByOrderByVisitedAtDesc(Pageable pageable);
}
