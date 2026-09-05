import { baseApi } from "@/redux/baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/admin/users",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),
     getAllDrivers: builder.query({
      query: () => ({
        url: "/admin/drivers",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),
    getAllRides: builder.query({
      query: () => ({
        url: "/admin/rides",
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),
    blockUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/user/block/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER"],
    }),
    unblockUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/user/unblock/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER"],
    }),
    approveDriver: builder.mutation({
      query: (driverId) => ({
        url: `/admin/driver/approve/${driverId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER"],
    }),
    suspendDriver: builder.mutation({
      query: (driverId) => ({
        url: `/admin/driver/suspend/${driverId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER"],
    }),
    getAdminReport: builder.query({
      query: () => ({
        url: "/admin/report",
        method: "GET",
      }),
      providesTags: ["REPORT"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetAllRidesQuery,
  useGetAllDriversQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
  useApproveDriverMutation,
  useSuspendDriverMutation,
  useGetAdminReportQuery,
} = adminApi;