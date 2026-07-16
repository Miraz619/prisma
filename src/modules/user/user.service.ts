

import bcrypt from "bcrypt";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { JwtPayload } from 'jsonwebtoken';

type RegisterUserPayload = {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
};

const registerUser = async (payload: RegisterUserPayload) => {
  const { name, email, password, profilePhoto } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  await prisma.profile.create({
    data: {
      userId: createdUser.id,
      profilePhoto,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};


const getMyProfileFromDB=async(userId:string)=>{

   const user=await prisma.user.findUniqueOrThrow({

     where: {id: userId},
     omit: {
      password: true
     },
     include: {
      profile: true
     }

   })
  return user;
}

const updateMyProfile=async(userId:string, payload:any)=>{
  
      const{name,email,profilePhoto,bio}=payload;

      const updatedUser=await prisma.user.update({

        where: {id: userId},
        data:{

           name,
           email,
           profile: {

            update: {
              profilePhoto,
              bio
            }
           }

        },

        omit: {
          password: true
        },
        include:{
          profile: true
        }
      })


      return updatedUser;

}


export const UserService = {
  registerUser,
  getMyProfileFromDB,
  updateMyProfile
};