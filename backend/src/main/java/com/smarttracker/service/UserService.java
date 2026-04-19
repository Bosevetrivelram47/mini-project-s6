package com.smarttracker.service;

import com.smarttracker.dto.request.CreateUserRequest;
import com.smarttracker.dto.response.UserResponse;
import com.smarttracker.entity.User;
import com.smarttracker.exception.BusinessException;
import com.smarttracker.exception.ResourceNotFoundException;
import com.smarttracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;

    public UserResponse createUser(CreateUserRequest request, User currentUser) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already registered: " + request.getEmail());
        }
        User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(request.getRole())
            .active(true)
            .build();
        User saved = userRepository.save(user);
        activityLogService.log(currentUser, "CREATE", "USER", saved.getId(),
            "Created user: " + saved.getName() + " with role " + saved.getRole());
        notificationService.createNotification(saved.getId(),
            "Welcome to Smart Tracker! Your account has been created.", "WELCOME");
        return toResponse(saved);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        return toResponse(findById(id));
    }

    public List<UserResponse> getUsersByRole(String role) {
        return userRepository.findByRole(User.Role.valueOf(role.toUpperCase()))
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public UserResponse toggleUserStatus(Long id, boolean active, User currentUser) {
        User user = findById(id);
        user.setActive(active);
        User saved = userRepository.save(user);
        activityLogService.log(currentUser, "UPDATE", "USER", saved.getId(),
            (active ? "Activated" : "Deactivated") + " user: " + saved.getName());
        return toResponse(saved);
    }

    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .role(user.getRole().name())
            .active(user.getActive())
            .createdAt(user.getCreatedAt())
            .build();
    }
}
