import exp from 'express'
import {verifytoken} from "../Middleware/verifytoken.js"
import patientmodel from '../Models/PatientModel.js'
import appointmentmodel from '../Models/AppointmentModel.js'
import doctormodel from '../Models/DoctorModel.js'

export const appointmentapp = exp.Router()

// BOOK AN APPOINTMENT
appointmentapp.post("/appointment",verifytoken("PATIENT"),async(req,res)=>{
    
    const {doctorid,date,time}=req.body

    //to find logged in patient profile
    const patient = await patientmodel.findOne({patientid:req.user.id})
    if(!patient){
        return res.status(404).json({message:"Patient profile not found"})
    }

    //to find doctor profile
    const doctor= await doctormodel.findOne({doctorid:doctorid})
    if(!doctor){
        return res.status(404).json({message:"Doctor not existing"})
    }

    //convert date => weekday
    const day=new Date(date).toLocaleString("en-US",{weekday:"long"});
    //check if doctor available that day
    const dayavailability=doctor.availability.find((a)=>a.day===day);
 // console.log(dayavailability)
    if(!dayavailability){
        return res.status(400).json({message:`Doctor not available on ${day}`})
    }
    //check slot availability on that particular day
    if(!dayavailability.slots.includes(time)){
        return res.status(400).json({message:"slot not available"})
    }

    const existingappointment = await appointmentmodel.findOne({
        doctorid:doctor._id,
        date,
        time,
        status:"booked"
    })
    if(existingappointment){
        return res.status(400).json({message:"slot already booked"})
    }
    try{
        const appointment =await appointmentmodel.create({
            patientid:patient._id,
            doctorid:doctor._id,
            date,
            time
        })
        res.status(201).json({message:"Appointment Booked succesfully",payload:appointment})
    }
    catch(err){
        if(err.code === 11000){
            return res.status(400).json({message:"slot already booked"})
        }
        throw err
    }
})



// VIEW ALL APOINTMENTS
appointmentapp.get("/appointment",verifytoken("PATIENT","DOCTOR"),async(req,res)=>{
    let appointments
    if(req.user.role === "DOCTOR"){
        const doctor= await doctormodel.findOne({doctorid:req.user.id})
        if(!doctor){
            return res.status(404).json({message:"Doctor not found"})
        }

        appointments = await appointmentmodel.find({doctorid:doctor._id})
        .populate({
            path:"patientid",
            populate:{
                path:"patientid",
                select :"name email"
            }
        })
        .sort({date:1})
    }
    else if(req.user.role === "PATIENT"){
        const patient= await patientmodel.findOne({patientid:req.user.id})
        if(!patient){
            return res.status(404).json({message:"Patient not found"})
        }
        appointments = await appointmentmodel.find({patientid:patient._id})
        .populate({
            path:"doctorid",//doctor document
            select:"specialization experience fees",
            populate:{
                path:"doctorid",//user document
                select :"name email"
            }
        })
        .sort({date:1})
    }
    res.status(200).json({message:"Appointments fetched successfully",payload:appointments})
})

//ROUTE TO UPDATE APPOINTMENT STATUS
appointmentapp.put("/complete/:id",verifytoken("DOCTOR"),async(req,res)=>{
    
    const doctor = await doctormodel.findOne({doctorid:req.user.id})
    if(!doctor){
        return res.status(404).json({message:"doctor not found"})
    }
    const appointment= await appointmentmodel.findById(req.params.id)
    if(!appointment){
        return res.status(404).json({message:"Appointment not found"})
    }
  //to verify doctors own appointment
  if(appointment.doctorid.toString() !== doctor._id.toString()){
    return res.status(403).json({message:"You are not authorized"})
  }

    if(appointment.status === "completed"){
        return res.status(400).json({message:"Appointment already Completed"})
    }
    else if(appointment.status === "cancelled"){
        return res.status(400).json({message:"Cancelled appointment cannot be completed"})
    }
    appointment.status = "completed"
    await appointment.save()
    res.status(200).json({message:"Appointment Completed"})
})

//to update appointment status by PATIENT
appointmentapp.put("/cancel/:id",verifytoken("PATIENT"),async(req,res)=>{
    
    const patient = await patientmodel.findOne({patientid:req.user.id})
    if(!patient){
        return res.status(404).json({message:"patient not found"})
    }

    const appointment= await appointmentmodel.findById(req.params.id)
    if(!appointment){
        return res.status(404).json({message:"Appointment not found"})
    }

    //console.log(appointment.patientid.toString())
    //console.log(patient._id.toString())
  //to verify doctors own appointment
  if(appointment.patientid.toString() !== patient._id.toString()){
    return res.status(403).json({message:"You are not authorized"})
  }

   if(appointment.status === "cancelled"){
        return res.status(400).json({message:"Appointment already Cancelled"})
    }
    if(appointment.status === "completed"){
        return res.status(400).json({message:"completed appointment cannot be cancelled"})
    }

    appointment.status = "cancelled"
    await appointment.save()
    res.status(200).json({message:"Appointment Cancelled"})
})

