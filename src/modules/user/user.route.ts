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
router.post("/register", UserController.registerUser);

const auth=(...requiredRoles: Role[])=>{
    return catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
        
        const token= req.cookies.accessToken 
                //    || req.headers.authorization?.startsWith('Bearer')? req.headers.authorization?.split(" ")[1]
                //    : req.headers.authorization;

       if(!token){
        throw new Error("you are not logged in, please log in");
       }

        const verifiedToken=jwtUtils.verifyToken(token,config.jwt_access_secret) as JwtPayload;
        const {email,name,id,role}=verifiedToken;

         if(requiredRoles.length && !requiredRoles.includes(role)){

          throw new Error("forbidden, you dont have permission")
     }
     const user = await prisma.user.findUniqueOrThrow({
        where: {
            id,
            email,
            name,
            role
        }
     })

     if(user.activeStatus==="Blocked"){
        throw new Error("Your account has been blocked, please contact support")
     }

      req.user={
        email,
        name,
        id,
        role
     }
  next();
    })
}

router.get("/me", 
    auth(Role.USER),
 UserController.getMyProfile)

export const UserRoutes = router;