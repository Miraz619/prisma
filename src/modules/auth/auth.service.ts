
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jw";
import { IloginUser } from "./auth.inteface"
import bcrypt  from 'bcrypt';

import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { ActiveStatus } from "../../../generated/prisma/enums";



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


const refreshToken=async(refreshToken:string)=>{
 

   const verifiedRefreshToken=jwtUtils.verifyToken(refreshToken,config.jwt_refresh_secret) as JwtPayload;
   
   const {id}=verifiedRefreshToken;

   const user= await prisma.user.findUniqueOrThrow(

      {
         where :{
            id,
         }
      }
   )

   if(user.activeStatus===ActiveStatus.Blocked){
      throw new Error("User is blocked");
   }

   const JwtPayload={

      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
   };

   const accessToken= jwtUtils.CreateToken(JwtPayload,
      config.jwt_access_secret, config.jwt_acess_expires_in as SignOptions
   )


   return accessToken;

}

export const authService ={

    loginUser,
    refreshToken
}