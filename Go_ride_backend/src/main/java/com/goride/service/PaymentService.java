package com.goride.service;

import com.goride.enums.Enums.PaymentStatus;
import com.goride.model.Payment;
import com.goride.model.Ride;
import com.goride.model.User;
import com.goride.repository.PaymentRepository;
import com.goride.repository.RideRepository;
import com.goride.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final SslCommerzService sslCommerzService;

    @Value("${sslcommerz.success-frontend-url}")
    private String successFrontendUrl;

    @Value("${sslcommerz.fail-frontend-url}")
    private String failFrontendUrl;

    @Value("${sslcommerz.cancel-frontend-url}")
    private String cancelFrontendUrl;

    public Map<String, Object> initRidePayment(String rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        User rider = userRepository.findById(ride.getRider()).orElse(null);

        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Payment payment = Payment.builder()
                .ride(rideId)
                .transactionId(transactionId)
                .amount(ride.getFare() != null ? ride.getFare() : 100.0)
                .status(PaymentStatus.UNPAID)
                .build();

        paymentRepository.save(payment);

        Map<String, Object> sslRes = sslCommerzService.initPayment(
                transactionId,
                payment.getAmount(),
                rider != null ? rider.getName() : "Rider",
                rider != null ? rider.getEmail() : "rider@goride.com",
                rider != null ? rider.getPhone() : "01700000000"
        );

        Map<String, Object> response = new HashMap<>();
        response.put("paymentUrl", sslRes.get("GatewayPageURL"));
        response.put("transactionId", transactionId);
        return response;
    }

    public String handleSuccess(String transactionId, Double amount) {
        Payment payment = paymentRepository.findByTransactionId(transactionId).orElse(null);
        if (payment != null) {
            payment.setStatus(PaymentStatus.PAID);
            paymentRepository.save(payment);

            if (payment.getRide() != null) {
                rideRepository.findById(payment.getRide()).ifPresent(ride -> {
                    ride.setIsPaid(true);
                    rideRepository.save(ride);
                });
            }
        }
        return successFrontendUrl + "?transactionId=" + transactionId;
    }

    public String handleFail(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId).orElse(null);
        if (payment != null) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
        }
        return failFrontendUrl + "?transactionId=" + transactionId;
    }

    public String handleCancel(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId).orElse(null);
        if (payment != null) {
            payment.setStatus(PaymentStatus.CANCELLED);
            paymentRepository.save(payment);
        }
        return cancelFrontendUrl + "?transactionId=" + transactionId;
    }

    public String getInvoiceDownloadUrl(String paymentId) {
        return "/api/payment/invoice/pdf/" + paymentId;
    }
}
