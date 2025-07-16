// Import necessary modules
import User from "../models/user.model.js"; // User model
import bcrypt from "bcryptjs"; // For hashing passwords
import { generateToken } from "../lib/utils.js"; // Utility to generate JWT tokens
import cloudinary from "../lib/cloudinarry.js"; // Cloudinary instance for image uploads

// =======================
// Handle user signup
// =======================
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    console.log("📥 Signup request received:", req.body);

    try {
        // Check if all required fields are present
        if (!fullName || !email || !password) {
            console.log("❌ Missing fields during signup");
            return res.status(400).json({
                status: "fail",
                message: "All fields are required",
            });
        }

        // Ensure password meets minimum length
        if (password.length < 8) {
            console.log("❌ Weak password");
            return res.status(400).json({
                status: "fail",
                message: "Password must be at least 8 characters long",
            });
        }

        // Check if the user already exists
        const user = await User.findOne({ email });
        if (user) {
            console.log("❌ User already exists:", email);
            return res.status(400).json({
                status: "fail",
                message: "User already exists",
            });
        }

        // Hash the user's password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            // Generate authentication token
            generateToken(newUser._id, res);

            // Save the new user to the database
            await newUser.save();

            console.log("✅ New user created:", newUser.email);

            // Send successful response with user data
            res.status(201).json({
                status: "success",
                message: "User created successfully",
                user: {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic,
                },
            });
        }

    } catch (err) {
        // Catch and return unexpected errors
        console.error("💥 Error during signup:", err.message);
        res.status(500).json({
            status: "fail",
            message: err.message,
        });
    }
};

// =======================
// Handle user login
// =======================
export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("📥 Login request received:", req.body);

    try {
        // Validate required fields
        if (!email || !password) {
            console.log("❌ Missing fields during login");
            return res.status(400).json({
                status: "fail",
                message: "All fields are required",
            });
        }

        // Ensure password meets minimum length
        if (password.length < 8) {
            console.log("❌ Weak password");
            return res.status(400).json({
                status: "fail",
                message: "Password must be at least 8 characters long",
            });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(400).json({
                status: "fail",
                message: "Invalid credentials",
            });
        }

        // Compare provided password with hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            console.log("❌ Incorrect password for user:", email);
            return res.status(400).json({
                status: "fail",
                message: "Invalid credentials",
            });
        }

        // Generate authentication token
        generateToken(user._id, res);
        console.log("✅ User logged in:", email);

        // Send successful login response
        res.status(200).json({
            status: "success",
            message: "Logged in successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            },
        });

    } catch (err) {
        console.error("💥 Error during login:", err.message);
        res.status(500).json({
            status: "fail",
            message: err.message,
        });
    }
};

// =======================
// Handle user logout
// =======================
export const logout = async (req, res) => {
    try {
        // Clear the JWT cookie
        res.cookie("jwt", "", { maxAge: 0 });
        console.log("🚪 User logged out");

        // Send success response
        res.status(200).json({
            status: "success",
            message: "Logged out successfully",
        });

    } catch (err) {
        console.error("💥 Error during logout:", err.message);
        res.status(500).json({
            status: "fail",
            message: err.message,
        });
    }
};

// =======================
// Update user's profile picture
// =======================
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;

        // Find the current user by ID
        const user = await User.findById(req.user._id);
        if (!user) {
            console.log("❌ User not found during profile update");
            return res.status(404).json({
                status: "fail",
                message: "User not found",
            });
        }

        // If no new profilePic provided, delete the old one if exists
        if (!profilePic) {
            console.log("🗑️ Profile picture is removed");
            if (user.profilePic === "") {
                return res.status(200).json({
                    status: "success",
                    message: "Profile picture is already removed",
                    user,
                });
            }
            if (user.profilePic) {
                // Extract public_id from the image URL
                const segments = user.profilePic.split("/");
                const lastSegment = segments[segments.length - 1];
                const [publicId] = lastSegment.split(".");

                // Delete image from Cloudinary
                await cloudinary.uploader.destroy(publicId);
                console.log(`🗑️ Deleted old image from Cloudinary: ${publicId}`);
            }

            // Remove profilePic field from user
            user.profilePic = "";
            await user.save();

            return res.status(200).json({
                status: "success",
                message: "Profile picture removed",
                user,
            });
        }

        // If new image provided, delete the old one first
        if (user.profilePic) {
            const segments = user.profilePic.split("/");
            const lastSegment = segments[segments.length - 1];
            const [publicId] = lastSegment.split(".");
            await cloudinary.uploader.destroy(publicId);
            console.log(`🗑️ Deleted old image from Cloudinary: ${publicId}`);
        }

        // Upload the new image to Cloudinary
        const uploadRes = await cloudinary.uploader.upload(profilePic, {
            folder: "user_avatars",
        });

        console.log("✅ Image uploaded to Cloudinary:", uploadRes.secure_url);

        // Update user with new image URL
        user.profilePic = uploadRes.secure_url;
        await user.save();

        console.log("✅ User profile updated:", user.email);

        return res.status(200).json({
            status: "success",
            message: "Profile updated successfully",
            user,
        });

    } catch (err) {
        console.error("💥 Error during profile update:", err.message);
        return res.status(500).json({
            status: "fail",
            message: err.message,
        });
    }
};

// =======================
// Get all users (admin use)
// =======================
export const getUsers = async (req, res) => {
    try {
        // Get all users, excluding __v field
        const users = await User.find().select("-__v");
        console.log(`📄 Retrieved ${users.length} users`);

        // Send users in response
        res.status(200).json({
            status: "success",
            users,
        });

    } catch (err) {
        console.error("💥 Error fetching users:", err.message);
        res.status(500).json({
            status: "fail",
            message: err.message,
        });
    }
};

// =======================
// Check if user is authenticated
// =======================
export const checkAuth = async (req, res) => {
    try {
        // req.user should be set by middleware
        if (!req.user) {
            console.log("❌ Unauthorized access");
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized",
            });
        }

        console.log("✅ Authenticated user:", req.user.email || req.user._id);

        // Return authenticated user
        res.status(200).json({
            status: "success",
            user: req.user,
        });

    } catch (err) {
        console.error("💥 Error checking auth:", err.message);
        res.status(500).json({
            status: "fail",
            message: err.message,
        });
    }
};
