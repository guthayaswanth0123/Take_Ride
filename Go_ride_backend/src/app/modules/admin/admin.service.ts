import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { IsBlock, Role } from "../user/user.interface";
import { Ride } from "../ride/ride.model";
import { IAdminReport } from "./admin.interface";
import { Driver } from "../driver/driver.model";
import { RideStatus } from "../ride/ride.interface";
import { IsApprove } from "../driver/driver.interface";

const approveDriver = async (userId: string) => {
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (existingUser.role !== Role.DRIVER) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not a driver");
  }

  // First find or create the driver record
  let driver = await Driver.findOne({ user: userId });

  if (!driver) {
    // If no driver record exists, create one with default values
    driver = await Driver.create({
      user: userId,
      vehicleType: existingUser.vehicleInfo?.type || "Not Specified",
      vehicleNumber: existingUser.vehicleInfo?.licensePlate || "Not Specified",
      approvalStatus: IsApprove.APPROVED,
      availabilityStatus: "OFFLINE",
      earnings: 0,
    });
  } else {
    // Update existing driver record
    driver.approvalStatus = IsApprove.APPROVED;
    await driver.save();
  }

  // Update user record
  existingUser.isApproved = true;
  existingUser.isVerified = true;
  await existingUser.save();

  return {
    user: existingUser,
    driver: driver,
  };
};

const suspendDriver = async (userId: string) => {
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (existingUser.role !== Role.DRIVER) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not a driver");
  }

  if (!existingUser.isApproved) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver is not approved yet");
  }

  existingUser.isApproved = false;
  await existingUser.save();

  const driver = await Driver.findOne({ user: userId });

  if (driver) {
    // Update Driver collection
    driver.approvalStatus = IsApprove.SUSPENDED;
    await driver.save();
  }

  return { user: existingUser, driver };
};

const blockUser = async (userId: string) => {
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (existingUser.isBlock === IsBlock.BLOCK) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already blocked");
  }

  existingUser.isBlock = IsBlock.BLOCK;
  await existingUser.save();

  return existingUser;
};

const unblockUser = async (userId: string) => {
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (existingUser.isBlock === IsBlock.UNBLOCK) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already unblocked");
  }

  existingUser.isBlock = IsBlock.UNBLOCK;
  await existingUser.save();

  return existingUser;
};

const getAllUsers = async () => {
  return await User.find().select("-password");
};

const getAllDrivers = async () => {
  return await Driver.find().populate("user", "-password");
};

const getAllRides = async () => {
  return await Ride.find()
    .populate("rider", "-password")
    .populate({
      path: "driver",
      populate: {
        path: "user",
        select: "-password",
      },
    });
};

export const generateAdminReport = async (): Promise<IAdminReport> => {
  const [
    totalUsers,
    totalDrivers,
    totalRides,
    completedRides,
    ongoingRides,
    earningsData,
  ] = await Promise.all([
    User.countDocuments(),
    Driver.countDocuments(),
    Ride.countDocuments(),
    Ride.countDocuments({ status: RideStatus.COMPLETED }),
    Ride.countDocuments({
      status: { $in: [RideStatus.PICKED_UP, RideStatus.IN_TRANSIT] },
    }),
    Ride.aggregate([
      { $match: { status: RideStatus.COMPLETED } },
      { $group: { _id: null, total: { $sum: "$fare" } } },
    ]),
  ]);

  return {
    totalUsers,
    totalDrivers,
    totalRides,
    completedRides,
    ongoingRides,
    totalEarnings: earningsData[0]?.total || 0,
  };
};

export const AdminService = {
  approveDriver,
  suspendDriver,
  blockUser,
  unblockUser,
  getAllUsers,
  getAllDrivers,
  getAllRides,
  generateAdminReport,
};
