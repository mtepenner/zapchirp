// Importing necessary modules
import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import groupChatRoutes from './routes/groupChat.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';
import contactRoutes from './routes/contact.routes.js';
import cookieParser from "cookie-parser";

// Loading environment variables from .env file
dotenv.config(); 

// Logging environment variables for debugging (Masking secret for safety in logs)
console.log("Environment Variables:");
console.log("PORT:", process.env.PORT);
console.log("MONGO_DB_URL:", process.env.MONGO_DB_URL);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "Missing!");

// Creating an instance of Express
const app = express();

// FIX: Defaulting to 5000 or 3001 to prevent conflict if React is running on port 3000
const PORT = process.env.PORT || 3001; 

// FIX: Centralize CORS options for both Express and Socket.io
// `credentials: true` is strictly required if you are using cookies for JWT auth.
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true 
};

// Middleware setup
app.use(cors(corsOptions)); // Apply specific CORS rules
app.use(express.json()); // Parsing JSON request bodies
app.use(cookieParser()); // Parsing cookies

// Route setup
app.use("/api/groupChats", groupChatRoutes); 
app.use("/api/messages", messageRoutes); 
app.use("/api/users", userRoutes); 
app.use("/api/auth", authRoutes); 
app.use('/api/contacts', contactRoutes); 

// FIX: Global Error Handler. If a route throws an unhandled error, 
// this catches it so the Node process doesn't crash.
app.use((err, req, res, next) => {
    console.error("Unhandled Application Error:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

// Create HTTP server
const server = http.createServer(app);

// FIX: Apply the exact same centralized CORS options to Socket.io
const io = new Server(server, {
    cors: corsOptions,
});

// Socket.io connection event
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`); 
    
    // Handling the join_room event
    socket.on("join_room", (data) => {
        socket.join(data); 
        console.log(`User with ID: ${socket.id} joined room: ${data}`); 
    });

    // Handling the send_message event
    socket.on("send_message", (data) => {
        // FIX: Add a safeguard check. If data.room exists, emit there. 
        // Otherwise, broadcast to everyone (helpful if your frontend Chat.js doesn't explicitly join rooms yet)
        if (data && data.room) {
            socket.to(data.room).emit("receive_message", data); 
        } else {
            socket.broadcast.emit("receive_message", data);
        }
    });

    // Handling the disconnect event
    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id); 
    });
});

// FIX: Ensure the database connects successfully BEFORE we open the port to traffic.
// This prevents users from hitting routes when the DB isn't ready yet.
const startServer = async () => {
    try {
        await connectToMongoDB();
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database. Server failed to start.", error);
        process.exit(1); // Exit process with failure
    }
};

startServer();



