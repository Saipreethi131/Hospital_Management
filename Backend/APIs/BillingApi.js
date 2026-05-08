import exp from 'express'
import {verifytoken} from "../Middleware/verifytoken.js"
import billingmodel from '../Models/BillingModel.js'
import patientmodel from '../Models/PatientModel.js'
import appointmentmodel from '../Models/AppointmentModel.js'
import doctormodel from '../Models/DoctorModel.js'

export const billingapp = exp.Router();

billingapp.post("/bill",verifytoken("DOCTOR"),async(req,res)=>{
    const {appointmentid,amount,paymentmethod}= req.body
    const appointment =await appointmentmodel.findById(appointmentid)
    if(!appointment){
        return res.status(404).json({message:"Appointment not found"})
    }

    const doctor = await doctormodel.findOne({doctorid:req.user.id});
    if(!doctor){
        return res.status(404).json({message:"Doctor not found"})
    }

    if(appointment.doctorid.toString() !== doctor._id.toString()){
        return res.status(403).json({message:"unauthorized"})
    }
  //
    const existingbill =await billingmodel.findOne({appointmentid})
    if(existingbill){
        return res.status(400).json({message:"Bill already exists"})
    }

    const newbill = await billingmodel.create({
        appointmentid,
        amount,
        paymentmethod
    })
 res.status(201).json({message:"Bill Generated",payload:newbill})  
})

//VIEW BILL using appointmentid
billingapp.get("/bill/:id",verifytoken("DOCTOR","PATIENT"),async(req,res)=>{
    const appointmentid = req.params.id
    const bill = await billingmodel.findOne({appointmentid})
    .populate({
        path:"appointmentid",
        populate:[
            {
                path:"doctorid"
            },
            {
                path:"patientid"
            }
        ]
    })
   if(!bill){
    return res.status(404).json({message:"Bill not found"})
   }

   if(req.user.role === "DOCTOR"){
    const doctor = await doctormodel.findOne({doctorid:req.user.id})
    if(!doctor){
        return res.status(404).json({message:"Doctor not found"})
    }
    if(bill.appointmentid.doctorid._id.toString() !== doctor._id.toString()){
        return res.status(403).json({message:"unauthorized"})
    }
   }

   if(req.user.role === "PATIENT"){
    const patient = await patientmodel.findOne({patientid:req.user.id})
    if(!patient){
        return res.status(404).json({message:"Patient not found"})
    }
    if(bill.appointmentid.patientid._id.toString() !== patient._id.toString()){
        return res.status(403).json({message:"unauthorized"})
    }
   }

   res.status(200).json({message:"Bill fetched successfully",payload:bill})
})

//ROUTE TO UPDATE PAYMENT STATUS IN THE BILL
billingapp.put("/bill/:id",verifytoken("DOCTOR"),async(req,res)=>{
    const doctor = await doctormodel.findOne({doctorid:req.user.id})
    if(!doctor){
        return res.status(404).json({message:"Doctor not found"})
    }

    const appointment = await appointmentmodel.findById(req.params.id)
    if(!appointment){
        return res.status(404).json({message:"Appointment not found"})
    }

    if(appointment.doctorid.toString() !== doctor._id.toString()){
        return res.status(403).json({message:"unauthorized"})
    }

    const bill =await billingmodel.findOneAndUpdate(
        {appointmentid:appointment._id} ,
        {status:"paid"},
        {new:true,runValidators:true}
    )
    if (!bill){
        return res.status(404).json({message:"Bill Not found"})
    }
    res.status(200).json({message:"Bill Paid successfully",payload:bill})
})