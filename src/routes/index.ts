import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.router";

const router=express.Router();

router.use("/users", UserRoutes);
router.use("/auth",authRoutes);

export default router;