import {Schema,model} from "mongoose"
const userschema =new Schema({
    name:{
        type:String,
        required:[true,"Name is Required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email already Exists"]
    },
    password:{
        type:String,
        required:[true,"Enter password"]
    },
    role:{
        type:String,
        enum:["PATIENT","DOCTOR","ADMIN"],
        required:[true,"Select a Role"]
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})
const usermodel =model("User",userschema)
export default usermodel;