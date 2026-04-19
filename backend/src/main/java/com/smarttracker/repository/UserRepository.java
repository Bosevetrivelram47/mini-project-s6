package com.smarttracker.repository;

import com.smarttracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(User.Role role);
    List<User> findByActive(Boolean active);
    List<User> findByRoleAndActive(User.Role role, Boolean active);
}
