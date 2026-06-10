import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

dotenv.config()

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {}; 
// on
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(userId)

  if (userId) userSocketMap[userId] = socket.id;
  // io.emit() is used to send even to all the connect client;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
   
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });


  socket.on("typing", (receiverId) => {
 

    
    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("userTyping", userId);
    }
  })

  socket.on("stopTyping", (receiverId) => {
  
   const receiverSocketId = getReceiverSocketId(receiverId);
   if(receiverSocketId){
    io.to(receiverSocketId).emit("stopUserTyping", userId);
   }
  })

});

export { app, server, io };
