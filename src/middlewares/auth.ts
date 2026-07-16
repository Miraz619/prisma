import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { Role } from "../../generated/prisma/enums";
import { jwtUtils } from "../utils/jw";
import config from "../config";
import { prisma } from "../lib/prisma";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies.accessToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization);

    if (!token) {
      throw new Error("you are not logged in, please log in");
    }

    const verifiedToken = jwtUtils.verifyToken(
      token,
      config.jwt_access_secret,
    ) as JwtPayload;
    const { email, name, id, role } = verifiedToken;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error("forbidden, you dont have permission");
    }
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id
        
        
        
      },
    });

    if (user.activeStatus === "Blocked") {
      throw new Error("Your account has been blocked, please contact support");
    }

    req.user = {
      email,
      name,
      id,
      role,
    };
    next();
  });
};
