// Import Zustand for state management
import { create } from "zustand";

// Import toast for showing error/success notifications
import { toast } from "react-hot-toast";

// Import the auth store to access the socket instance
import { useAuthStore } from "./useAuthStore";

// Import the pre-configured Axios instance for API calls
import { axiosInstance } from "../lib/axios";

// Create the chat store using Zustand
export const useChatStore = create((set, get) => ({
    // === STATE VARIABLES ===

    // All chat messages between the logged-in user and the selected user
    messages: [],

    // Currently selected user in the chat sidebar
    selectedUser: null,

    // List of all users available for chat
    users: [],

    // Loading state for fetching users
    isUsersLoading: false,

    // Loading state for fetching messages
    isMessagesLoading: false,

    // Loading state for profile pictures (optional usage)
    isPfpLoading: false,

    // === ACTIONS ===

    /**
     * Fetch all available users for chatting from the API
     */
    getUsers: async () => {
        // Set loading flags before fetching
        set({ isUsersLoading: true });
        set({ isPfpLoading: true });

        try {
            // Perform GET request to fetch users
            const response = await axiosInstance.get("/messages/users");

            // Update users in the store
            set({ users: response.data.users });
        } catch (error) {
            // Show error toast if the request fails
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            // Reset loading states
            set({ isUsersLoading: false });
            set({ isPfpLoading: false });
        }
    },

    /**
     * Fetch chat messages with a specific user
     * @param {string} id - The ID of the user to fetch messages from
     */
    getMessages: async (id) => {
        set({ isMessagesLoading: true }); // Start loading

        try {
            // GET request to fetch messages with selected user
            const response = await axiosInstance.get(`/messages/${id}`);

            // Update messages in store
            set({ messages: response.data.messages });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch messages");
        } finally {
            set({ isMessagesLoading: false }); // Stop loading
        }
    },

    /**
     * Send a message to the selected user
     * @param {Object} messageData - The message content to send
     */
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get(); // Get current user and messages

        try {
            // Send POST request to send the message
            const res = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,
                messageData
            );

            // Append the new message to the current messages list
            set({ messages: [...messages, res.data.message] });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
        } finally {
            // Reset loading state (optional)
            set({ isMessagesLoading: false });
        }
    },

    /**
     * Subscribe to real-time incoming messages via WebSocket
     */
    subscribeToNewMessage: () => {
        const { selectedUser } = get(); // Get selected user

        if (!selectedUser) return; // Do nothing if no user is selected

        const socket = useAuthStore.getState().socket; // Get socket instance from auth store

        // Listen for "newMessage" events from socket
        socket.on("newMessage", (newMessage) => {
            // Check if the incoming message is from the selected user
            const isMessageSentFromSelectedUser =
                newMessage.senderId._id === selectedUser._id;

            if (!isMessageSentFromSelectedUser) return;

            // Append the new message to messages list
            set({ messages: [...get().messages, newMessage] });
        });
    },

    /**
     * Unsubscribe from the "newMessage" socket event
     */
    unsubscribeFromNewMessage: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    /**
     * Set the selected user in chat (from sidebar)
     * @param {Object} selectedUser - The user object to set
     */
    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
