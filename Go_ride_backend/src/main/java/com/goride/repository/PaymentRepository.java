package com.goride.repository;

import com.goride.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    Optional<Payment> findByTransactionId(String transactionId);
    Optional<Payment> findByRide(String rideId);
    Optional<Payment> findByBooking(String bookingId);
}
