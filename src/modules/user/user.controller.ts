import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { Prisma__UserClient } from './../../../generated/prisma/models/User';
import { sendRespnse } from "../../utils/sendResponse";


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
export const UserController = {
  registerUser,
};