import { Router } from "express";
import { commentController } from "./comment.controller";
import { Auth } from "../../middleware/Auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.post(
  "/",
  Auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  commentController.createComment,
);
router.get("/author", Auth(), commentController.getAuthorComment);
router.get("/:commentId", commentController.getSingleComment);
router.patch(
  "/:commentId",
  Auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  commentController.updateComment,
);
router.delete(
  "/:commentId",
  Auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  commentController.deleteComment,
);
router.patch(
  "/admin/:commentId",
  Auth(Role.ADMIN),
  commentController.updateModarateComment,
);
export const commentRoutes = router;
