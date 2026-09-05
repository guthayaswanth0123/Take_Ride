// import { lazy } from "react";

import DriverDashboard from "@/pages/driver/DriverDashboard";
import DriverRideHistory from "@/pages/driver/DriverRideHistory";
import Earnings from "@/pages/driver/Earnings";
import Profile from "@/pages/driver/Profile";
import type { ISidebarItem } from "@/types";

// const Analytics = lazy(()=> import("@/pages/Admin/Analytics"))

export const driverSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/driver/dashboard",
        component: DriverDashboard,
      },
      {
        title: "Earnings",
        url: "/driver/earnings",
        component: Earnings,
      },
      {
        title: "Ride History",
        url: "/driver/history",
        component: DriverRideHistory,
      },
      {
        title: "Profile",
        url: "/driver/profile",
        component: Profile,
      },
    ],
  },
];