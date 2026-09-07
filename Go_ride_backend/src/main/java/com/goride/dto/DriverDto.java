package com.goride.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.goride.enums.Enums.IsApprove;
import com.goride.enums.Enums.IsAvailable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

public class DriverDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApplyDriverRequest {
        @NotBlank(message = "Vehicle type is required")
        private String vehicleType;

        @NotBlank(message = "Vehicle number is required")
        private String vehicleNumber;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateDriverProfileRequest {
        private String vehicleType;
        private String vehicleNumber;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateDriverStatusRequest {
        private IsAvailable status;
        private IsAvailable availabilityStatus;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DriverResponse {
        private String id;

        @JsonProperty("_id")
        public String get_id() {
            return id;
        }

        private Object user;
        private String vehicleType;
        private String vehicleNumber;
        private IsApprove approvalStatus;
        private IsAvailable availabilityStatus;
        private Double earnings;
    }
}
