import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieparser from "cookie-parser";
import cors from "cors";
import { app, server, io } from "./lib/socket.js";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();



const PORT = process.env.PORT || 5000;

//Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieparser());
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
//Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });