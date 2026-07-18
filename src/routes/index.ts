import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.router";
import { postRoutes } from "../modules/post/post.route";
import { commentRouter } from "../modules/comment/comment.route";

const router=express.Router();

router.use("/users", UserRoutes);
router.use("/auth",authRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRouter);

export default router;