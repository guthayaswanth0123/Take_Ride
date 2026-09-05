import { model, Schema } from "mongoose";
import { IAuthProvider, IDriver, IsBlock, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const vehicleInfoSchema = new Schema(
  {
    vehicleType: { type: String, required: true },
    licensePlate: { type: String, required: true },
  },
  { _id: false }
);

const userSchema = new Schema<IUser & IDriver>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.RIDER,
    },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isBlock: {
      type: String,
      enum: Object.values(IsBlock),
      default: IsBlock.UNBLOCK,
    },
    isVerified: { type: Boolean, default: false },
    rides: [{ type: Schema.Types.ObjectId, ref: "Ride" }],
    auths: [authProviderSchema],
    isApproved: { type: Boolean, default: false }, // Driver-specific
    isOnline: { type: Boolean, default: false }, // Driver-specific
    vehicleInfo: { type: vehicleInfoSchema }, // Driver-specific
  },
  {
    timestamps: true, 
    versionKey: false,
  }
);

export const User = model<IUser & IDriver>("User", userSchema);