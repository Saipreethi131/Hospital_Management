import exp from 'express'
import {verifytoken} from "../Middleware/verifytoken.js"
import patientmodel from '../Models/PatientModel.js'

export const patientapp = exp.Router()

// GET PATIENT PROFILE
patientapp.get('/profile',verifytoken("PATIENT"),async (req, res) => {
  
    const patient = await patientmodel.findOne({patientid:req.user.id})
    if (!patient) {
      return res.status(404).json({message:"Patient not found" })
    }
    res.status(200).json({message:"Patient profile",payload:patient})
      
})

//UPDATE PATIENT PROFILE
patientapp.put('/profile',verifytoken("PATIENT"), async (req, res) => {
  const updatedpatient = await patientmodel.findOneAndUpdate(
    {patientid:req.user.id},
    req.body,
    {new:true,runValidators:true}
  )
  if(!updatedpatient){
    return res.status(404).json({message:"Patient not found"})
  }
  res.status(200).json({message:"Profile Updated",payload:updatedpatient})
})
