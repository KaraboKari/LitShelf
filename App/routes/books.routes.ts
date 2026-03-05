import express from 'express'
import * as HandleBooks from '../controller/HandleBooks.controller.js'
import protectRoute from '../middleware/auth.middleware.js'

const router = express.Router()

router.post("/",protectRoute,HandleBooks.CreateBooks)
router.get("/",protectRoute,HandleBooks.GetBooks)
router.get("/user" , protectRoute,HandleBooks.GetRecommendedBooks)
router.delete("/:id",protectRoute,HandleBooks.DeleteBook)

export default router