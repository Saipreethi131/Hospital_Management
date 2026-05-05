import {Schema,model} from "mongoose"
const doctorschema=new Schema({
    userid:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,"User Id is required"],
        unique:true
    },
    specialization:{
        type:String,
        required:true
    },
    experience:{
        type:Number,
        required:true
    },
    fees:{
        type:Number,
        required:true
    },
    availability:[
        {
            day:{
                type:String,
                enum:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
                required:true
            },
            slots:[
                {
                    type:String,
                    required:true
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