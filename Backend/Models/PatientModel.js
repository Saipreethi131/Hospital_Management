import {Schema,model} from "mongoose"
const patientschema =new Schema({
    patientid:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    age:{
        type:Number,
        required:true
    },
    medicalhistory:[
        {
            category:{
                type:String,
                enum:["disease","allergy","surgery","medication"],
                required:true
            },
            condition:{
                type:String,
                required:true
            },
            diagnoseddate:{
                type:Date,
                required:true
            },
            status:{
                type:String,
                enum:["ongoing","recovered"],
                required:true
            },
            notes:{
                type:String
            }
        }
    ]
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})
const patientmodel=model("Patient",patientschema)
export default patientmodel