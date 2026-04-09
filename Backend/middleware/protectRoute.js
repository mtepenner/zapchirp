import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({error: "Unauthorized - No Token Provided"});
        }

        let decoded;
        try {
            // jwt.verify throws an error if the token is expired or invalid
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            // Safely catch the JWT error and return a proper 401 response
            return res.status(401).json({error: "Unauthorized - Invalid or Expired Token"});
        }

        // Ensure the payload actually contains the userId
        if (!decoded || !decoded.userId) {
            return res.status(401).json({error: "Unauthorized - Invalid Token Payload"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({error: "User not found"});
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({error: "Internal server error."});
    }
}

export default protectRoute;
