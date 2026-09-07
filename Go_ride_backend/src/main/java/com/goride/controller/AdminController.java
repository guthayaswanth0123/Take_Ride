package com.goride.controller;

import com.goride.common.ApiResponse;
import com.goride.model.Driver;
import com.goride.model.Ride;
import com.goride.model.User;
import com.goride.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PatchMapping("/driver/approve/{id}")
    public ResponseEntity<ApiResponse<Driver>> approveDriver(@PathVariable("id") String driverId) {
        Driver driver = adminService.approveDriver(driverId);
        return ApiResponse.success(200, "Driver approved successfully", driver);
    }

    @PatchMapping("/driver/suspend/{id}")
    public ResponseEntity<ApiResponse<Driver>> suspendDriver(@PathVariable("id") String driverId) {
        Driver driver = adminService.suspendDriver(driverId);
        return ApiResponse.success(200, "Driver suspended successfully", driver);
    }

    @PatchMapping("/user/block/{id}")
    public ResponseEntity<ApiResponse<User>> blockUser(@PathVariable("id") String userId) {
        User user = adminService.blockUser(userId);
        return ApiResponse.success(200, "User blocked successfully", user);
    }

    @PatchMapping("/user/unblock/{id}")
    public ResponseEntity<ApiResponse<User>> unblockUser(@PathVariable("id") String userId) {
        User user = adminService.unblockUser(userId);
        return ApiResponse.success(200, "User unblocked successfully", user);
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ApiResponse.success(200, "All users fetched successfully", users);
    }

    @GetMapping("/drivers")
    public ResponseEntity<ApiResponse<List<Driver>>> getAllDrivers() {
        List<Driver> drivers = adminService.getAllDrivers();
        return ApiResponse.success(200, "All drivers fetched successfully", drivers);
    }

    @GetMapping("/rides")
    public ResponseEntity<ApiResponse<List<Ride>>> getAllRides() {
        List<Ride> rides = adminService.getAllRides();
        return ApiResponse.success(200, "All rides fetched successfully", rides);
    }

    @GetMapping("/report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminReport() {
        Map<String, Object> report = adminService.getAdminReport();
        return ApiResponse.success(200, "Admin report generated successfully", report);
    }
}
