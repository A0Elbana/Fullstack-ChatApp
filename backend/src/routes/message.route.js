import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    getUsersForSidebar,
    getMessages,
    sendMessage
} from "../controllers/message.controller.js";

const router = express.Router();

// Get all users for sidebar (excluding current user)
router.get("/users", protectRoute, getUsersForSidebar);

// Send message to a specific user
router.post("/send/:id", protectRoute, sendMessage);

// Get messages between current user and user with :id
router.get("/:id", protectRoute, getMessages);

export default router;
