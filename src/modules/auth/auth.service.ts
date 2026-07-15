import { Sign } from "node:crypto";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jw";
import { IloginUser } from "./auth.inteface"
import bcrypt  from 'bcrypt';

import jwt, { SignOptions } from "jsonwebtoken";



const loginUser=async(payload:IloginUser)=>{

     const {email,password}=payload;
     const user=await prisma.user.findUniqueOrThrow({
        where: {email}
     })

     const isPasswordMatched=await bcrypt.compare(password,user.password);

     if(!isPasswordMatched){
        throw new Error("password is incorrect");
     }


     const jwtPayload={
     id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
     }

     const accessToken=jwtUtils.CreateToken(
      jwtPayload,
      config.jwt_access_secret,
      config.jwt_acess_expires_in as SignOptions
     )

   //   const refreshToken=jwt.sign(
       
   //    jwtPayload,
     
   //   config.jwt_refresh_secret,
   //   {
   //    expiresIn: config.jwt_refresh_expires_in
   //   } as SignOptions
   // )

   const refreshToken=jwtUtils.CreateToken(
      jwtPayload,
      config.jwt_refresh_secret,
      config.jwt_refresh_expires_in as SignOptions
   )
     return {
      accessToken,
      refreshToken
     }

}


export const authService ={

    loginUser
}