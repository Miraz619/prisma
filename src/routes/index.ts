import express from "express";
import { UserRoutes } from "../modules/user/user.route";

const router=express.Router();

router.use("/users", UserRoutes);

export default router;