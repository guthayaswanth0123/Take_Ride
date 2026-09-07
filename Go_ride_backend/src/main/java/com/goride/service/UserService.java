package com.goride.service;

import com.goride.dto.AuthDto.RegisterRequest;
import com.goride.dto.AuthDto.UserResponse;
import com.goride.enums.Enums.IsBlock;
import com.goride.enums.Enums.Role;
import com.goride.model.User;
import com.goride.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;

    public UserResponse createUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered!");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.RIDER)
                .phone(request.getPhone())
                .picture(request.getPicture())
                .address(request.getAddress())
                .isDeleted(false)
                .isBlock(IsBlock.UNBLOCK)
                .isVerified(true)
                .build();

        User savedUser = userRepository.save(user);
        return authService.mapUserToUserResponse(savedUser);
    }

    public UserResponse updateUser(String userId, RegisterRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getPicture() != null) user.setPicture(request.getPicture());
        if (request.getAddress() != null) user.setAddress(request.getAddress());

        User updatedUser = userRepository.save(user);
        return authService.mapUserToUserResponse(updatedUser);
    }
}
