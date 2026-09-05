import {lazy} from "react"
import App from "@/App";


// Lazy load ALL components including layout
const About = lazy(() => import("@/pages/AboutPage"));
const Contact = lazy(() => import("@/pages/Contact"));
const Features = lazy(() => import("@/pages/FeaturesPage"));
const Home = lazy(() => import("@/pages/HomePage"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Verify = lazy(() => import("@/pages/Verify"));
const Unauthorized = lazy(() => import("@/pages/Unauthorized"));
const AccountStatus = lazy(() => import("@/pages/AccountStatus"));
const Success = lazy(() => import("@/pages/payment/Success"));
const Fail = lazy(() => import("@/pages/payment/Fail"));
const DashboardLayout = lazy(() => import("@/components/layout/DashboardLayout"));


import { createBrowserRouter, Navigate } from "react-router";
import { withAuth } from "@/utils/withAuth";
import type { TRole } from "@/types";
import { generateRoutes } from "@/utils/generateRoute";
import { adminSidebarItems } from "./adminSideBarItems";
import { role } from "@/constants/role";
import { riderSidebarItems } from "./riderSidebarItems";
import { driverSidebarItems } from "./driverSidebarItems";
import LazyWrapper from "@/components/LazyLoader";
import ServicesPage from "@/pages/ServicePage";
import DriverPartnership from "@/pages/DriverPartnership";
import BusinessPage from "@/pages/BusinessPage";


export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        element: <LazyWrapper><Home /></LazyWrapper>,
        index: true,
      },
      {
        element: <LazyWrapper><About /></LazyWrapper>,
        path: "about",
      },
      {
        element: <LazyWrapper><Contact /></LazyWrapper>,
        path: "contact",
      },
      {
        element: <LazyWrapper><ServicesPage /></LazyWrapper>,
        path: "services",
      },
      {
        element: <LazyWrapper><Features /></LazyWrapper>,
        path: "features",
      },
      {
        element: <LazyWrapper><DriverPartnership /></LazyWrapper>,
        path: "driver-partnership", 
      },
       {
        element: <LazyWrapper><BusinessPage /></LazyWrapper>,
        path: "business", 
      }
    ],
  },
  {
    element: <LazyWrapper><Login /></LazyWrapper>,
    path: "/login",
  },
  {
    element: <LazyWrapper><Register /></LazyWrapper>,
    path: "/register",
  },
  {
    element: <LazyWrapper><Verify /></LazyWrapper>,
    path: "/verify",
  },
  {
    element: <LazyWrapper><Unauthorized /></LazyWrapper>,
    path: "/unauthorized",
  },
  {
    element: <LazyWrapper><Success /></LazyWrapper>,
    path: "/payment/success",
  },
  {
    element: <LazyWrapper><Fail /></LazyWrapper>,
    path: "/payment/fail",
  },
  {
    element: <LazyWrapper><AccountStatus /></LazyWrapper>,
    path: "/account-status",
  },
  // Rider Routes
  {
    Component: withAuth(
      () => (
        <LazyWrapper>
          <DashboardLayout />
        </LazyWrapper>
      ), 
      role.rider as TRole
    ),
    path: "/rider",
    children: [
      { index: true, element: <Navigate to="/rider/dashboard" /> },
      ...generateRoutes(riderSidebarItems),
    ]
  },
  // Driver Routes
  {
    Component: withAuth(
      () => (
        <LazyWrapper>
          <DashboardLayout />
        </LazyWrapper>
      ), 
      role.driver as TRole
    ),
    path: "/driver",
    children: [
      { index: true, element: <Navigate to="/driver/dashboard" /> },
      ...generateRoutes(driverSidebarItems),
    ],
  },
  // Admin Routes
  {
    Component: withAuth(
      () => (
        <LazyWrapper>
          <DashboardLayout />
        </LazyWrapper>
      ), 
      role.admin as TRole
    ),
    path: "/admin",
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" /> },
      ...generateRoutes(adminSidebarItems),
    ],
  },
]);