import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieparser  from "cookie-parser"
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();



const app = express();


const PORT = process.env.PORT || 5000;

//Middlewares
app.use(express.json());
app.use(cookieparser());
app.use(helmet());
app.use(cors({origin: 'http://localhost:5173', credentials: true}));


//Routes
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    connectDB();
});