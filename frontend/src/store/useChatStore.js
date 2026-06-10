import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
let timeoutId;
let typingCheck = false;
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  isTyping: false,
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },
  subscribeToMessage: () => {
    const { selectedUser } = get();

    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const currentSelectedUser = get().selectedUser;
      const isMessageSendFromSelectedUser =
        currentSelectedUser && newMessage.senderId === currentSelectedUser._id;

      if (!isMessageSendFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },

  typing: () => {
    const selectedUser = get().selectedUser;
    const socket = useAuthStore.getState().socket;
    if (!selectedUser || !socket) return;
    const receiverId = selectedUser._id;
    if (!typingCheck) {
   
      
      socket.emit("typing", receiverId);
      typingCheck = true;
    }
    clearTimeout(timeoutId);
    

    timeoutId = setTimeout(() => {
      typingCheck = false;
      socket.emit("stopTyping", receiverId);
    }, 1500);
  },
  subscribeUserTyping: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.on("userTyping", () => {
     

      set({ isTyping: true });
    });

    socket.on("stopUserTyping", () => {
      set({ isTyping: false });
    });
  },
  unsubscribeUserTyping: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("userTyping");
    socket.off("stopUserTyping");
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
