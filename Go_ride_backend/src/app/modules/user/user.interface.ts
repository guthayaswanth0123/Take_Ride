import { Types } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

export interface IAuthProvider {
  provider: "credentials";
  providerId: string;
}

export enum IsBlock {
  BLOCK = "BLOCK",
  UNBLOCK = "UNBLOCK",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isBlock?: IsBlock;
  isSuspended?: boolean;
  isVerified?: boolean;
  role: Role;
  auths: IAuthProvider[];
  rides?: Types.ObjectId[];
  createdAt?: Date;
}

export interface IDriver extends IUser {
  isApproved: boolean;
  isOnline: boolean;
  vehicleInfo?: {
    type: string;
    licensePlate: string;
  };
}