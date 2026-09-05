import { baseApi } from "@/redux/baseApi";

export const ridesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRide: builder.mutation({
      query: (rideData) => ({
        url: "/rides/request",
        method: "POST",
        data: rideData,
      }),
      invalidatesTags: ["RIDE"],
    }),
    getMyRides: builder.query({
      query: () => ({
        url: "/rides/me",
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),
    getSingleRide: builder.query({
      query: (rideId) => ({
        url: `/rides/${rideId}`,
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),
    cancelRide: builder.mutation({
      query: (rideId) => ({
        url: `/rides/${rideId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["RIDE"],
    }),
  }),
});

export const {
  useCreateRideMutation,
  useGetMyRidesQuery,
  useGetSingleRideQuery,
  useCancelRideMutation,
} = ridesApi;

// Alias for live tracking
export const useGetRideDetailsQuery = useGetSingleRideQuery;