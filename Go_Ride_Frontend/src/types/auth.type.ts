export interface ISendOtp {
  email: string;
}

export interface IVerifyOtp {
  email: string;
  otp: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IUser {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: "admin" | "rider" | "driver";
  isVerified: boolean;
  isApproved: boolean;
  isOnline?: boolean;
  createdAt: string;
  updatedAt: string;
}
