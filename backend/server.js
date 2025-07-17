// --------------------------- LOAD ENVIRONMENT VARIABLES ---------------------------

// Import dotenv to load environment variables from a .env file
import dotenv from "dotenv";

// Load the variables into process.env
dotenv.config();


// --------------------------- IMPORT APPLICATION CORE FILES ---------------------------

// Import the Express app setup (routes, middlewares, etc.)
import "./src/app.js";

// Import the function that connects to the MongoDB database
import db from "./src/lib/db.js";

// Import the HTTP server (created from Express app) and socket server instance
import { server } from "./src/lib/socket.js";


// --------------------------- SERVER CONFIGURATION ---------------------------

// Set the port from environment variables, or fallback to 1502
const PORT = process.env.PORT || 1502;


// --------------------------- INITIALIZE DATABASE ---------------------------

// Wait for the database connection to establish before starting the server
await db();


// --------------------------- START SERVER ---------------------------

// Start the HTTP server and listen on the defined port
server.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
