import {Schema,model} from "mongoose"
const doctorschema=new Schema({
    doctorid:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,"User Id is required"],
        unique:true
    },
    specialization:{
        type:String,
        default:""
    },
    experience:{
        type:Number,
        default:0
    },
    fees:{
        type:Number,
        default:0
    },
    availability:[
        {
            day:{
                type:String,
                enum:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            },
            slots:[
                {
                    type:String
            }
        ]
    }
    ]
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})

const doctormodel =model("Doctor",doctorschema)
export default doctormodel