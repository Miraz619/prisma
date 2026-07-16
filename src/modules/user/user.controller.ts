import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { Prisma__UserClient } from './../../../generated/prisma/models/User';
import { sendRespnse } from "../../utils/sendResponse";

import jwt, { JwtPayload } from "jsonwebtoken";


import config from "../../config";
import { jwtUtils } from "../../utils/jw";
// const registerUser = async (req: Request, res: Response) => {
//   try {
     
  //   const { name, email, password } = req.body;

  // if (!name || !email || !password) {
  //   return res.status(httpStatus.BAD_REQUEST).json({
  //     success: false,
  //     statusCode: httpStatus.BAD_REQUEST,
  //     message: "Name, email and password are required",
  //   });
  // }

  // const user = await UserService.registerUser(req.body);

  // res.status(httpStatus.CREATED).json({
  //   success: true,
  //   statusCode: httpStatus.CREATED,
  //   message: "User registered successfully",
  //   data: {
  //     user,
  //   },
  // });

//   } catch (error) {
    
//   }
// };

const registerUser= catchAsync(async(req:Request,res:Response, next:NextFunction )=>{

const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "Name, email and password are required",
    });
  }

  const user = await UserService.registerUser(req.body);

  // res.status(httpStatus.CREATED).json({
  //   success: true,
  //   statusCode: httpStatus.CREATED,
  //   message: "User registered successfully",
  //   data: {
  //     user,
  //   },
  // });
sendRespnse(res,{
  success:true,
  statusCode:httpStatus.CREATED,
  message:"user registered successfully",
  data:{
    user
  }
})

})

const getMyProfile=catchAsync(async(req:Request,res:Response, next: NextFunction )=>{



// const {accessToken}=req.cookies;
//       const verifiedToken=jwtUtils.verifyToken(accessToken,config.jwt_access_secret) as JwtPayload;

  const profile=await UserService.getMyProfileFromDB(req.user?.id as string);



  sendRespnse(res,{
    success: true,
    statusCode: httpStatus.OK,
    message: "user profile fetched successfully",
    data: {profile}
  })

})

const updateMyProfile=catchAsync(async(req:Request, res: Response, next: NextFunction)=>{
  
  const userId=req.user?.id as string;
  const payload=req.body;

  const updatedProfile= await UserService.updateMyProfile(userId,payload);

  sendRespnse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message: "User profile Updated Successfully",
    data: {
      updatedProfile
    }
  })
})
export const UserController = {
  registerUser,
  getMyProfile,
  updateMyProfile
};