"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/app/(components)/Navbar";
import Sidebar from "@/app/(components)/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";
import { usePathname, useRouter } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isAuthenticated = useAppSelector(
    (state) => state.global.isAuthenticated
  );
  const admin = useAppSelector((state) => state.global.admin);
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // If not authenticated and not on signin page, redirect to signin
  useEffect(() => {
    if (isHydrated && !isAuthenticated && pathname !== "/signin") {
      router.push("/signin");
    }
  }, [isHydrated, isAuthenticated, pathname, router]);

  // Apply dark/light theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.add("light");
    }
  });

  // Don't show dashboard for signin page
  if (pathname === "/signin") {
    return children;
  }

  // Show loading state while hydrating
  if (!isHydrated) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
  }

  // Restrict access based on role
  if (admin?.role === "MODERATOR" && (pathname === "/users" || pathname === "/expenses")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        isDarkMode ? "dark" : "light"
      } flex bg-gray-50 text-gray-900 w-full min-h-screen`}
    >
      <Sidebar />
      <main
        className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${
          isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;
