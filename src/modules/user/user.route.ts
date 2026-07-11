import express, { Request, Response } from "express";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import config from "../../config";
import { UserController } from "./user.controller";

const router = express.Router();

router.post("/register", UserController.registerUser)

export const UserRoutes = router;