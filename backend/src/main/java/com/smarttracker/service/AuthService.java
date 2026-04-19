package com.smarttracker.service;

import com.smarttracker.dto.request.LoginRequest;
import com.smarttracker.dto.response.AuthResponse;
import com.smarttracker.entity.User;
import com.smarttracker.exception.BusinessException;
import com.smarttracker.repository.UserRepository;
import com.smarttracker.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new BusinessException("Invalid credentials"));

        if (!user.getActive()) {
            throw new BusinessException("Account is deactivated. Contact administrator.");
        }

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        activityLogService.log(user, "LOGIN", "AUTH", null, "User logged in");

        return AuthResponse.builder()
            .token(token)
            .tokenType("Bearer")
            .userId(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .role(user.getRole().name())
            .build();
    }
}
