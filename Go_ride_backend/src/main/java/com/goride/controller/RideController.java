package com.goride.controller;

import com.goride.common.ApiResponse;
import com.goride.dto.RideDto.CreateRideRequest;
import com.goride.model.Ride;
import com.goride.security.UserPrincipal;
import com.goride.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideController {

    private final RideService rideService;

    @PostMapping("/request")
    @PreAuthorize("hasRole('RIDER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Ride>> createRide(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestBody CreateRideRequest request) {
        Ride ride = rideService.createRide(principal.getId(), request);
        return ApiResponse.success(201, "Ride requested successfully!", ride);
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasRole('RIDER')")
    public ResponseEntity<ApiResponse<Ride>> cancelRide(@AuthenticationPrincipal UserPrincipal principal,
                                                         @PathVariable("id") String rideId) {
        Ride ride = rideService.cancelRide(principal.getId(), rideId);
        return ApiResponse.success(200, "Ride cancelled successfully", ride);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('RIDER') or hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<List<Ride>>> getMyRides(@AuthenticationPrincipal UserPrincipal principal) {
        List<Ride> rides = rideService.getMyRides(principal.getId(), principal.getRole());
        return ApiResponse.success(200, "Ride history fetched successfully", rides);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('RIDER') or hasRole('DRIVER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Ride>> getSingleRide(@AuthenticationPrincipal UserPrincipal principal,
                                                           @PathVariable("id") String rideId) {
        Ride ride = rideService.getSingleRide(principal.getId(), rideId);
        return ApiResponse.success(200, "Ride fetched successfully", ride);
    }
}
