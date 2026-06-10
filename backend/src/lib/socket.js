import { Server } from "socket.io";
import http from "http";
import express from "express";

//client send message by emitting event
//server receive by listening that event

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {}; // {userId: socketId}

// on
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;


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
