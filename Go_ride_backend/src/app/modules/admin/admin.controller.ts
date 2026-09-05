/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminService, generateAdminReport } from "./admin.service";
import { JwtPayload } from "jsonwebtoken";

const approveDriver = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const driverId = req.params.id;
  const result = await AdminService.approveDriver(driverId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Driver approved successfully!",
    data: result,
  });
});

const suspendDriver = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const driverId = req.params.id;
  const result = await AdminService.suspendDriver(driverId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Driver suspended successfully!",
    data: result,
  });
});

const blockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;

  const result = await AdminService.blockUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Blocked successfully!",
    data: result,
  });
});

const unblockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;

  const result = await AdminService.unblockUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Unblocked successfully!",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await AdminService.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users fetched successfully",
    data: users,
  });
});

const getAllDrivers = catchAsync(async (req: Request, res: Response) => {
  const drivers = await AdminService.getAllDrivers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Drivers fetched successfully",
    data: drivers,
  });
});

const getAllRides = catchAsync(async (req: Request, res: Response) => {
  const rides = await AdminService.getAllRides();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rides fetched successfully",
    data: rides,
  });
});


export const getAdminReport = catchAsync(async (req: Request, res: Response) => {
  const report = await generateAdminReport();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin report generated successfully",
    data: report,
  });
});

export const AdminController = {
  approveDriver,
  suspendDriver,
  blockUser,
  unblockUser,
  getAllUsers,
  getAllDrivers,
  getAllRides,
  getAdminReport,
};