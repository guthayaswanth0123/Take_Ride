import { baseApi } from "@/redux/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: ({ userId, userData }) => ({
        url: `/user/${userId}`,
        method: "PATCH",
        data: userData,
      }),
      invalidatesTags: ["USER", "AUTH"],
    }),
  }),
});

export const {
  useUpdateProfileMutation,
} = userApi;