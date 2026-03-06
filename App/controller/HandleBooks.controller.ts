import type { Response , Request } from "express";
import Book from '../models/Book.models.js'
import dotenv from 'dotenv'
import cloudinary from '../lib/cloudinary.js'

declare module 'express-serve-static-core' {
  interface Request {
    user?: any; // Replace `any` with your user type
  }
}
dotenv.config()
export const CreateBooks= async(req:Request , res: Response) => {
    try{
        
        const {title , caption , rating , image} = req.body;
        if(!title||!caption||!rating||!image)return res.status(400).json({message:"Please provide an image"})
        //upload the img to cloudinary and returns the url
        const uploadResponse = await cloudinary.uploader.upload(image)
        const imageUrl = uploadResponse.secure_url 
        
        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user._id
        })
        await newBook.save()
        
        res.status(201).json(newBook)
    }catch(err){
        console.log("Error creating book" , err)
        res.status(500).json({message: "Unable to create abook  " + err})
    }
}

export const GetBooks = async(req:Request , res: Response) => {
    try{
        const page = req.query.page as string || "1"
        const limit = req.query.limit as string || "5"
        const skip = (parseInt(page) - 1) * parseInt(limit) 
        const books = await Book.find().sort({createdAt: -1}).skip(skip).limit(parseInt(limit)).populate("user", "username profileImage")//descending order => latest book will be on top
        const totalBooks = await Book.countDocuments()
        res.send({ books, currentPage: parseInt(page), totalBooks, totalPages: Math.ceil(totalBooks / parseInt(limit)) })
        //pagination => infinite scroll 
    }catch(err){
        console.log("Error fetching books" , err)
        res.status(500).json({message: "Unable to fetch books"})
    }
}
export const DeleteBook = async(req:Request , res: Response) => {
    try{
        const book = await Book.findById(req.params.id)
        if(!book)return res.status(404).json({message: "Book not found"})
        
        if(book.user.toString() !== req.user._id.toString()) return res.status(403).json({message: "You are not authorized to delete this book"})
        //delete the image from cloudinary
        if(book.image && book.image.includes('cloudinary.com')){
            try{

                const publicId = book.image.split('/').slice(-1)[0]?.split('.')[0]
                if(!publicId) return res.status(400).json({message: "Invalid image URL"})
                await cloudinary.uploader.destroy(publicId) // Delete the image from Cloudinary
            }catch(err){
                console.log("Error deleting image from cloudinary" , err)
            }
        }
        
        await book.deleteOne()
        res.status(200).json({message: "Book deleted successfully"})
    }catch(err){
        console.log("Error deleting book" , err)
        res.status(500).json({message: "Unable to delete book"})
    }
}
export const GetRecommendedBooks = async(req:Request , res: Response) => {
    try{
        const userBooks = await Book.find({user: req.user._id}).sort({createdAt: -1})
        res.status(200).json(userBooks)
    }catch(err){
        console.log("Error fetching recommended books" , err)
        res.status(500).json({message: "Unable to fetch recommended books"})
    }
}