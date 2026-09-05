import { Types } from 'mongoose';

export enum RideStatus {
    REQUESTED = "REQUESTED",
    ACCEPTED = "ACCEPTED",
    PICKED_UP = "PICKED_UP",
    IN_TRANSIT = "IN_TRANSIT",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    REJECTED = "REJECTED"
}

export interface ILocation {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface IRide {
  _id?: Types.ObjectId;
  rider: Types.ObjectId;
  driver?: Types.ObjectId | null;
  pickupLocation: ILocation;
  destinationLocation: ILocation;
  status: RideStatus;
  fare: number;
  rating?: number;
  timestamps: {
    requestedAt: Date;
    acceptedAt?: Date;
    pickedUpAt?: Date;
    inTransitAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
  };
  isPaid: boolean;
  paymentMethod?: string;
  createdAt?: Date;
  updatedAt?: Date;
}