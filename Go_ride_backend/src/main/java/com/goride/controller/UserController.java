package com.goride.controller;

import com.goride.common.ApiResponse;
import com.goride.dto.AuthDto.RegisterRequest;
import com.goride.dto.AuthDto.UserResponse;
import com.goride.security.UserPrincipal;
import com.goride.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody RegisterRequest request) {
        UserResponse response = userService.createUser(request);
        return ApiResponse.success(201, "User registered successfully", response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable("id") String id,
                                                                 @RequestBody RegisterRequest request,
                                                                 @AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserResponse response = userService.updateUser(id, request);
        return ApiResponse.success(200, "User updated successfully", response);
    }
}
