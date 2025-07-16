// Import Zustand for state management
import { create } from "zustand";

// Import toast for showing error/success messages
import { toast } from "react-hot-toast";

// Import a pre-configured Axios instance for API requests
import { axiosInstance } from "../lib/axios";

// Create a Zustand store for chat-related state and actions
export const useChatStore = create((set, get) => ({
    // Holds all fetched chat messages
    messages: [],

    // Currently selected user in the chat
    selectedUser: null,

    // List of users available for chatting
    users: [],

    // Indicates if users are being loaded from the API
    isUsersLoading: false,

    // Indicates if messages are being loaded from the API
    isMessagesLoading: false,

    isPfpLoading: false,

    /**
     * Fetch all available users for chatting
     */
    getUsers: async () => {
        set({ isUsersLoading: true }); // Start loading state
        set({ isPfpLoading: true });
        try {
            const response = await axiosInstance.get("/messages/users");

            // Save users to store
            set({ users: response.data.users });
        } catch (error) {
            // Show error toast if request fails
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            // Stop loading state
            set({ isUsersLoading: false });
            set({ isPfpLoading: false });
        }
    },

    /**
     * Fetch chat messages with a specific user by ID
     * @param {string} id - ID of the user to fetch messages with
     */
    getMessages: async (id) => {
        set({ isMessagesLoading: true }); // Start loading state

        try {
            const response = await axiosInstance.get(`/messages/${id}`);

            // Save messages to store
            set({ messages: response.data.messages });
        } catch (error) {
            // Show error toast if request fails
            toast.error(error.response?.data?.message || "Failed to fetch messages");
        } finally {
            // Stop loading state
            set({ isMessagesLoading: false });
        }
    },

    /**
     * Send a message to the selected user
     * @param {Object} messageData - Message body to be sent
     */
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

            // Append the new message to current messages
            set({ messages: [...messages, res.data.message] });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
        } finally {
            // Optionally reset loading state here
            set({ isMessagesLoading: false });
        }
    },

    /**
     * Update the currently selected user in chat
     * @param {Object} selectedUser - The user object to set as selected
     */
    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
