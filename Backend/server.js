import exp from "express"
import {config} from "dotenv"
import {connect} from "mongoose"
import CookieParser from "cookie-parser"

config()
const app=exp()
app.use(exp.json())
app.use(CookieParser())
const connectDB = async()=>{
    try{
        await connect(process.env.DB_URL)
        console.log("Database Connected")
        const port=process.env.port
        app.listen(port,()=>console.log(`server listening on ${port}...`))

    }
    catch(err)
    {
        console.log("error in db connect")
    }
}
connectDB();