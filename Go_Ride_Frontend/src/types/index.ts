import type { ComponentType } from "react";

export type { ILogin } from "./auth.type";


export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
}

export type TRole = "ADMIN" | "RIDER" | "DRIVER"


type ZodIssue = {
  code: string;
  expected: string;
  received: string;
  path: string[];
  message: string;
};

type ErrorSource = {
  path: string;
  message: string;
};

export interface IErrorResponse {
  success: boolean;
  message: string;
  errorSources?: ErrorSource[];
  err?: {
    issues: ZodIssue[];
    name: string;
  };
  stack?: string;
}


// types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'RIDER' | 'DRIVER' | 'ADMIN';
  isBlock: string;
  isVerified: boolean;
  isApproved?: boolean;
  isOnline?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface IResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ISendOtp {
  email: string;
}

export interface IVerifyOtp {
  email: string;
  otp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'RIDER' | 'DRIVER';
}