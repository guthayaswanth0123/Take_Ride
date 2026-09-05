/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { RideService } from './ride.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';


const createRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const rider = req.user;
  const { userId } = rider as JwtPayload;
  // console.log('Ride request data:', req.body);
  const rideData = req.body;
  const result = await RideService.createRide(userId, rideData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Ride requested successfully!',
    data: result,
  });
});


const cancelRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const rider = req.user;
    const {userId: riderId} = rider as JwtPayload

    const result = await RideService.cancelRide(rideId, riderId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Ride cancelled successfully',
      data: result,
    });
  }
);


const getMyRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rider = req.user;

    const {userId: riderId} = rider as JwtPayload

    const result = await RideService.getMyRides(riderId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Ride history fetched successfully',
      data: result,
    });
  }
);


const getSingleRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const rider = req.user;

    const {userId: riderId} = rider as JwtPayload

    const result = await RideService.getSingleRide(rideId, riderId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Ride fetched successfully',
      data: result,
    });
  }
);

export const RideController = {
  createRide,
  cancelRide,
  getMyRides,
  getSingleRide,
};