import { Types } from 'mongoose';

export enum IsApprove {
    APPROVED = "APPROVED",
    PENDING = "PENDING",
    SUSPENDED = "SUSPENDED",
    BLOCKED = "BLOCKED"
}

export enum IsAvailable {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE"
}

export interface IDriver {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  name?: string;
  phone?: string;
  address?: string;
  vehicleType: string;
  vehicleNumber: string;
  approvalStatus: IsApprove;
  availabilityStatus: IsAvailable;
  earnings: number;
  isVerified: { type: boolean, default: false },
  createdAt?: Date;
  updatedAt?: Date;
}