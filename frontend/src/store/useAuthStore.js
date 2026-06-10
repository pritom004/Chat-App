import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";


const BASE_URL = import.meta.env.VITE_BACKEND_URL;

console.log(BASE_URL, "BASE_URL")
export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigninUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,


    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({authUser: res.data});
            get().connectSocket()
        } catch (error) {
     
            set({authUser: null})
        } finally {
            set({isCheckingAuth: false})
        }
    },


    signup: async (data) => {
        set({isSigninUp: true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser: res.data});
            if(res.status === 201){
                get().connectSocket();
                return toast.success("Account created successfully")
            }
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{ 
            set({isSigninUp: false})
        }
    },
    login: async(data) => {
        set({isLoggingIn: true});

        try {
            const res = await axiosInstance.post("/auth/login", data);

            set({authUser: res.data});
            toast.success("Logged in successfully")
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isLoggingIn: false})
        }
    },

    logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully")
      get().disconnectSocket()
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

    updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {

      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

    connectSocket: () => {

        const {authUser} = get()

        if(!authUser || get().socket?.connected) return;        //Send request to server
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            }
        });
        socket.connect()
        //Set the connection to the socket
        set({socket: socket});

        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds})
        })
    },
    disconnectSocket: ()=> {
        const socket = get().socket;
        if (socket?.connected) {
            socket.disconnect();
            set({ socket: null });
        }
    }
}));

