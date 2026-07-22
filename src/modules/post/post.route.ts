import express from "express";
import { postController } from "./post.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { premiumPostGuard } from "../../middlewares/premiumPostGuard";
const router = express.Router();

router.post(
  "/",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.createPost
);

router.get("/", postController.getAllPosts);
router.get(
  "/premium",
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),premiumPostGuard,
  postController.getPremiumPosts,
);
router.get("/my-posts",auth(Role.USER,Role.ADMIN), postController.getMyPosts)
router.get(
  "/stats",
  auth(Role.ADMIN),
  postController.getPostsStats
);
router.get("/:postId", postController.getPostById);
router.patch(
  "/:postId",
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),
  postController.updatePost
);
router.delete("/:postId", auth(Role.ADMIN,Role.USER,Role.AUTHOR),
postController.deletePost)

export const postRoutes = router;
