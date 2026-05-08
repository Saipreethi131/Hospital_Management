import jwt from "jsonwebtoken"
const {verify} =jwt 
import {config} from "dotenv"
config()

export const verifytoken =(...allowedroles)=>{
    return (req,res,next)=>{
        try{
            //get the token from cookie
            const token=req.cookies?.token
           // console.log(token)
            if(!token){
                return res.status(401).json({message:"Please Login First"})
            }
            let decodedtoken =verify(token,process.env.SecretKey)
            
            if(!allowedroles.includes(decodedtoken.role)){
                return res.status(403).json({message:"You are not Authorized"})
            }
            req.user=decodedtoken
           // console.log(decodedtoken)
            next()
        }
        catch(err){
            return res.status(401).json({message:"Invalid token"})
        }
    }
}