/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DriverService } from "./driver.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

const applyToBeDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const { userId } = user as JwtPayload;

    const driver = await DriverService.applyToBeDriver(userId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Driver application submitted successfully.",
      data: driver,
    });
  }
);

const getAvailableRides = catchAsync(async (req: Request, res: Response) => {
  const rides = await DriverService.getAvailableRides();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Available ride requests retrieved successfully",
    data: rides,
  });
});

const acceptRide = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.id;
  const user = req.user;

  const { userId } = user as JwtPayload;

  const result = await DriverService.acceptRide(rideId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ride accepted successfully",
    data: result,
  });
});

export const rejectRide = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  const { userId } = user as JwtPayload;

  const result = await DriverService.rejectRide(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ride request rejected successfully",
    data: result,
  });
});

export const updateRideStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;

    const { userId } = user as JwtPayload;

    const result = await DriverService.updateRideStatus(id, userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ride status updated successfully",
      data: result,
    });
  }
);

const getRideHistory = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const { userId } = user as JwtPayload;

  const result = await DriverService.getRideHistory(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ride history retrieved successfully",
    data: result,
  });
});

const updateDriverStatus = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const { isOnline } = req.body;

  const result = await DriverService.updateDriverStatus(userId, isOnline);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Driver status updated successfully",
    data: result,
  });
});

const getDriverStats = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as JwtPayload)?.userId;
  const result = await DriverService.getDriverStats(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Driver stats retrieved successfully",
    data: result,
  });
});

const getDriverEarnings = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;

  const result = await DriverService.getDriverEarnings(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Driver earnings retrieved successfully",
    data: result,
  });
});

const getActiveRides = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;

  const result = await DriverService.getActiveRides(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Active rides retrieved successfully",
    data: result,
  });
});

const getDriverProfile = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const driver = await DriverService.getDriverProfile(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Driver profile fetched successfully",
    data: driver,
  });
});

const updateDriverProfile = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const result = await DriverService.updateDriverProfile(userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Driver profile updated successfully",
    data: result,
  });
});

export const DriverController = {
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
