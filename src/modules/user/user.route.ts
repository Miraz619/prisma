import express, { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import config from "../../config";
import { UserController } from "./user.controller";
import { jwtUtils } from "../../utils/jw";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { auth } from "../../middlewares/auth";

const router = express.Router();



router.post("/register", UserController.registerUser);



router.get("/me", 
    auth(Role.USER),
 UserController.getMyProfile)

export const UserRoutes = router;