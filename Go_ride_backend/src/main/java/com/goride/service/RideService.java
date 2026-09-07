package com.goride.service;

import com.goride.dto.RideDto.CreateRideRequest;
import com.goride.enums.Enums.RideStatus;
import com.goride.enums.Enums.Role;
import com.goride.model.Driver;
import com.goride.model.Ride;
import com.goride.model.Ride.RideTimestamps;
import com.goride.model.User;
import com.goride.repository.DriverRepository;
import com.goride.repository.RideRepository;
import com.goride.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;

    public Ride createRide(String userId, CreateRideRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ride ride = Ride.builder()
                .rider(userId)
                .pickupLocation(request.getPickupLocation())
                .destinationLocation(request.getDestinationLocation())
                .fare(request.getFare() != null ? request.getFare() : 100.0)
                .status(RideStatus.REQUESTED)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "cash")
                .isPaid(false)
                .timestamps(new RideTimestamps(new Date(), null, null, null, null, null))
                .build();

        Ride savedRide = rideRepository.save(ride);

        if (user.getRides() == null) {
            user.setRides(new java.util.ArrayList<>());
        }
        user.getRides().add(savedRide.getId());
        userRepository.save(user);

        return savedRide;
    }

    public Ride cancelRide(String userId, String rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (!ride.getRider().equals(userId)) {
            throw new RuntimeException("You are not authorized to cancel this ride");
        }

        if (ride.getStatus() == RideStatus.COMPLETED) {
            throw new RuntimeException("Completed ride cannot be cancelled!");
        }

        ride.setStatus(RideStatus.CANCELLED);
        if (ride.getTimestamps() != null) {
            ride.getTimestamps().setCancelledAt(new Date());
        }
        return rideRepository.save(ride);
    }

    public List<Ride> getMyRides(String userId, Role role) {
        if (role == Role.DRIVER) {
            Optional<Driver> driverOpt = driverRepository.findByUser(userId);
            if (driverOpt.isPresent()) {
                return rideRepository.findByDriver(driverOpt.get().getId());
            }
        }
        return rideRepository.findByRider(userId);
    }

    public Ride getSingleRide(String userId, String rideId) {
        return rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
    }
}
