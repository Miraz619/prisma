import { Request, Response } from "express";
import httpStatus from "http-status";
import { UserService } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "Name, email and password are required",
    });
  }

  const user = await UserService.registerUser(req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: {
      user,
    },
  });
};

export const UserController = {
  registerUser,
};