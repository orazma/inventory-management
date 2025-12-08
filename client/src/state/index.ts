import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Admin {
  adminId: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "MODERATOR";
}

export interface InitialStateTypes {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  admin: Admin | null;
  isAuthenticated: boolean;
}

const initialState: InitialStateTypes = {
  isSidebarCollapsed: false,
  isDarkMode: false,
  admin: null,
  isAuthenticated: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setAdmin: (state, action: PayloadAction<Admin | null>) => {
      state.admin = action.payload;
      state.isAuthenticated = action.payload !== null;
    },
    logout: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setIsSidebarCollapsed, setIsDarkMode, setAdmin, logout } = globalSlice.actions;

export default globalSlice.reducer;
