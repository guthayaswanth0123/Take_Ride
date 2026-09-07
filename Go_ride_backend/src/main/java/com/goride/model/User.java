package com.goride.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.goride.enums.Enums.IsBlock;
import com.goride.enums.Enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @JsonProperty("_id")
    public String get_id() {
        return id;
    }

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password;

    @Builder.Default
    private Role role = Role.RIDER;

    private String phone;
    private String picture;
    private String address;

    @Builder.Default
    private Boolean isDeleted = false;

    @Builder.Default
    private IsBlock isBlock = IsBlock.UNBLOCK;

    @Builder.Default
    private Boolean isVerified = false;

    @Builder.Default
    private List<String> rides = new ArrayList<>();

    @Builder.Default
    private List<AuthProvider> auths = new ArrayList<>();

    // Driver specific embedded fields
    @Builder.Default
    private Boolean isApproved = false;

    @Builder.Default
    private Boolean isOnline = false;

    private VehicleInfo vehicleInfo;

    @CreatedDate
    private Date createdAt;

    @LastModifiedDate
    private Date updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthProvider {
        private String provider;
        private String providerId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VehicleInfo {
        private String vehicleType;
        private String licensePlate;

        @JsonProperty("type")
        public String getType() {
            return vehicleType;
        }
    }
}
