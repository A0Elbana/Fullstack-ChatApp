import User from "../models/user.model.js"; // Import the User model
import Message from "../models/message.model.js"; // Import the Message model
import cloudinary from "../lib/cloudinarry.js"; // Import the configured Cloudinary uploader

// ───────────────────────────────────────────────────────────────

// Get all users except the logged-in user
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Get logged-in user's ID from the request

        console.log("📥 Fetching users for sidebar...");
        console.log("➡️ Logged in user ID:", loggedInUserId);

        // Fetch all users except the logged-in one and exclude password and __v
        const filterUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password -__v");

        console.log("✅ Users fetched:", filterUsers.length); // Log the number of users found

        // Send successful response with users
        res.status(200).json({
            status: "success",
            users: filterUsers
        });
    } catch (error) {
        console.error("❌ Error fetching users:", error.message); // Log error if fetching fails
        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};

// ───────────────────────────────────────────────────────────────

// Get all messages between the logged-in user and a specific user
export const getMessages = async (req, res) => {
    try {
        const { id: receiverId } = req.params; // Get receiver ID from URL params
        const senderId = req.user._id; // Get sender (logged-in user) ID

        console.log("📥 Fetching messages...");
        console.log("➡️ Sender ID:", senderId);
        console.log("➡️ Receiver ID:", receiverId);

        // Find all messages between the two users
        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId }, // Messages sent by sender to receiver
                { senderId: receiverId, receiverId: senderId }  // Messages sent by receiver to sender
            ]
        });

        console.log(`✅ Fetched ${messages.length} messages`); // Log total messages fetched

        // Return success with all messages
        res.status(200).json({
            status: "success",
            messages
        });
    } catch (error) {
        console.error("❌ Error fetching messages:", error.message); // Log error if query fails
        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};

// ───────────────────────────────────────────────────────────────

// Send a new message
export const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params; // Get receiver ID from URL params
        const senderId = req.user._id; // Get sender (logged-in user) ID
        const { text, image } = req.body; // Extract text and image from request body

        console.log("📤 Sending message...");
        console.log("➡️ Sender:", senderId);
        console.log("➡️ Receiver:", receiverId);
        console.log("📝 Text:", text || "No text");
        console.log("🖼️ Image:", image ? "Image included" : "No image");

        // Check if message is empty (no text and no image)
        if (!text && !image) {
            console.warn("⚠️ Empty message rejected");
            return res.status(400).json({
                status: "fail",
                message: "Message must contain either text or image",
            });
        }

        let imageUrl; // Variable to hold uploaded image URL if any

        // If image is present, upload it to Cloudinary
        if (image) {
            console.log("☁️ Uploading image to Cloudinary...");
            const uploadResponse = await cloudinary.uploader.upload(image); // Upload image
            imageUrl = uploadResponse.secure_url; // Get secure URL
            console.log("✅ Image uploaded:", imageUrl); // Log the image URL
        }

        // Create a new message document
        const newMessage = new Message({
            senderId,       // Sender user ID
            receiverId,     // Receiver user ID
            text,           // Text content
            image: imageUrl // Image URL if uploaded
        });

        await newMessage.save(); // Save message to database

        console.log("✅ Message saved:", newMessage._id); // Log message ID

        // Send response with created message
        res.status(201).json({
            status: "success",
            message: newMessage
        });
    } catch (error) {
        console.error("❌ Error sending message:", error.message); // Log error if fails
        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};
