import exp from "express"
import {config} from "dotenv"
import {connect} from "mongoose"
import CookieParser from "cookie-parser"
import {authapp} from './APIs/AuthApi.js'
import {doctorapp} from './APIs/DoctorApi.js'
import {patientapp} from './APIs/PatientApi.js'
import {appointmentapp} from './APIs/AppointmentApi.js'
import { prescriptionapp } from "./APIs/PrescriptionApi.js"
import { billingapp } from "./APIs/BillingApi.js"


config()
const app=exp()
app.use(exp.json())
app.use(CookieParser())
app.use('/auth-api',authapp)
app.use('/doctor-api',doctorapp)
app.use('/patient-api',patientapp)
app.use('/appointment-api',appointmentapp)
app.use('/prescription-api',prescriptionapp)
app.use('/billing-api',billingapp)

const connectDB = async()=>{
    try{
        await connect(process.env.DB_URL)
        console.log("Database Connected")
        const port=process.env.PORT
        app.listen(port,()=>console.log(`server listening on ${port}...`))

    }
    catch(err)
    {
        console.log("error in db connect")
    }
}
connectDB();

//******** ERROR HANDLING MIDDLEWARE*******/
//to handle invalid path
app.use((req,res,next)=>{
    res.status(404).json({message:`path ${req.url} is invalid`}) 
})
//to handle errors
app.use((err,req,res,next)=>{
    
    console.log(err.name)
    if(err.name==="ValidationError")
    {
       return res.status(400).json({message:"validation error",error:err.message})
    }
    if(err.name==="CastError")//Invalid ObjectID or wrong type
    {
       return res.status(400).json({message:"cast error",error:err.message})
    }
    //server side errors
    res.status(500).json({message:"Server side errors",error:err.message})
  
})


