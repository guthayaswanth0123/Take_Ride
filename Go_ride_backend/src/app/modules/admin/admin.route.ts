import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AdminController } from "./admin.controller";

const router = Router();

router.patch("/driver/approve/:id", checkAuth(Role.ADMIN), AdminController.approveDriver);
router.patch("/driver/suspend/:id", checkAuth(Role.ADMIN), AdminController.suspendDriver);
router.patch("/user/block/:id", checkAuth(Role.ADMIN), AdminController.blockUser);
router.patch("/user/unblock/:id", checkAuth(Role.ADMIN), AdminController.unblockUser);

router.get("/users", checkAuth(Role.ADMIN), AdminController.getAllUsers);
router.get("/drivers", checkAuth(Role.ADMIN), AdminController.getAllDrivers);
router.get("/rides", checkAuth(Role.ADMIN), AdminController.getAllRides);

router.get("/report", checkAuth(Role.ADMIN), AdminController.getAdminReport);

export const AdminRoutes = router;