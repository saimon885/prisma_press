import { Router } from "express";
import { userController } from "./user.controller";
import { prisma } from "../../lib/prisma";
import { Auth } from "../../middleware/Auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.post("/register", userController.registerUser);
router.get(
  "/me",
  Auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  userController.getProfile,
);
router.put(
  "/my-profile",
  Auth(Role.ADMIN, Role.USER),
  userController.updateProfile,
);

export const userRoutes = router;
