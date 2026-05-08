import exp from 'express'
import {verifytoken} from "../Middleware/verifytoken.js"
import prescriptionmodel from '../Models/PrescriptionModel.js'
import patientmodel from '../Models/PatientModel.js'
import appointmentmodel from '../Models/AppointmentModel.js'
import doctormodel from '../Models/DoctorModel.js'

export const prescriptionapp = exp.Router();

//ROUTE TO WRITE PRESCRIPTION
prescriptionapp.post("/prescription",verifytoken("DOCTOR"),async(req,res)=>{
    const {appointmentid,diagnosis,medicines,notes}=req.body
    const doctor = await doctormodel.findOne({doctorid:req.user.id})
    if(!doctor){
        return res.status(404).json({message:"Doctor not found"})
    }
    //check if appointment exists
    const appointment= await appointmentmodel.findById(appointmentid)
    if(!appointment){
        return res.status(404).json({message:"Appointment not found"})
    }
    if(appointment.doctorid.toString() !== doctor._id.toString()){
        return res.status(403).json({message:"You are not authorized"})
    }
    //create prescription
    const prescription = await prescriptionmodel.create({
        appointmentid,
        doctorid:doctor._id,
        patientid:appointment.patientid,
        diagnosis,
        medicines,
        notes
    })
    res.status(201).json({message:"Prescription Generated",payload:prescription})
})


// ROUTE TO VIEW PRESCRIPTION - BY PATIENT
prescriptionapp.get("/Pprescription",verifytoken("PATIENT"),async(req,res)=>{
    const patient=await patientmodel.findOne({patientid:req.user.id})
    if(!patient){
        return res.status(404).json({message:"Patient Not Found"})
    }

    const prescription =await prescriptionmodel.find({patientid:patient._id})
    .populate("doctorid","specialization experience")
    .populate("appointmentid","date time status")

    res.status(200).json({message:"prescription fetched succesfully",payload:prescription})
})

//ROUTE TO VIEW PRESCRIPTION- BY DOCTOR
prescriptionapp.get("/Dprescription",verifytoken("DOCTOR"),async(req,res)=>{
    const doctor=await doctormodel.findOne({doctorid:req.user.id})
    if(!doctor){
        return res.status(404).json({message:"Doctor Not Found"})
    }
    const prescription =await prescriptionmodel.find({doctorid:doctor._id})
    .populate("patientid")
    .populate("appointmentid","date time status")

    res.status(200).json({message:"prescription fetched succesfully",payload:prescription})
})