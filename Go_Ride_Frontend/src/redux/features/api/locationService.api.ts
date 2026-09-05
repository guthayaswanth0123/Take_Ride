/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";


export const locationServiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchLocation: builder.mutation({
      query: ({ query_text }: { query_text: string }) => ({
        url: `/location/search?query_text=${encodeURIComponent(query_text)}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response,
      transformErrorResponse: (response: any) => response,
    }),
  }),
});

export const { useSearchLocationMutation } = locationServiceApi;