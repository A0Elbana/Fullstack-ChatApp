// Import jsonwebtoken library
import jwt from "jsonwebtoken";
// Import User model
import User from "../models/user.model.js";

// Middleware to protect routes and verify user authentication
export const protectRoute = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.jwt;
        console.log("JWT from cookies:", token);

        // If no token found, return unauthorized
        if (!token) {
            console.log("No token found in cookies");
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized"
            });
        }

        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("Decoded token:", decoded);

        // If decoding fails, return unauthorized
        if (!decoded) {
            console.log("Token could not be decoded");
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized"
            });
        }

        // Find the user by ID and exclude password and __v fields
        const user = await User.findById(decoded.userId).select("-__v -password");
        console.log("User found from decoded token:", user);

        // If user not found, return unauthorized
        if (!user) {
            console.log("No user found with ID:", decoded.userId);
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized"
            });
        }

        // Attach the user object to the request
        req.user = user;
        console.log("User attached to request:", req.user);

        // Proceed to the next middleware or route handler
        next();

    } catch (err) {
        console.log("Error in protectRoute middleware:", err);

        if (err.name === "TokenExpiredError") {
            console.log("Token has expired");
            return res.status(401).json({ status: "fail", message: "Token expired" });
        }

        res.status(500).json({ status: "fail", message: err.message });
    }
};
