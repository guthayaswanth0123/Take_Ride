package com.goride.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.goride.enums.Enums.IsApprove;
import com.goride.enums.Enums.IsAvailable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "drivers")
public class Driver {
    @Id
    private String id;

    @JsonProperty("_id")
    public String get_id() {
        return id;
    }

    @Indexed(unique = true)
    private String user; // User ID reference

    private String vehicleType;

    @Indexed(unique = true)
    private String vehicleNumber;

    @Builder.Default
    private IsApprove approvalStatus = IsApprove.PENDING;

    @Builder.Default
    private IsAvailable availabilityStatus = IsAvailable.OFFLINE;

    @Builder.Default
    private Double earnings = 0.0;

    @CreatedDate
    private Date createdAt;

    @LastModifiedDate
    private Date updatedAt;
}
