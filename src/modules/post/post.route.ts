import express from "express";
import { postController } from "./post.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
const router = express.Router();

router.post(
  "/",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.createPost
);

router.get("/", postController.getAllPosts);
router.get("/my-posts",auth(Role.USER,Role.ADMIN), postController.getMyPosts)
router.get("/:postId", postController.getPostById);
router.patch(
  "/:postId",
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),
  postController.updatePost
);

export const postRoutes = router;
