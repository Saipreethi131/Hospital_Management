import {Schema,model} from "mongoose"
const prescriptionschema =new Schema ({
    appointmentid:{
        type:Schema.Types.ObjectId,
        ref:"Appointment",
        required:true,
        unique:true
    },
    medicines:[
        {
            name:{
                type:String,
                required:true
            },
            dosage:{
                type:String,
                required:true
            },
            duration:{
                type:String,
                required:true
            }
        }
    ],
    notes:{
        type:String
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})

const prescriptionmodel =model("Prescription",prescriptionschema)
export default prescriptionmodel