import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["USER","AUTH", "RIDE", "DRIVER", "ADMIN", "REPORT"],
  endpoints: () => ({}),
  
});