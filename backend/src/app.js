// --------------------------- IMPORTS ---------------------------

// Import the Express framework
import express from "express";

// Import the authentication route handler
import authRouter from "./routes/auth.route.js";

// Import the messaging route handler
import messageRouter from "./routes/message.route.js";

// Import Morgan for logging HTTP requests
import morgan from "morgan";

// Import Cookie Parser to handle cookies
import cookieParser from "cookie-parser";

// Import CORS middleware to handle Cross-Origin Resource Sharing
import cors from "cors";

// Import the Express `app` instance from the socket setup file
import { app } from "./lib/socket.js";

// Import path to handle file paths
import path from "path";

// --------------------------- MIDDLEWARES ---------------------------

// Parse incoming JSON requests with a body size limit of 10MB
app.use(express.json({ limit: "10mb" }));

// Parse cookies from the request headers
app.use(cookieParser());

// Use Morgan in "dev" mode to log incoming requests to the console
app.use(morgan("dev"));

// Enable CORS for requests coming from the frontend (running on localhost:5173)
app.use(cors({
    origin: "http://localhost:5173", // Frontend origin
    credentials: true,              // Allow sending cookies with requests
}));


// --------------------------- ROUTES ---------------------------

// Mount the auth routes under /api/v1/auth
app.use("/api/v1/auth", authRouter);

// Mount the message routes under /api/v1/messages
app.use("/api/v1/messages", messageRouter);

// Serve static files from the frontend build directory
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

// --------------------------- EXPORT ---------------------------

// Export the configured Express app
export default app;
