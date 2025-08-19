import express from 'express'
import { askToAssistant, getCurrentUser, updateAssistant } from '../controllers/userController.js'
import { isAuth } from '../middleware/isAuth.js';
import upload from '../config/multer.js';

const userRouter = express.Router()

// route to get users
userRouter.get('/current', isAuth, getCurrentUser)

// route to update assistant
userRouter.post('/update', isAuth, upload.single('assistantImage'), updateAssistant)

// route for ask to assistant
userRouter.post('/ask', isAuth, askToAssistant)

export default userRouter;