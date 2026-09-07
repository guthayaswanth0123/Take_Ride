package com.goride.repository;

import com.goride.enums.Enums.IsApprove;
import com.goride.enums.Enums.IsAvailable;
import com.goride.model.Driver;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends MongoRepository<Driver, String> {
    Optional<Driver> findByUser(String user);
    Optional<Driver> findByVehicleNumber(String vehicleNumber);
    List<Driver> findByApprovalStatus(IsApprove approvalStatus);
    List<Driver> findByAvailabilityStatus(IsAvailable availabilityStatus);
    List<Driver> findByApprovalStatusAndAvailabilityStatus(IsApprove approvalStatus, IsAvailable availabilityStatus);
}
