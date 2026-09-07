package com.goride.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.goride.enums.Enums.RideStatus;
import com.goride.model.Ride.LocationPoint;
import com.goride.model.Ride.RideTimestamps;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class RideDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRideRequest {
        private LocationPoint pickupLocation;
        private LocationPoint destinationLocation;
        private Double fare;
        private String paymentMethod;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRideStatusRequest {
        private RideStatus status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RideResponse {
        private String id;

        @JsonProperty("_id")
        public String get_id() {
            return id;
        }

        private Object rider;
        private Object driver;
        private LocationPoint pickupLocation;
        private LocationPoint destinationLocation;
        private RideStatus status;
        private Double fare;
        private Integer rating;
        private RideTimestamps timestamps;
        private Boolean isPaid;
        private String paymentMethod;
    }
}
