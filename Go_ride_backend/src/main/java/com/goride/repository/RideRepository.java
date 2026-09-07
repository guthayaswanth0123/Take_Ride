package com.goride.repository;

import com.goride.enums.Enums.RideStatus;
import com.goride.model.Ride;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RideRepository extends MongoRepository<Ride, String> {
    List<Ride> findByRider(String riderId);
    List<Ride> findByDriver(String driverId);
    List<Ride> findByStatus(RideStatus status);
    List<Ride> findByDriverAndStatusIn(String driverId, List<RideStatus> statuses);
    List<Ride> findByRiderAndStatusIn(String riderId, List<RideStatus> statuses);
}
