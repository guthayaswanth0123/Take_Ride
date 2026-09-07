package com.goride.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.goride.enums.Enums.RideStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "rides")
public class Ride {
    @Id
    private String id;

    @JsonProperty("_id")
    public String get_id() {
        return id;
    }

    private String rider; // User ID
    private String driver; // Driver ID (or User ID depending on lookup)

    private LocationPoint pickupLocation;
    private LocationPoint destinationLocation;

    @Builder.Default
    private RideStatus status = RideStatus.REQUESTED;

    private Double fare;
    private Integer rating;

    @Builder.Default
    private RideTimestamps timestamps = new RideTimestamps();

    @Builder.Default
    private Boolean isPaid = false;

    @Builder.Default
    private String paymentMethod = "cash";

    @CreatedDate
    private Date createdAt;

    @LastModifiedDate
    private Date updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Coordinates {
        private Double lat;
        private Double lng;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationPoint {
        private String address;
        private Coordinates coordinates;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RideTimestamps {
        private Date requestedAt = new Date();
        private Date acceptedAt;
        private Date pickedUpAt;
        private Date inTransitAt;
        private Date completedAt;
        private Date cancelledAt;
    }
}
