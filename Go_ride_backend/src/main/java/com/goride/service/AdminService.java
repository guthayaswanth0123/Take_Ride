package com.goride.service;

import com.goride.enums.Enums.IsApprove;
import com.goride.enums.Enums.IsBlock;
import com.goride.enums.Enums.RideStatus;
import com.goride.model.Driver;
import com.goride.model.Ride;
import com.goride.model.User;
import com.goride.repository.DriverRepository;
import com.goride.repository.RideRepository;
import com.goride.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final RideRepository rideRepository;

    public Driver approveDriver(String driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        driver.setApprovalStatus(IsApprove.APPROVED);
        Driver savedDriver = driverRepository.save(driver);

        userRepository.findById(driver.getUser()).ifPresent(user -> {
            user.setIsApproved(true);
            userRepository.save(user);
        });

        return savedDriver;
    }

    public Driver suspendDriver(String driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        driver.setApprovalStatus(IsApprove.SUSPENDED);
        Driver savedDriver = driverRepository.save(driver);

        userRepository.findById(driver.getUser()).ifPresent(user -> {
            user.setIsApproved(false);
            userRepository.save(user);
        });

        return savedDriver;
    }

    public User blockUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsBlock(IsBlock.BLOCK);
        return userRepository.save(user);
    }

    public User unblockUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsBlock(IsBlock.UNBLOCK);
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }

    public Map<String, Object> getAdminReport() {
        long totalUsers = userRepository.count();
        long totalDrivers = driverRepository.count();
        long totalRides = rideRepository.count();

        List<Ride> rides = rideRepository.findAll();
        double totalRevenue = rides.stream()
                .filter(r -> r.getStatus() == RideStatus.COMPLETED && r.getFare() != null)
                .mapToDouble(Ride::getFare)
                .sum();

        Map<String, Object> report = new HashMap<>();
        report.put("totalUsers", totalUsers);
        report.put("totalDrivers", totalDrivers);
        report.put("totalRides", totalRides);
        report.put("totalRevenue", totalRevenue);
        return report;
    }
}
