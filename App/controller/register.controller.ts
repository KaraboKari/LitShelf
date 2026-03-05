import type { Response , Request } from "express";
import User from '../models/User.models.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
export const handleNewUser = async(req:Request , res: Response) => {
    try{
        const {email , username , password} = req.body
        if(!username || !email || !password) return res.status(400).json({message:"All fields are required"})
        if(password.length < 6)return res.status(400).json({message: "Passsword should be at least 6 characters long"})
        if(username.length < 3)return res.status(400).json({message: "Username should be at least 3 characters long"})
        const existingEmail = await User.findOne({email})
        const existingUser = await User.findOne({username})
        if(existingUser)return res.status(400).json({message: "User already exists"})
        if(existingEmail)return res.status(400).json({message: "Email already exists"})

            const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`
        const user = new User({
             email,
             username,
             password,
             profileImage

        })
        await user.save()

        const token = generateToken(user.id)
        res.status(201).json({token,user:{
            id: user._id,
            username: user.username ,
            email: user.email ,
            profileImage: user.profileImage
        }})

    }catch(err){
        console.log("Error in the register controller: ", err)
        res.status(500).json({message: "Internal server error"})
    }
}
const generateToken = (userId:number | string) =>{
    return jwt.sign(
        {userId},
        process.env.JWT_SECRET as string, 
        {expiresIn: "15d"}
    )
}