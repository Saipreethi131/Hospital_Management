import exp from 'express'
import usermodel from '../Models/UserModel.js'
import {hash,compare} from 'bcrypt'
import jwt from 'jsonwebtoken'
import doctormodel from '../Models/DoctorModel.js'
import patientmodel from '../Models/PatientModel.js'
const {sign}=jwt

export const authapp = exp.Router()

//REGISTER ROUTE
authapp.post('/register',async(req,res)=>{
    const newuser=req.body
    let allowedroles =["PATIENT","DOCTOR","ADMIN"]
     if(!allowedroles.includes(newuser.role))
     {
        return res.status(400).json({message:"Invalid Role"})
     }
     //hash the password
     newuser.password =await hash(newuser.password,12)
     const newuserdoc = new usermodel(newuser)
     await newuserdoc.save()

    if(newuserdoc.role === "DOCTOR")
     {
        await doctormodel.create({doctorid:newuserdoc._id})
     }
    if(newuserdoc.role === "PATIENT")
     {
        await patientmodel.create({patientid:newuserdoc._id})
     }

     res.status(201).json({message:"User Created"})
})

//LOGIN ROUTE
authapp.post('/login',async(req,res)=>{
    const {email,password} =req.body
    const user =await usermodel.findOne({email:email})
    if (!user)
    {
        return res.status(400).json({message:"Email does not exist"})
    }
    const ismatched = await compare(password,user.password)
    if(!ismatched){
        return res.status(400).json({message:"Invalid password"})
    }
    //create JWT TOKEN
    const signedtoken = sign({id:user._id,email:email,role:user.role},
        process.env.SecretKey,{expiresIn:"1h"})
    res.cookie("token",signedtoken,{
        httpOnly:true, //prevents javascript from accessing the cookie
        secure:false, //true-cookie is sent only over https 
        //In Development -false In Production -true
        sameSite:"lax" // strict : only samesite 
        //lax- allows some cross-site
        //none -allows all crosssite
    })
   //remove password from the user document before sending the response
    let userobj =user.toObject()
    //toObject()- converts mongoose document to javascrpit object
    delete userobj.password
    res.status(201).json({message:"Login succesfull",payload:userobj})
})

//LOGOUT
authapp.get("/logout",(req,res)=>{
    res.clearCookie("token",{
        httpOnly:true,
        secure:false,
        sameSite:"lax"
    })
    res.status(200).json({message:"Logout Success"})
})