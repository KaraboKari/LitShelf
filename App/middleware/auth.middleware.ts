import jwt from 'jsonwebtoken'
import User from '../models/User.models.js'
import type { Request , Response , NextFunction } from 'express'
import type { JwtPayload } from 'jsonwebtoken'



const protectRoute = async(req: Request , res: Response , next: NextFunction) => {
    try{
        //get token 
        const authHeader = req.headers.authorization || req.headers.authorization as string
        //Checks if header existes and starts with "Bearer"
        if(!authHeader?.startsWith('Bearer '))return res.status(401).json({message: "No authentication token , access denied"})//Unauthorized
        console.log("grabbing the Bearer ... :",authHeader)
        const token = authHeader.split(' ')[1]
        //verify the token
        jwt.verify(token as string, process.env.JWT_SECRET as string, async(err, decoded) => {
            if(err) return res.status(401).json({message: "Invalid token , access denied"})
            
            const userId = (decoded as JwtPayload).userId
            if(!userId) return res.status(401).json({message: "Invalid token , access denied"})
            console.log("Decoded user ID from token:", userId)
            req.user = userId
            next()
        })
    }catch(err){
        console.error('Error verifying token:', err);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}

export default protectRoute