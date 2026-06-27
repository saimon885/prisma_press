import { Router } from "express";
import { postController } from "./post.controller";

const router = Router();
router.post("/", postController.createPost);
router.get("/", postController.getpost);
router.get("/:postId", postController.getSinglePost);
router.patch("/:postId", postController.updatePost);
export const postRoutes = router;
