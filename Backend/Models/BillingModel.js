import {schema,model} from "mongoose"
const billingschema =new Schema({
    appointmentid:{
        type:Schema.Types.ObjectId,
        ref:"Appointment",
        required:true,
        unique:true
    },
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["paid","unpaid"],
        default:"unpaid"
    },
    paymentmethod:{
        type:String,
        enum:["cash","UPI","card"]
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})

const billingmodel =model("Billing",billingschema)
export default billingmodel