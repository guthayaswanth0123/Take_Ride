package com.goride.enums;

public class Enums {
    public enum Role {
        ADMIN, RIDER, DRIVER
    }

    public enum IsBlock {
        BLOCK, UNBLOCK
    }

    public enum IsApprove {
        PENDING, APPROVED, SUSPENDED, REJECTED
    }

    public enum IsAvailable {
        ONLINE, OFFLINE, RIDING
    }

    public enum RideStatus {
        REQUESTED, ACCEPTED, PICKED_UP, IN_TRANSIT, COMPLETED, CANCELLED
    }

    public enum PaymentStatus {
        UNPAID, PAID, CANCELLED, FAILED
    }
}
