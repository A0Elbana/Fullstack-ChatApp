// Import jsonwebtoken library
import jwt from "jsonwebtoken";

// Function to generate JWT token and store it in cookies
export const generateToken = (userId, res) => {
    // Create a signed token with the user ID and secret key, expires in 7 days
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d"
    });

    // Store the token in an HTTP-only cookie with security options
    res.cookie("jwt", token, {
        // Cookie expires in 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days availabelity
        httpOnly: true, // Can't be accessed by JavaScript
        secure: process.env.NODE_ENV !== "development", // Only send over HTTPS in production
        sameSite: "strict", // Prevent CSRF by only sending cookie to same-site requests
    });
};
