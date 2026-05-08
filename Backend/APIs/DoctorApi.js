import exp from 'express'
import {verifytoken} from "../Middleware/verifytoken.js"
import doctormodel from '../Models/DoctorModel.js'

export const doctorapp = exp.Router()

//Route to VIEW OWN PROFILE
doctorapp.get('/profile',verifytoken("DOCTOR"),async(req,res)=>{

    const doctor =await doctormodel.findOne({doctorid:req.user.id})
    if (!doctor){
      return res.status(404).json({message:"Doctor not Found"})
    }
    res.status(200).json({message:"doctor profile",payload:doctor})
  }
)

//Route to Update DOCTOR PROFILE
doctorapp.put('/profile',verifytoken("DOCTOR"),async(req,res)=>{

const updateddoctor = await doctormodel.findOneAndUpdate(
  {doctorid:req.user.id},//to find
   req.body,// to get updated body from request
   {new:true,runValidators:true})//to return updated document
   /*findoneandupdate()-finds the document,updates it and returns
   the new document therefore we need not save the document explicitly*/
  
   if(!updateddoctor){
    return res.status(404).json({message:"Doctor not found"})
   }
   res.status(200).json({message:"profile updated",payload:updateddoctor})
})

//ROUTE TO UPDATE AVAILABILITY
doctorapp.put("/availability",verifytoken("DOCTOR"),async(req,res)=>{
  const {availability}=req.body
  console.log(availability)
  const updateddoctor =await doctormodel.findOneAndUpdate(
    {doctorid:req.user.id},
    {availability},
    {new:true,runValidators:true}
  )
  if (!updateddoctor){
    return res.status(404).json({message:"Doctor not found"})
  }
  res.status(200).json({message:"updated availability",payload:updateddoctor.availability})
})