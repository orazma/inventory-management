"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed, logout } from "@/state";
import {
  Archive,
  CircleDollarSign,
  Clipboard,
  Layout,
  LucideIcon,
  Menu,
  SlidersHorizontal,
  User,
  LogOut,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        }
        hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
          isActive ? "bg-blue-200 text-white" : ""
        }
      }`}
      >
        <Icon className="w-6 h-6 !text-gray-700" />

        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium text-gray-700`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const admin = useAppSelector((state) => state.global.admin);
  const isAuthenticated = useAppSelector(
    (state) => state.global.isAuthenticated
  );

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/signin");
  };

  if (!isAuthenticated) {
    return null;
  }

  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  return (
    <div className={sidebarClassNames}>
      {/* TOP LOGO */}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${
          isSidebarCollapsed ? "px-5" : "px-8"
        }`}
      >
        <Image
          src="/logo.png"
          alt="edstock-logo"
          width={27}
          height={27}
          className="rounded w-8"
        />
        <h1
          className={`${
            isSidebarCollapsed ? "hidden" : "block"
          } font-extrabold text-2xl`}
        >
          Mnas
        </h1>

        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* LINKS */}
      <div className="flex-grow mt-8">
        <SidebarLink
          href="/dashboard"
          icon={Layout}
          label="Dashboard"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/inventory"
          icon={Archive}
          label="Inventory"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/products"
          icon={Clipboard}
          label="Products"
          isCollapsed={isSidebarCollapsed}
        />
        
        {/* Users - Only for Super Admin */}
        {admin?.role === "SUPER_ADMIN" && (
          <SidebarLink
            href="/users"
            icon={User}
            label="Users"
            isCollapsed={isSidebarCollapsed}
          />
        )}

        {/* Moderators - Only for Super Admin */}
        {admin?.role === "SUPER_ADMIN" && (
          <SidebarLink
            href="/moderators"
            icon={Shield}
            label="Moderators"
            isCollapsed={isSidebarCollapsed}
          />
        )}

        <SidebarLink
          href="/settings"
          icon={SlidersHorizontal}
          label="Settings"
          isCollapsed={isSidebarCollapsed}
        />

        {/* Expenses - Only for Super Admin */}
        {admin?.role === "SUPER_ADMIN" && (
          <SidebarLink
            href="/expenses"
            icon={CircleDollarSign}
            label="Expenses"
            isCollapsed={isSidebarCollapsed}
          />
        )}
      </div>

      {/* ADMIN INFO & LOGOUT */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-10 px-8`}>
        <div className="mb-4 p-3 bg-gray-100 rounded-lg">
          <p className="text-xs font-semibold text-gray-700">{admin?.name}</p>
          <p className="text-xs text-gray-500 mb-1">{admin?.email}</p>
          <p className="text-xs font-medium text-blue-600">{admin?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded transition"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>

      {/* FOOTER */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-2 px-8`}>
        <p className="text-center text-xs text-gray-500">&copy; 2024 Edstock</p>
      </div>
    </div>
  );
};

export default Sidebar;
