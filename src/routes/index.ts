import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.router";
import { postRoutes } from "../modules/post/post.route";

const router=express.Router();

router.use("/users", UserRoutes);
router.use("/auth",authRoutes);
router.use("/posts", postRoutes);

export default router;