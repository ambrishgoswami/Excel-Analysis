import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Use environment variable for API base URL, fallback to localhost for development
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Admins",
    "Dashboard",
  ],
  endpoints: (builder) => ({
    getUserById: builder.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    getAdmins: builder.query({
      query: () => `management/admins`,
      providesTags: ["Admins"],
    }),
    getDashboard: builder.query({
      query: () => `general/dashboard`,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useGetAdminsQuery,
  useGetDashboardQuery,
} = api;
