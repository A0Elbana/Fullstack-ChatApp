// ───────────────────────────────────────────────────────────────
// Imports
// ───────────────────────────────────────────────────────────────

import User from "../models/user.model.js";              // Import the User Mongoose model
import Message from "../models/message.model.js";        // Import the Message Mongoose model
import cloudinary from "../lib/cloudinarry.js";          // Cloudinary instance to handle image uploads
import { getReceiverSocketId, io } from "../lib/socket.js"; // Functions and socket instance for real-time messaging

// ───────────────────────────────────────────────────────────────
// Controller: Fetch all users except the currently logged-in user
// ───────────────────────────────────────────────────────────────

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Extract the current user's ID from the authenticated request

        console.log("📥 Fetching users for sidebar...");
        console.log("➡️ Logged in user ID:", loggedInUserId);

        // Fetch users from DB, exclude the current user and remove sensitive fields
        const filterUsers = await User.find({ _id: { $ne: loggedInUserId } })
            .select("-password -__v"); // Exclude password and version fields

        console.log("✅ Users fetched:", filterUsers.length);

        // Respond with the list of users
        res.status(200).json({
            status: "success",
            users: filterUsers
        });
    } catch (error) {
        console.error("❌ Error fetching users:", error.message);

        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};

// ───────────────────────────────────────────────────────────────
// Controller: Get all messages between the current user and another user
// ───────────────────────────────────────────────────────────────

export const getMessages = async (req, res) => {
    try {
        const { id: receiverId } = req.params; // Receiver user ID from route params
        const senderId = req.user._id;         // Current logged-in user ID

        console.log("📥 Fetching messages...");
        console.log("➡️ Sender ID:", senderId);
        console.log("➡️ Receiver ID:", receiverId);

        // Find messages exchanged in both directions between sender and receiver
        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        });

        console.log(`✅ Fetched ${messages.length} messages`);

        // Return the messages to the frontend
        res.status(200).json({
            status: "success",
            messages
        });
    } catch (error) {
        console.error("❌ Error fetching messages:", error.message);

        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};

// ───────────────────────────────────────────────────────────────
// Controller: Send a new message (with optional image)
// ───────────────────────────────────────────────────────────────

export const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params; // Extract receiver's ID from route params
        const senderId = req.user._id;         // Extract sender's ID from authenticated request
        const { text, image } = req.body;      // Extract text and image from the request body

        console.log("📤 Sending message...");
        console.log("➡️ Sender:", senderId);
        console.log("➡️ Receiver:", receiverId);
        console.log("📝 Text:", text || "No text");
        console.log("🖼️ Image:", image ? "Image included" : "No image");

        // Validation: Prevent sending empty messages
        if (!text && !image) {
            console.warn("⚠️ Empty message rejected");
            return res.status(400).json({
                status: "fail",
                message: "Message must contain either text or image"
            });
        }

        let imageUrl; // Will store image URL if an image is uploaded

        // If image is included, upload it to Cloudinary
        if (image) {
            console.log("☁️ Uploading image to Cloudinary...");
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
            console.log("✅ Image uploaded:", imageUrl);
        }

        // Create a new message document
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl // Save image URL if uploaded
        });

        // Save the message to MongoDB
        await newMessage.save();

        console.log("✅ Message saved:", newMessage._id);

        // If the receiver is online (has an active socket), emit the new message in real-time
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        // Send a success response to the sender
        res.status(201).json({
            status: "success",
            message: newMessage
        });
    } catch (error) {
        console.error("❌ Error sending message:", error.message);

        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};
