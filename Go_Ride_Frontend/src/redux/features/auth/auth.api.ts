import { baseApi } from "@/redux/baseApi";
import type { IResponse, ISendOtp, IVerifyOtp } from "@/types";

export type UserRole = "RIDER" | "DRIVER" | "ADMIN";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
   phone?: string;
   address?: string;
  isBlock: "BLOCK" | "UNBLOCK";
  isApproved?: boolean;
  isSuspended?: boolean;
  isVerified?: boolean;
  isOnline?: boolean;
  vehicleInfo?: {
    type: string;
    licensePlate: string;
  };
}


interface ILoginRequest {
  email: string;
  password: string;
}

interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  vehicleInfo?: {
    type: string;
    licensePlate: string;
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      IResponse<{
        accessToken: string;
        refreshToken: string;
        user: IUser;
      }>,
      ILoginRequest
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        data: credentials,
      }),
      invalidatesTags: ["AUTH", "USER"],
    }),

    logout: builder.mutation<IResponse<null>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch }) {
        try {
          dispatch(baseApi.util.resetApiState());
          localStorage.removeItem("token");
        } catch (err) {
          console.error("Logout error:", err);
        }
      },
      invalidatesTags: ["AUTH", "USER"],
    }),

    register: builder.mutation<
      IResponse<{
        accessToken: string;
        refreshToken: string;
        user: IUser;
      }>,
      IRegisterRequest
    >({
      query: (data) => ({
        url: "/user/register",
        method: "POST",
        data,
      }),
      invalidatesTags: ["AUTH", "USER"],
    }),
    sendOtp: builder.mutation<IResponse<null>, ISendOtp>({
      query: (userInfo) => ({
        url: "/otp/send",
        method: "POST",
        data: userInfo,
      }),
    }),

    verifyOtp: builder.mutation<IResponse<null>, IVerifyOtp>({
      query: (userInfo) => ({
        url: "/otp/verify",
        method: "POST",
        data: userInfo,
      }),
    }),

    userInfo: builder.query<IResponse<IUser>, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["USER", "AUTH"],
    }),

    updateDriverStatus: builder.mutation<
      IResponse<{ isOnline: boolean }>,
      { isOnline: boolean }
    >({
      query: (data) => ({
        url: "/driver/status",
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["USER", "AUTH"],
    }),

    changePassword: builder.mutation<
      IResponse<null>,
      { currentPassword: string; newPassword: string }
    >({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PATCH",
        data,
      }),
    }),

    verifyEmail: builder.mutation<IResponse<null>, string>({
      query: (token) => ({
        url: `/auth/verify/${token}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useUserInfoQuery,
  useLogoutMutation,
  useUpdateDriverStatusMutation,
} = authApi;
