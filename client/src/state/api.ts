import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

export interface SalesSummary {
  salesSummaryId: string;
  totalValue: number;
  changePercentage?: number;
  date: string;
}

export interface PurchaseSummary {
  purchaseSummaryId: string;
  totalPurchased: number;
  changePercentage?: number;
  date: string;
}

export interface ExpenseSummary {
  expenseSummarId: string;
  totalExpenses: number;
  date: string;
}

export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}

export interface DashboardMetrics {
  popularProducts: Product[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

export interface User {
  userId: string;
  name: string;
  email: string;
}

export interface NewUser {
  userId: string;
  name: string;
  email: string;
}

export interface Admin {
  adminId: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "MODERATOR";
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Products", "Users", "Expenses", "Admins"],
  endpoints: (build) => ({
    signin: build.mutation<
      { success: boolean; admin: Admin },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/signin",
        method: "POST",
        body: credentials,
      }),
    }),
    createAdmin: build.mutation<
      { success: boolean; admin: Admin },
      { adminId: string; name: string; email: string; password: string; role?: string }
    >({
      query: (data) => ({
        url: "/auth/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Admins"],
    }),
    getAllAdmins: build.query<Admin[], void>({
      query: () => "/auth/admins",
      providesTags: ["Admins"],
    }),
    deleteAdmin: build.mutation<{ success: boolean; message: string }, string>({
      query: (adminId) => ({
        url: `/auth/admins/${adminId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admins"],
    }),
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),
    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),
    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    getUsers: build.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    createUser: build.mutation<{ success: boolean; user: User }, NewUser>({
      query: (newUser) => ({
        url: "/users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: build.mutation<{ success: boolean; message: string }, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    getExpensesByCategory: build.query<ExpenseByCategorySummary[], void>({
      query: () => "/expenses",
      providesTags: ["Expenses"],
    }),
  }),
});

export const {
  useSigninMutation,
  useCreateAdminMutation,
  useGetAllAdminsQuery,
  useDeleteAdminMutation,
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetExpensesByCategoryQuery,
} = api;
