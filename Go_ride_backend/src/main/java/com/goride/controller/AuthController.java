package com.goride.controller;

import com.goride.common.ApiResponse;
import com.goride.dto.AuthDto.*;
import com.goride.security.UserPrincipal;
import com.goride.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        LoginResponse result = authService.login(request);

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", result.getAccessToken())
                .httpOnly(true)
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Lax")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", result.getRefreshToken())
                .httpOnly(true)
                .path("/")
                .maxAge(30 * 24 * 60 * 60)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ApiResponse.success(200, "User logged in successfully!", result);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<Map<String, String>>> refreshToken(@RequestBody(required = false) RefreshTokenRequest request,
                                                                         @CookieValue(name = "refreshToken", required = false) String cookieToken) {
        String token = request != null && request.getRefreshToken() != null ? request.getRefreshToken() : cookieToken;
        if (token == null) {
            return ApiResponse.error(400, "Refresh token is missing!");
        }
        String newAccessToken = authService.refreshAccessToken(token);
        Map<String, String> data = new HashMap<>();
        data.put("accessToken", newAccessToken);
        return ApiResponse.success(200, "Access token refreshed successfully", data);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Object>> logout(HttpServletResponse response) {
        ResponseCookie clearAccessCookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        ResponseCookie clearRefreshCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, clearAccessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, clearRefreshCookie.toString());

        return ApiResponse.success(200, "User logged out successfully!", null);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMe(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ApiResponse.error(401, "Unauthorized");
        }
        UserResponse userResponse = authService.getMe(userPrincipal.getId());
        return ApiResponse.success(200, "User details retrieved successfully", userResponse);
    }

    @GetMapping("/google")
    public ResponseEntity<ApiResponse<Object>> googleAuth() {
        return ApiResponse.error(501, "Google OAuth redirect endpoint");
    }
}
