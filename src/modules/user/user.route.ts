import express, { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import config from "../../config";
import { UserController } from "./user.controller";
import { jwtUtils } from "../../utils/jw";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();


declare global{
 
    namespace Express{

        interface Request{

            user?: {
                email: string;
                name: string;
                id: string;
                role: Role;
            }
        }
    }

}
router.post("/register", UserController.registerUser)
router.get("/me", (req:Request, res: Response, next:NextFunction)=>{
    
      const {accessToken}=req.cookies;
      const verifiedToken=jwtUtils.verifyToken(accessToken,config.jwt_access_secret) as JwtPayload;
       

      const {email,name,id,role}=verifiedToken;
      const requiredRoles=[Role.ADMIN, Role.AUTHOR,Role.USER];
     if(!requiredRoles.includes(role)){

        return res.status(httpStatus.FORBIDDEN).json({

             success: false,
      statusCode: httpStatus.FORBIDDEN,
      message: "failed to register user",
      error: "forbidden, you dont have permission to access this resource"
        })
     }
      
     req.user={
        email,
        name,
        id,
        role
     }

    next();
}, UserController.getMyProfile)

export const UserRoutes = router;