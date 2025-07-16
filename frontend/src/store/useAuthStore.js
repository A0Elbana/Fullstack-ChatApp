import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

// Create the auth store using Zustand
export const useAuthStore = create((set) => ({
    // ----- Initial state -----
    authUser: null,              // Stores the authenticated user object
    isSigningUp: false,          // Indicates if the signup process is ongoing
    isLoggingIn: false,          // Indicates if the login process is ongoing
    isUpdatingProfile: false,    // Indicates if profile update is ongoing
    isCheckingAuth: true,        // Indicates if auth check is in progress
    onlineUsers: [],             // Stores the list of online users
    socket: null,

    // ----- Check if user is already authenticated -----
    checkAuth: async () => {
        console.log("[checkAuth] Starting auth check...");
        try {
            const res = await axiosInstance.get("/auth/check");
            console.log("[checkAuth] Authenticated user:", res.data.user);
            set({ authUser: res.data.user });  // Set authenticated user
        } catch (error) {
            console.error("[checkAuth] Failed to check auth:", error?.response?.data || error.message);
            set({ authUser: null });  // Clear user on failure
        } finally {
            console.log("[checkAuth] Finished auth check");
            set({ isCheckingAuth: false });  // Mark auth check as completed
        }
    },

    // ----- Register a new user -----
    signup: async (data) => {
        set({ isSigningUp: true });  // Set signing up state
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            toast.success("Account created successfully");
            set({ authUser: res.data.user });  // Store the new user
        } catch (error) {
            console.error("[signup] Failed to signup:", error?.response?.data || error.message);
            toast.error(error?.response.data.message);  // Show error message
        } finally {
            set({ isSigningUp: false });  // Reset signing up state
        }
    },

    // ----- Log in an existing user -----
    login: async (data) => {
        set({ isLoggingIn: true });  // Set logging in state
        try {
            const res = await axiosInstance.post("/auth/login", data);
            toast.success("Logged in successfully");
            set({ authUser: res.data.user });  // Store logged in user

        } catch (error) {
            console.error("[login] Failed to login:", error?.response?.data || error.message);
            toast.error(error?.response.data.message);  // Show error message
        } finally {
            set({ isLoggingIn: false });  // Reset logging in state
        }
    },

    // ----- Log out the user -----
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            toast.success("Logged out successfully");
            set({ authUser: null });  // Clear user state
        } catch (error) {
            console.error("[logout] Failed to logout:", error?.response?.data || error.message);
            toast.error("Failed to logout");
        }
    },

    // ----- Update user's profile -----
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });  // Set updating profile state
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data.user });  // Update user data
            toast.success(res.data.message);  // Show success message
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);  // Show error message
        } finally {
            set({ isUpdatingProfile: false });  // Reset updating state
        }
    },

}));
