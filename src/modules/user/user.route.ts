import express, { NextFunction, Request, Response } from "express";

import { UserController } from "./user.controller";


import { Role } from "../../../generated/prisma/enums";

import { auth } from "../../middlewares/auth";

const router = express.Router();



router.post("/register", UserController.registerUser);



router.get("/me", 
    auth(Role.USER,Role.ADMIN,Role.ADMIN),
 UserController.getMyProfile)

 router.put("/my-profile",auth(Role.USER,Role.AUTHOR,Role.ADMIN),UserController.updateMyProfile)

export const UserRoutes = router;