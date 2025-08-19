import jwt from 'jsonwebtoken'

export const isAuth = async (req, res, next) => {
    try {

        const token = req.cookies.token

        if (!token) {
            return res.json({ success: false, message: 'Not Authenticated' })
        }

        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET)

        req.userId = verifyToken.userId

        next()

    } catch (error) {
        console.log(error); 
        res.json({ success: false, message: error.message })
    }
} 