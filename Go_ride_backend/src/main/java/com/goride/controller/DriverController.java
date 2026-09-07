package com.goride.controller;

import com.goride.common.ApiResponse;
import com.goride.dto.DriverDto.*;
import com.goride.dto.RideDto.UpdateRideStatusRequest;
import com.goride.model.Ride;
import com.goride.security.UserPrincipal;
import com.goride.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/driver")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    @PostMapping("/apply-driver")
    @PreAuthorize("hasRole('RIDER') or hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<DriverResponse>> applyToBeDriver(@AuthenticationPrincipal UserPrincipal principal,
                                                                        @Valid @RequestBody ApplyDriverRequest request) {
        DriverResponse response = driverService.applyToBeDriver(principal.getId(), request);
        return ApiResponse.success(200, "Driver application submitted successfully.", response);
    }

    @GetMapping("/rides-available")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<List<Ride>>> getAvailableRides() {
        List<Ride> rides = driverService.getAvailableRides();
        return ApiResponse.success(200, "Available ride requests retrieved successfully", rides);
    }

    @PatchMapping("/rides/{id}/accept")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<Ride>> acceptRide(@AuthenticationPrincipal UserPrincipal principal,
                                                         @PathVariable("id") String rideId) {
        Ride ride = driverService.acceptRide(principal.getId(), rideId);
        return ApiResponse.success(200, "Ride accepted successfully", ride);
    }

    @PatchMapping("/rides/{id}/reject")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<Ride>> rejectRide(@AuthenticationPrincipal UserPrincipal principal,
                                                         @PathVariable("id") String rideId) {
        Ride ride = driverService.rejectRide(principal.getId(), rideId);
        return ApiResponse.success(200, "Ride request rejected successfully", ride);
    }

    @PatchMapping("/rides/{id}/status")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<Ride>> updateRideStatus(@AuthenticationPrincipal UserPrincipal principal,
                                                               @PathVariable("id") String rideId,
                                                               @RequestBody UpdateRideStatusRequest request) {
        Ride ride = driverService.updateRideStatus(principal.getId(), rideId, request.getStatus());
        return ApiResponse.success(200, "Ride status updated successfully", ride);
    }

    @GetMapping("/earning-history")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<List<Ride>>> getRideHistory(@AuthenticationPrincipal UserPrincipal principal) {
        List<Ride> rides = driverService.getRideHistory(principal.getId());
        return ApiResponse.success(200, "Ride history retrieved successfully", rides);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDriverStats(@AuthenticationPrincipal UserPrincipal principal) {
        Map<String, Object> stats = driverService.getDriverStats(principal.getId());
        return ApiResponse.success(200, "Driver stats retrieved successfully", stats);
    }

    @GetMapping("/earnings")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDriverEarnings(@AuthenticationPrincipal UserPrincipal principal) {
        Map<String, Object> earnings = driverService.getDriverEarnings(principal.getId());
        return ApiResponse.success(200, "Driver earnings retrieved successfully", earnings);
    }

    @GetMapping("/active-rides")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<List<Ride>>> getActiveRides(@AuthenticationPrincipal UserPrincipal principal) {
        List<Ride> rides = driverService.getActiveRides(principal.getId());
        return ApiResponse.success(200, "Active rides retrieved successfully", rides);
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<DriverResponse>> getDriverProfile(@AuthenticationPrincipal UserPrincipal principal) {
        DriverResponse response = driverService.getDriverProfile(principal.getId());
        return ApiResponse.success(200, "Driver profile retrieved successfully", response);
    }

    @PatchMapping("/profile")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<DriverResponse>> updateDriverProfile(@AuthenticationPrincipal UserPrincipal principal,
                                                                           @RequestBody UpdateDriverProfileRequest request) {
        DriverResponse response = driverService.updateDriverProfile(principal.getId(), request);
        return ApiResponse.success(200, "Driver profile updated successfully", response);
    }

    @PatchMapping("/status")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<DriverResponse>> updateDriverStatus(@AuthenticationPrincipal UserPrincipal principal,
                                                                          @RequestBody UpdateDriverStatusRequest request) {
        DriverResponse response = driverService.updateDriverStatus(principal.getId(), request);
        return ApiResponse.success(200, "Driver status updated successfully", response);
    }
}
