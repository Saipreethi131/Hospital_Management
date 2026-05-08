import {Schema,model} from "mongoose"
const patientschema =new Schema({
    patientid:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    age:{
        type:Number
    },
    medicalhistory:[
        {
            category:{
                type:String,
                enum:["disease","allergy","surgery","medication"],
                
            },
            condition:{
                type:String
                
            },
            diagnoseddate:{
                type:Date
            },
            status:{
                type:String,
                enum:["ongoing","recovered"]
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