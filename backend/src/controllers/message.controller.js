import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import {io, getReceiverSocketId} from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filterUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    return res.status(200).json(filterUsers);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  const { id: userToChat } = req.params;
  const myId = req.user._id;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChat },
        { senderId: userToChat, receiverId: myId },
      ],
    });

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const sendMessage = async (req, res) => {
    try {
           const {text, image} = req.body;
           
    const {id: receiverId} = req.params;
    const senderId = req.user._id;
    let imageUrl;
    if(image){
        const uploadResponse = await cloudinary.uploader.upload(image);
       
        imageUrl = uploadResponse.secure_url;
    };

        const newMessage = new Message({senderId, receiverId, text, image: imageUrl})

       await newMessage.save()

       // TODO: IMPLEMENT SOCKET IO TO SEND MESSAGE TO RECEIVER FOR REALTIME CHAT

      const receiverSocketId = getReceiverSocketId(receiverId);

      if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage)
      }


    return res.status(200).json(newMessage);
    } catch (error) {
        return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
    }

};
