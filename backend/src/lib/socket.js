// --------------------------- IMPORTS ---------------------------

// Import the Express framework to create the server
import express from "express";

// Import Node's HTTP module to create the HTTP server
import http from "http";

// Import Socket.IO to enable real-time, bidirectional communication
import { Server } from "socket.io";

// --------------------------- INITIAL SETUP ---------------------------

// Create an instance of an Express app
const app = express();

// Create an HTTP server using the Express app (required for WebSocket)
const server = http.createServer(app);

// Create a new Socket.IO server instance and allow CORS for the frontend
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow requests only from this origin (your frontend running on Vite)
    },
});

// --------------------------- SOCKET ID MAPPING ---------------------------

// Object to store mapping between userId and their socket.id
const userSocketMap = {};

// Utility function to retrieve the socket ID of a specific user
export function getReceiverSocketId(userId) {
    return userSocketMap[userId]; // Return the socket ID associated with the given user ID
}

// --------------------------- SOCKET CONNECTION HANDLING ---------------------------

// Listen for new client connections to the Socket.IO server
io.on("connection", (socket) => {
    console.log(
        "\n\n\n-------------------------------\nA user connected",
        socket.id,
        "\n-------------------------------\n\n\n"
    ); // Log the socket ID of the connected client

    // Extract userId from the client's handshake query
    const userId = socket.handshake.query.userId;

    // If userId is provided, store the mapping between userId and socket.id
    if (userId) userSocketMap[userId] = socket.id;

    // Notify all connected clients about the current list of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle user disconnection
    socket.on("disconnect", () => {
        console.log(
            "\n\n\n-------------------------------\nA user disconnected",
            socket.id,
            "\n-------------------------------\n\n\n"
        ); // Log the socket ID of the disconnected client

        // Remove the user from the user-socket mapping
        delete userSocketMap[userId];

        // Broadcast the updated list of online users
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// --------------------------- EXPORTS ---------------------------

// Export the Socket.IO instance, Express app, and HTTP server
// These can be imported elsewhere (e.g., to start the server or use middleware)
export { io, app, server };
