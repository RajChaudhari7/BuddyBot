import genToken from "../config/token.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';

//register user
export const signUp = async (req, res) => {
    try {

        const { name, email, password } = req.body;
        // Validate input
        if (!name || !email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        // password length greater than 6
        if (password.length < 6) {
            return res.json({ success: false, message: "Password must be at least 6 characters long" });
        }

        // password hash
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        })

        // Generate token
        const token = await genToken(user._id);


        // pass token in cookie parser
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // Use secure cookies in production
            maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
            sameSite: "none" // Prevent CSRF attacks
        });

        // Return success response
        res.json({ success: true, message: "User created successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: "Invalid password" });
        }

        // Generate token
        const token = await genToken(user._id);

        // pass token in cookie parser
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // Use secure cookies in production
            maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
            sameSite: "none" // Prevent CSRF attacks
        });

        // Return success response
        res.json({ success: true, message: "Login successful" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// logout user
export const logout = async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token')

        // Return success response
        res.json({ success: true, message: "Logout successful" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}