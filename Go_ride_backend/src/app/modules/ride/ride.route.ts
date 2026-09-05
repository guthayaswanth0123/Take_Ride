import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { RideController } from "./ride.controller";

import { createRideZodSchema } from "./ride.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.post("/request", checkAuth(Role.RIDER, Role.ADMIN), validateRequest(createRideZodSchema), RideController.createRide)
router.patch("/:id/cancel", checkAuth(Role.RIDER), RideController.cancelRide)
router.get("/me", checkAuth(Role.RIDER, Role.DRIVER), RideController.getMyRides)
router.get("/:id", checkAuth(Role.RIDER), RideController.getSingleRide)

export const RideRoutes = router;