import { Router } from "express";
import { userController } from "./user.controller";
import { prisma } from "../../lib/prisma";
import { Auth } from "../../middleware/Auth";

const router = Router();
router.post("/users/register", userController.registerUser);
router.post("/users/login", userController.loginUser);
router.get("/users/all", Auth(), async (req, res) => {
  const user = await prisma.user.findMany();
  res.json(user);
});

export const userRoutes = router;
