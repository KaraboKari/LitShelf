import type { Response , Request } from "express";
import User from '../models/User.models.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
export const handleLogin = async(req:Request , res: Response) => {
    try{
        const {email ,password} = req.body
        if(!email || !password) return res.status(400).json({message:"All fields are required"})
        const user = await User.findOne({email})
        if(!user)return res.status(400).json({message: "Invalid credentials"})
        const isPassswordCorrect = await user.comparePassword(password)
        if(!isPassswordCorrect) return res.status(400).json({message:"Invalid credentials"})
        
        const token = generateToken(String(user._id))
         res.status(201).json({token,user:{
            id: user._id,
            username: user.username ,
            email: user.email ,
            profileImage: user.profileImage
        }})
        
    }catch(err){
        console.log("Error in the auth controller: ", err)
        res.status(500).json({message: "Internal server error"})
    }
}
const generateToken = (userId:number | string) =>{
    return jwt.sign({userId},process.env.JWT_SECRET as string, {expiresIn: "15d"})
}