package com.smarttracker.config;

import com.smarttracker.entity.User;
import com.smarttracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUser("Admin User", "admin@system.com", "Admin@123", User.Role.ADMIN);
        seedUser("Manager User", "manager@system.com", "Manager@123", User.Role.MANAGER);
        seedUser("Employee One", "employee1@system.com", "Employee@123", User.Role.EMPLOYEE);
        seedUser("Employee Two", "employee2@system.com", "Employee@123", User.Role.EMPLOYEE);
        log.info("=== Data seeding complete ===");
        log.info("Admin login: admin@system.com / Admin@123");
    }

    private void seedUser(String name, String email, String password, User.Role role) {
        if (!userRepository.existsByEmail(email)) {
            User user = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .active(true)
                .build();
            userRepository.save(user);
            log.info("Seeded user: {} ({})", email, role);
        }
    }
}
