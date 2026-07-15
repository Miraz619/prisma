import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import { create } from "node:domain"


const CreateToken=(payload: JwtPayload, secret: string, expiresIn: SignOptions)=>{

    const token=jwt.sign(payload,
        secret,
     {expiresIn}as SignOptions)

    return token;

}


export const jwtUtils={
    CreateToken,
}