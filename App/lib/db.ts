import mongoose from "mongoose";
import dotenv from 'dotenv'
import { error } from "node:console";

dotenv.config()

export const connectDB = async() => {
    try{
        if(!process.env.MONGO_URI) throw new Error("Failed to load the MONGO_URI")
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database connected ${conn.connection.host}`)
    }catch(err){
        console.log("ERROR connecting to database: " , err)
        process.exit(1)
    }
}