package com.goride.service;

import com.goride.dto.AuthDto.LoginRequest;
import com.goride.dto.AuthDto.LoginResponse;
import com.goride.dto.AuthDto.UserResponse;
import com.goride.enums.Enums.IsBlock;
import com.goride.model.User;
import com.goride.repository.UserRepository;
import com.goride.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (user.getIsDeleted() != null && user.getIsDeleted()) {
            throw new RuntimeException("This user account is deleted!");
        }

        if (user.getIsBlock() == IsBlock.BLOCK) {
            throw new RuntimeException("This user account is blocked!");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId(), user.getEmail(), user.getRole());

        UserResponse userResponse = mapUserToUserResponse(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userResponse)
                .build();
    }

    public String refreshAccessToken(String refreshToken) {
        if (!tokenProvider.validateRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid or expired refresh token!");
        }
        String userId = tokenProvider.getUserIdFromRefreshToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return tokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
    }

    public UserResponse getMe(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapUserToUserResponse(user);
    }

    public UserResponse mapUserToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .picture(user.getPicture())
                .address(user.getAddress())
                .isBlock(user.getIsBlock() != null ? user.getIsBlock().name() : IsBlock.UNBLOCK.name())
                .isVerified(user.getIsVerified())
                .isApproved(user.getIsApproved())
                .isOnline(user.getIsOnline())
                .vehicleInfo(user.getVehicleInfo())
                .build();
    }
}
