
// import { lazy } from "react";

import BookRide from "@/pages/rider/BookRide";
import LiveTracking from "@/pages/rider/LiveTracking";
import Profile from "@/pages/rider/Profile";
import RideHistory from "@/pages/rider/RideHistory";
import RiderDashboard from "@/pages/rider/RiderDashboard";
import SafetySettings from "@/pages/rider/SafetySettings";
import type { ISidebarItem } from "@/types";

// const Analytics = lazy(()=> import("@/pages/Admin/Analytics"))


// const LiveTracking = lazy(()=> import("@/pages/rider/LiveTracking"))

export const riderSidebarItems : ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/rider/dashboard",
        component: RiderDashboard,
      },
       {
        title: "Book Ride",
        url: "/rider/book-ride",
        component: BookRide,
      },
       {
        title: "Live Tracking",
        url: "/rider/live-tracking",
        component: LiveTracking,
      },
        {
        title: "Live Tracking",
        url: "/rider/live-tracking/:rideId",
        component: LiveTracking,
      },
        {
        title: "Ride History",
        url: "/rider/ride-history",
        component: RideHistory,
      },
      {
        title: "Profile",
        url: "/rider/profile",
        component: Profile,
      },
      {
        title: "Safety",
        url: "/rider/safety",
        component: SafetySettings
      }
      //
    ],
  },
];