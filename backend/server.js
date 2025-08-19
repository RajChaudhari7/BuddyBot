import express from 'express';
import 'dotenv/config';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import userRouter from './routes/userRoutes.js';
import connectCloudinary from './config/cloudinary.js';

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();
await connectCloudinary();

app.use(cors({
    origin: ['http://localhost:5173', 'https://buddy-bot-zeta.vercel.app'],
    credentials: true
}))

app.get('/', (req, res) => { res.send('Api is running'); })
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
