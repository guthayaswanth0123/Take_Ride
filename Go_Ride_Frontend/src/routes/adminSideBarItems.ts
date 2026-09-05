
// import Analytics from "@/pages/Admin/Analytics";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProfile from "@/pages/admin/Profile";
import RideManagement from "@/pages/admin/RideManagement";
import UserManagement from "@/pages/admin/UserManagement";
import type { ISidebarItem } from "@/types";
// import { lazy } from "react";

// const Analytics = lazy(()=> import("@/pages/Admin/Analytics"))


//       { path: "profile", element: <AdminProfile /> },


export const adminSidebarItems : ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        component: AdminDashboard,
      },
       {
        title: "Users",
        url: "/admin/users",
        component: UserManagement,
      },
       {
        title: "Rides",
        url: "/admin/rides",
        component: RideManagement,
      },
      {
        title: "Profile",
        url: "/admin/profile",
        component: AdminProfile,
      },
      //
    ],
  },
];