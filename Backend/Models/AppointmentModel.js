import {Schema,model} from "mongoose"
const appointmentschema= new Schema({
    patientid:{
        type:Schema.Types.ObjectId,
        ref:"Patient",
        required:true
    },
    doctorid:{
        type:Schema.Types.ObjectId,
        ref:"Doctor",
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["booked","completed","cancelled"]
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})

const appointmentmodel = model("Appointment",appointmentschema)
export default appointmentmodel