import { Router } from "express";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { validateRequest } from "../../middlewares/validateRequest";


const router = Router();

router.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser);

router.patch('/:id', validateRequest(updateUserZodSchema), checkAuth(Role.ADMIN, Role.RIDER, Role.DRIVER), UserControllers.updateUser);

export const UserRoutes = router;