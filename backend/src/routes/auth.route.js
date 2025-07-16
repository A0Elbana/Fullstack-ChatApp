// Import Express framework
import express from "express";

// Import authentication controllers
import {
    signup,
    login,
    logout,
    getUsers,
    updateProfile,
    checkAuth
} from "../controllers/auth.controller.js";

// Import middleware to protect routes
import { protectRoute } from "../middleware/auth.middleware.js";
import { authRateLimiter } from "../middleware/rateLimiter.middleware.js";

// Create a new router instance
const router = express.Router();

// Route to get all users (⚠️ for testing only – remember to delete later)
if (process.env?.NODE_ENV === "development") {
    router.route("/").get(getUsers);
}

// Route to update user profile (protected)
router.route("/update-profile").put(protectRoute, updateProfile);

// Route for user signup
router.route("/signup").post(authRateLimiter, signup);

// Route for user login
router.route("/login").post(authRateLimiter, login);

// Route for user logout
router.route("/logout").post(logout);

// Route to check if user is authenticated
router.route("/check").get(protectRoute, checkAuth)

// Export the router
export default router;
