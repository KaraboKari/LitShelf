import express from 'express'
import { handleNewUser } from '../controller/register.controller.js'
import { handleLogin } from '../controller/auth.controller.js'


const router = express.Router()

router.post("/register", handleNewUser) 
router.post("/login", handleLogin)

export default router