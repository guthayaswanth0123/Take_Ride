import { baseApi } from "@/redux/baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    initRidePayment: builder.mutation({
      query: (rideId: string) => ({
        url: `/payment/init-ride-payment/${rideId}`,
        method: "POST",
      }),
    }),
  }),
});

export const { useInitRidePaymentMutation } = paymentApi;