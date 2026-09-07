package com.goride.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.goride.enums.Enums.PaymentStatus;
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
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "payments")
public class Payment {
    @Id
    private String id;

    @JsonProperty("_id")
    public String get_id() {
        return id;
    }

    private String booking;
    private String ride;

    @Indexed(unique = true)
    private String transactionId;

    @Builder.Default
    private PaymentStatus status = PaymentStatus.UNPAID;

    private Double amount;
    private Map<String, Object> paymentGatewayData;
    private String invoiceUrl;

    @CreatedDate
    private Date createdAt;

    @LastModifiedDate
    private Date updatedAt;
}
