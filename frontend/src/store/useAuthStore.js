// Importing necessary libraries
import { create } from "zustand";                        // Zustand for state management
import { axiosInstance } from "../lib/axios.js";         // Axios instance for API requests
import toast from "react-hot-toast";                     // Toast notifications
import { io } from "socket.io-client";                   // Socket.io client for real-time communication

// Backend server base URL
const BACKEND_URL = "http://localhost:1502";

// Zustand store definition for authentication logic
export const useAuthStore = create((set, get) => ({

    // ---------- Initial State ----------
    authUser: null,              // Stores the authenticated user data
    isSigningUp: false,          // Tracks if the signup process is ongoing
    isLoggingIn: false,          // Tracks if the login process is ongoing
    isUpdatingProfile: false,    // Tracks if the user is updating their profile
    isCheckingAuth: true,        // Tracks if we're checking whether the user is already logged in
    onlineUsers: [],             // List of online user IDs received from socket
    socket: null,                // Socket.io connection instance

    // ---------- Check if user is authenticated ----------
    checkAuth: async () => {
        console.log("[checkAuth] Starting auth check...");
        try {
            // Send GET request to backend to check auth status
            const res = await axiosInstance.get("/auth/check");

            // If successful, store the user data and connect the socket
            console.log("[checkAuth] Authenticated user:", res.data.user);
            set({ authUser: res.data.user });
            get().connectSocket();

        } catch (error) {
            // Log error and reset user state if auth check fails
            console.error("[checkAuth] Failed to check auth:", error?.response?.data || error.message);
            set({ authUser: null });
        } finally {
            // Mark auth check as completed
            console.log("[checkAuth] Finished auth check");
            set({ isCheckingAuth: false });
        }
    },

    // ---------- Signup Function ----------
    signup: async (data) => {
        set({ isSigningUp: true }); // Start signup process

        try {
            // Send signup request with user data
            const res = await axiosInstance.post("/auth/signup", data);

            // Show success message and store user
            toast.success("Account created successfully");
            set({ authUser: res.data.user });

            // Connect socket after signup
            get().connectSocket();

        } catch (error) {
            // Log and show error if signup fails
            console.error("[signup] Failed to signup:", error?.response?.data || error.message);
            toast.error(error?.response.data.message);
        } finally {
            // Stop signup loader
            set({ isSigningUp: false });
        }
    },

    // ---------- Login Function ----------
    login: async (data) => {
        set({ isLoggingIn: true }); // Start login process

        try {
            // Send login request with user credentials
            const res = await axiosInstance.post("/auth/login", data);

            // Show success toast and store user
            toast.success("Logged in successfully");
            set({ authUser: res.data.user });

            // Connect to socket after login
            get().connectSocket();

        } catch (error) {
            // Log and show login error
            console.error("[login] Failed to login:", error?.response?.data || error.message);
            toast.error(error?.response.data.message);
        } finally {
            // Stop login loader
            set({ isLoggingIn: false });
        }
    },

    // ---------- Logout Function ----------
    logout: async () => {
        try {
            // Send logout request to backend
            await axiosInstance.post("/auth/logout");

            // Show success message and clear user data
            toast.success("Logged out successfully");
            set({ authUser: null });

            // Disconnect from socket
            get().disconnectSocket();

        } catch (error) {
            // Handle logout failure
            console.error("[logout] Failed to logout:", error?.response?.data || error.message);
            toast.error("Failed to logout");
        }
    },

    // ---------- Update Profile Function ----------
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true }); // Start profile update

        try {
            // Send PUT request to update user profile
            const res = await axiosInstance.put("/auth/update-profile", data);

            // Update user state with new profile data
            set({ authUser: res.data.user });

            // Show success message
            toast.success(res.data.message);

        } catch (error) {
            // Handle update error
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);
        } finally {
            // End profile update loader
            set({ isUpdatingProfile: false });
        }
    },

    // ---------- Connect to Socket Server ----------
    connectSocket: () => {
        const { authUser } = get(); // Get current user

        // Prevent connection if no user or already connected
        if (!authUser || get().socket?.connected) return;

        // Create a new socket instance with userId as query param
        const socket = io(BACKEND_URL, {
            query: {
                userId: authUser._id
            }
        });

        // Initiate socket connection
        socket.connect();

        // Store socket instance in Zustand state
        set({ socket });

        // Listen for online users from server
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    // ---------- Disconnect from Socket Server ----------
    disconnectSocket: () => {
        // If socket exists and connected, disconnect
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
    }

}));
