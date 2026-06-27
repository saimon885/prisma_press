import { Router } from "express";
import { postController } from "./post.controller";
import { Auth } from "../../middleware/Auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.post(
  "/",
  Auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.createPost,
);

router.get("/", postController.getpost);
router.get(
  "/my-posts",
  Auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.myPosts,
);
router.get("/states", Auth(Role.ADMIN), postController.getPostStates);
router.get("/:postId", postController.getSinglePost);
router.patch(
  "/:postId",
  Auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.updatePost,
);
router.delete(
  "/:postId",
  Auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.deletePost,
);
export const postRoutes = router;
