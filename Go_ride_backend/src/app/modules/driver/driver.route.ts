import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { DriverController } from "./driver.controller";
import { createDriverZodSchema } from "./driver.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.post(
  "/apply-driver",
  checkAuth(Role.RIDER),
  validateRequest(createDriverZodSchema),
  DriverController.applyToBeDriver
);
router.get(
  "/rides-available",
  checkAuth(Role.DRIVER),
  DriverController.getAvailableRides
);
router.patch(
  "/rides/:id/accept",
  checkAuth(Role.DRIVER),
  DriverController.acceptRide
);
router.patch(
  "/rides/:id/reject",
  checkAuth(Role.DRIVER),
  DriverController.rejectRide
);
router.patch(
  "/rides/:id/status",
  checkAuth(Role.DRIVER),
  DriverController.updateRideStatus
);
router.get(
  "/earning-history",
  checkAuth(Role.DRIVER),
  DriverController.getRideHistory
);
// router.patch("/status", checkAuth(Role.DRIVER, Role.RIDER), DriverController.updateDriverStatus);
router.get("/stats", checkAuth(Role.DRIVER), DriverController.getDriverStats);
router.get(
  "/earnings",
  checkAuth(Role.DRIVER),
  DriverController.getDriverEarnings
);
router.get(
  "/active-rides",
  checkAuth(Role.DRIVER),
  DriverController.getActiveRides
);
// driver.routes.ts
router.get(
  "/profile",
  checkAuth(Role.DRIVER),
  DriverController.getDriverProfile
);
router.patch(
  "/profile",
  checkAuth(Role.DRIVER),
  DriverController.updateDriverProfile
);
router.patch(
  "/status",
  checkAuth(Role.DRIVER),
  DriverController.updateDriverStatus
);

export const DriverRoutes = router;
