import { Driver } from "./driver.model";
import { IDriver, IsApprove, IsAvailable } from "./driver.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Ride } from "../ride/ride.model";
import { RideStatus } from "../ride/ride.interface";
import { User } from "../user/user.model";
import { Role, IUser } from "../user/user.interface";

const applyToBeDriver = async (userId: string, payload: Partial<IDriver>) => {
  const isAlreadyDriver = await Driver.findOne({ user: userId });

  if (isAlreadyDriver) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already applied or are already a driver."
    );
  }
  await User.findByIdAndUpdate(userId, { role: Role.DRIVER });

  const newDriver = await Driver.create({
    user: userId,
    vehicleType: payload.vehicleType,
    vehicleNumber: payload.vehicleNumber,
    approvalStatus: IsApprove.PENDING,
    availabilityStatus: IsAvailable.ONLINE,
  });

  return newDriver;
};

const getAvailableRides = async () => {
  const availableRides = await Ride.find({
    status: RideStatus.REQUESTED,
  }).sort({ createdAt: -1 });

  return availableRides;
};

const acceptRide = async (rideId: string, driverUserId: string) => {
  const driver = await Driver.findOne({ user: driverUserId }).populate<{
    user: IUser;
  }>("user");

  if (!driver) {
    throw new AppError(httpStatus.FORBIDDEN, "Driver profile not found");
  }

  // Check if driver has vehicle info
  if (!driver.vehicleType || !driver.vehicleNumber) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please update your information from profile before accepting rides"
    );
  }

  // Check if driver has phone number
  const user = driver.user as IUser;
  if (!user.phone) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please update your information from profile before accepting rides"
    );
  }

  if (driver.approvalStatus === IsApprove.SUSPENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are a SUSPENDED Driver. You can't accept Request"
    );
  }

  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  if (ride.status !== RideStatus.REQUESTED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Ride is not available for acceptance"
    );
  }

  ride.driver = driver._id;
  ride.status = RideStatus.ACCEPTED;
  ride.timestamps.acceptedAt = new Date();
  await ride.save();

  driver.availabilityStatus = IsAvailable.OFFLINE;
  await driver.save();

  return ride;
};

const rejectRide = async (rideId: string, driverUserId: string) => {
  const driver = await Driver.findOne({ user: driverUserId });

  if (!driver) {
    throw new AppError(httpStatus.FORBIDDEN, "Driver profile not found");
  }

  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  if (
    ride.status === RideStatus.REJECTED ||
    ride.status === RideStatus.COMPLETED
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, `Ride cannot be rejected`);
  }

  // Set driver association for history tracking
  ride.driver = driver._id;
  ride.status = RideStatus.REJECTED;
  await ride.save();

  driver.availabilityStatus = IsAvailable.ONLINE;
  await driver.save();

  return ride;
};

const updateRideStatus = async (rideId: string, driverUserId: string) => {
  const driver = await Driver.findOne({ user: driverUserId });
  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver profile not found");
  }

  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  // Check if driver is assigned (handle both driver._id and userId)
  const isAssigned =
    ride.driver &&
    (ride.driver.toString() === driver._id.toString() ||
      ride.driver.toString() === driverUserId);

  if (!isAssigned) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not assigned to this ride"
    );
  }

  let newStatus: typeof ride.status;

  if (ride.status === RideStatus.ACCEPTED) {
    newStatus = RideStatus.PICKED_UP;
    ride.timestamps.pickedUpAt = new Date();
  } else if (ride.status === RideStatus.PICKED_UP) {
    newStatus = RideStatus.IN_TRANSIT;
    ride.timestamps.inTransitAt = new Date();
  } else if (ride.status === RideStatus.IN_TRANSIT) {
    newStatus = RideStatus.COMPLETED;
    ride.timestamps.completedAt = new Date();
    driver.earnings = (driver.earnings || 0) + ride.fare;
    ride.isPaid = true;
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid ride status transition from ${ride.status}`
    );
  }

  ride.status = newStatus;
  await ride.save();

  if (newStatus === RideStatus.COMPLETED) {
    driver.availabilityStatus = IsAvailable.ONLINE;
    await driver.save();
  }

  return ride;
};

const getRideHistory = async (userId: string) => {
  const driver = await Driver.findOne({ user: userId });

  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }

  const rides = await Ride.find({ driver: driver._id })
    .populate("rider", "name email phone")
    .sort({ createdAt: -1 });

  const completedRides = rides.filter((ride) => ride.status === "COMPLETED");
  const totalEarnings = completedRides.reduce(
    (sum, ride) => sum + ride.fare,
    0
  );
  const averageRating =
    completedRides.length > 0
      ? (
          completedRides.reduce((sum, ride) => sum + (ride.rating || 0), 0) /
          completedRides.length
        ).toFixed(1)
      : 0;

  return {
    totalRides: rides.length,
    completedRides: completedRides.length,
    totalEarnings,
    averageRating,
    rides,
  };
};

const updateDriverStatus = async (userId: string, isOnline: boolean) => {
  const driver = await Driver.findOne({ user: userId });

  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver profile not found");
  }

  if (driver.approvalStatus !== IsApprove.APPROVED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only approved drivers can update their status"
    );
  }

  await User.findByIdAndUpdate(userId, { isOnline });
  driver.availabilityStatus = isOnline
    ? IsAvailable.ONLINE
    : IsAvailable.OFFLINE;
  await driver.save();

  return { isOnline, availabilityStatus: driver.availabilityStatus };
};

const getActiveRides = async (userId: string) => {
  const driver = await Driver.findOne({ user: userId });
  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }

  const activeRides = await Ride.find({
    $or: [{ driver: driver._id }, { driver: userId }],
    status: { $in: ["ACCEPTED", "PICKED_UP", "IN_TRANSIT"] },
  })
    .populate("rider", "name email phone")
    .sort({ createdAt: -1 });

  return activeRides;
};

// driver.service.ts
const getDriverProfile = async (userId: string) => {
  const driver = await Driver.findOne({ user: userId }).populate(
    "user",
    "-password"
  );

  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver profile not found");
  }

  return driver;
};

const updateDriverProfile = async (
  userId: string,
  payload: Partial<IDriver>
) => {
  const driver = await Driver.findOne({ user: userId });

  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver profile not found");
  }

  // Update driver-specific fields
  if (payload.vehicleType) driver.vehicleType = payload.vehicleType;
  if (payload.vehicleNumber) driver.vehicleNumber = payload.vehicleNumber;
  await driver.save();

  // Update user fields
  await User.findByIdAndUpdate(userId, {
    name: payload?.name,
    phone: payload?.phone,
    address: payload?.address,
  });

  const updatedDriver = await Driver.findOne({ user: userId }).populate(
    "user",
    "-password"
  );

  return updatedDriver;
};

// Fix the getDriverStats function
const getDriverStats = async (userId: string) => {
  const driver = await Driver.findOne({ user: userId });

  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }

  const now = new Date();

  // Set today's start to midnight (00:00:00) of the current day
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  // Set today's end to just before midnight (23:59:59.999) of the current day
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  // Get today's completed rides for this driver
  const todayRides = await Ride.find({
    driver: driver._id,
    status: "COMPLETED",
    createdAt: {
      $gte: todayStart,
      $lte: todayEnd,
    },
  });

  // Get all completed rides for this driver
  const [allCompletedRides, recentRides] = await Promise.all([
    Ride.find({
      driver: driver._id, // Filter by driver ID
      status: "COMPLETED",
    }),
    Ride.find({
      driver: driver._id, // Filter by driver ID
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("rider", "name"),
  ]);

  const todayEarnings = todayRides.reduce((sum, ride) => sum + ride.fare, 0);
  const totalRides = allCompletedRides.length;
  const averageRating =
    totalRides > 0
      ? (
          allCompletedRides.reduce((sum, ride) => sum + (ride.rating || 0), 0) /
          totalRides
        ).toFixed(1)
      : 0;

  return {
    todayEarnings,
    todayRides: todayRides.length,
    totalRides,
    averageRating,
    hoursOnline: 0,
    earningsChange: "+0%",
    recentRides,
  };
};

// Fix the getDriverEarnings function
const getDriverEarnings = async (userId: string) => {
  const driver = await Driver.findOne({ user: userId });
  if (!driver) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver not found");
  }

  // Get current date in local timezone
  const now = new Date();

  // Set today's start to midnight (00:00:00) of the current day
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  // Set today's end to just before midnight (23:59:59.999) of the current day
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  // Weekly date range (start of week)
  const weekStart = new Date(todayStart);
  weekStart.setDate(todayStart.getDate() - todayStart.getDay()); // Sunday of this week

  // Monthly date range (start of month)
  const monthStart = new Date(
    todayStart.getFullYear(),
    todayStart.getMonth(),
    1
  );

  // Get rides for different periods for this specific driver
  const [todayRides, weeklyRides, monthlyRides, allRides] = await Promise.all([
    Ride.find({
      driver: driver._id,
      status: "COMPLETED",
      createdAt: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    })
      .populate("rider")
      .sort({ createdAt: -1 }),
    Ride.find({
      driver: driver._id,
      status: "COMPLETED",
      createdAt: { $gte: weekStart },
    })
      .populate("rider")
      .sort({ createdAt: -1 }),
    Ride.find({
      driver: driver._id,
      status: "COMPLETED",
      createdAt: { $gte: monthStart },
    })
      .populate("rider")
      .sort({ createdAt: -1 }),
    Ride.find({
      driver: driver._id,
      status: "COMPLETED",
    })
      .populate("rider")
      .sort({ createdAt: -1 })
      .limit(10),
  ]);


  console.log(
    "Today rides:",
    todayRides.map((r) => ({
      fare: r.fare,
      createdAt: r.createdAt,
    }))
  );

  return {
    todayEarnings: todayRides.reduce((sum, ride) => sum + ride.fare, 0),
    todayRides: todayRides.length,
    weeklyEarnings: weeklyRides.reduce((sum, ride) => sum + ride.fare, 0),
    weeklyRides: weeklyRides.length,
    monthlyEarnings: monthlyRides.reduce((sum, ride) => sum + ride.fare, 0),
    monthlyRides: monthlyRides.length,
    totalEarnings: allRides.reduce((sum, ride) => sum + ride.fare, 0),
    recentEarnings: allRides,
  };
};

export const DriverService = {
  applyToBeDriver,
  getAvailableRides,
  acceptRide,
  rejectRide,
  updateRideStatus,
  getRideHistory,
  updateDriverStatus,
  getDriverStats,
  getDriverEarnings,
  getActiveRides,
  getDriverProfile,
  updateDriverProfile,
};
