import express from 'express';
import { login, logout, signUp } from '../controllers/authController.js';


const authRouter = express.Router();

// Route to register a new user
authRouter.post('/signup', signUp)

// Route to login a user
authRouter.post('/login', login)

// Route to logout a user
authRouter.get('/logout', logout)



export default authRouter;