package com.goride.controller;

import com.goride.common.ApiResponse;
import com.goride.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/location")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> searchLocation(@RequestParam("query") String query) {
        List<Map<String, Object>> locations = locationService.searchLocation(query);
        return ApiResponse.success(200, "Locations fetched successfully", locations);
    }
}
