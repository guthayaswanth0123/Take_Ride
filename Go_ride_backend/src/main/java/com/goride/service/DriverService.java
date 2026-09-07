package com.goride.service;

import com.goride.dto.DriverDto.*;
import com.goride.enums.Enums.*;
import com.goride.model.Driver;
import com.goride.model.Ride;
import com.goride.model.User;
import com.goride.model.User.VehicleInfo;
import com.goride.repository.DriverRepository;
import com.goride.repository.RideRepository;
import com.goride.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;
    private final UserRepository userRepository;
    private final RideRepository rideRepository;

    public DriverResponse applyToBeDriver(String userId, ApplyDriverRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(Role.DRIVER);
        user.setIsApproved(false);
        user.setVehicleInfo(new VehicleInfo(request.getVehicleType(), request.getVehicleNumber()));
        userRepository.save(user);

        Optional<Driver> existingDriver = driverRepository.findByUser(userId);
        Driver driver;
        if (existingDriver.isPresent()) {
            driver = existingDriver.get();
            driver.setVehicleType(request.getVehicleType());
            driver.setVehicleNumber(request.getVehicleNumber());
            driver.setApprovalStatus(IsApprove.PENDING);
        } else {
            driver = Driver.builder()
                    .user(userId)
                    .vehicleType(request.getVehicleType())
                    .vehicleNumber(request.getVehicleNumber())
                    .approvalStatus(IsApprove.PENDING)
                    .availabilityStatus(IsAvailable.OFFLINE)
                    .earnings(0.0)
                    .build();
        }
        Driver savedDriver = driverRepository.save(driver);
        return mapDriverToResponse(savedDriver, user);
    }

    public List<Ride> getAvailableRides() {
        return rideRepository.findByStatus(RideStatus.REQUESTED);
    }

    public Ride acceptRide(String userId, String rideId) {
        Driver driver = driverRepository.findByUser(userId)
                .orElseThrow(() -> new RuntimeException("Driver profile not found"));

        if (driver.getApprovalStatus() != IsApprove.APPROVED) {
            throw new RuntimeException("Driver is not approved!");
        }

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (ride.getStatus() != RideStatus.REQUESTED) {
            throw new RuntimeException("Ride is no longer available");
        }

        ride.setDriver(driver.getId());
        ride.setStatus(RideStatus.ACCEPTED);
        if (ride.getTimestamps() == null) {
            ride.setTimestamps(new Ride.RideTimestamps());
        }
        ride.getTimestamps().setAcceptedAt(new Date());

        driver.setAvailabilityStatus(IsAvailable.RIDING);
        driverRepository.save(driver);

        return rideRepository.save(ride);
    }

    public Ride rejectRide(String userId, String rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        return ride;
    }

    public Ride updateRideStatus(String userId, String rideId, RideStatus status) {
        Driver driver = driverRepository.findByUser(userId)
                .orElseThrow(() -> new RuntimeException("Driver profile not found"));

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        ride.setStatus(status);
        Date now = new Date();

        if (status == RideStatus.PICKED_UP) {
            ride.getTimestamps().setPickedUpAt(now);
        } else if (status == RideStatus.IN_TRANSIT) {
            ride.getTimestamps().setInTransitAt(now);
        } else if (status == RideStatus.COMPLETED) {
            ride.getTimestamps().setCompletedAt(now);
            driver.setEarnings((driver.getEarnings() != null ? driver.getEarnings() : 0.0) + (ride.getFare() != null ? ride.getFare() : 0.0));
            driver.setAvailabilityStatus(IsAvailable.ONLINE);
            driverRepository.save(driver);
        } else if (status == RideStatus.CANCELLED) {
            ride.getTimestamps().setCancelledAt(now);
            driver.setAvailabilityStatus(IsAvailable.ONLINE);
            driverRepository.save(driver);
        }

        return rideRepository.save(ride);
    }

    public List<Ride> getRideHistory(String userId) {
        Driver driver = driverRepository.findByUser(userId)
                .orElseThrow(() -> new RuntimeException("Driver profile not found"));
        return rideRepository.findByDriver(driver.getId());
    }

    public Map<String, Object> getDriverStats(String userId) {
        Driver driver = driverRepository.findByUser(userId)
                .orElseThrow(() -> new RuntimeException("Driver profile not found"));
        List<Ride> rides = rideRepository.findByDriver(driver.getId());

        long totalRides = rides.size();
        long completedRides = rides.stream().filter(r -> r.getStatus() == RideStatus.COMPLETED).count();
        double totalEarnings = driver.getEarnings() != null ? driver.getEarnings() : 0.0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRides", totalRides);
        stats.put("completedRides", completedRides);
        stats.put("totalEarnings", totalEarnings);
        stats.put("availabilityStatus", driver.getAvailabilityStatus());
        stats.put("approvalStatus", driver.getApprovalStatus());
        return stats;
    }

    public Map<String, Object> getDriverEarnings(String userId) {
        return getDriverStats(userId);
    }

    public List<Ride> getActiveRides(String userId) {
        Driver driver = driverRepository.findByUser(userId)
                .orElseThrow(() -> new RuntimeException("Driver profile not found"));
        return rideRepository.findByDriverAndStatusIn(driver.getId(), Arrays.asList(RideStatus.ACCEPTED, RideStatus.PICKED_UP, RideStatus.IN_TRANSIT));
    }

    public DriverResponse getDriverProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Driver driver = driverRepository.findByUser(userId)
                .orElseThrow(() -> new RuntimeException("Driver profile not found"));
        return mapDriverToResponse(driver, user);
    }

    public DriverResponse updateDriverProfile(String userId, UpdateDriverProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Driver driver = driverRepository.findByUser(userId)
                .orElseThrow(() -> new RuntimeException("Driver profile not found"));

        if (request.getVehicleType() != null) driver.setVehicleType(request.getVehicleType());
        if (request.getVehicleNumber() != null) driver.setVehicleNumber(request.getVehicleNumber());

        if (user.getVehicleInfo() == null) user.setVehicleInfo(new VehicleInfo());
        if (request.getVehicleType() != null) user.getVehicleInfo().setVehicleType(request.getVehicleType());
        if (request.getVehicleNumber() != null) user.getVehicleInfo().setLicensePlate(request.getVehicleNumber());

        userRepository.save(user);
        Driver updatedDriver = driverRepository.save(driver);
        return mapDriverToResponse(updatedDriver, user);
    }

    public DriverResponse updateDriverStatus(String userId, UpdateDriverStatusRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Driver driver = driverRepository.findByUser(userId)
                .orElseThrow(() -> new RuntimeException("Driver profile not found"));

        IsAvailable status = request.getStatus() != null ? request.getStatus() : request.getAvailabilityStatus();
        if (status != null) {
            driver.setAvailabilityStatus(status);
            user.setIsOnline(status == IsAvailable.ONLINE);
        }

        userRepository.save(user);
        Driver updatedDriver = driverRepository.save(driver);
        return mapDriverToResponse(updatedDriver, user);
    }

    private DriverResponse mapDriverToResponse(Driver driver, User user) {
        return DriverResponse.builder()
                .id(driver.getId())
                .user(user)
                .vehicleType(driver.getVehicleType())
                .vehicleNumber(driver.getVehicleNumber())
                .approvalStatus(driver.getApprovalStatus())
                .availabilityStatus(driver.getAvailabilityStatus())
                .earnings(driver.getEarnings())
                .build();
    }
}
