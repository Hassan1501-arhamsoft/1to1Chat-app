import { Server } from "socket.io";

import {
  createMessage,
  markMessagesAsRead,
} from "../services/message.service.js";

let onlineUsers = [];
let activeChats = [];

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 New Socket Connection:", socket.id);

    // =================================
    // User comes online
    // =================================

    socket.on("addNewUser", (userId) => {
      // Remove old connection of same user
      //! suppose a user has multiple tabs open, we want to remove the old connection of the same user and add the new one. This way, we can ensure that the user is only connected once and we can send messages to the correct socket.
      onlineUsers = onlineUsers.filter(   
        (user) => user.userId !== userId
      );

      onlineUsers.push({
        userId,
        socketId: socket.id,
      });

      console.log("👥 Online Users:", onlineUsers);

      io.emit("getOnlineUsers", onlineUsers);
    });

    // =================================
    // User opens a chat
    // =================================

    socket.on("openChat", async ({ userId, chatWith }) => {
      try {
        // Remove previous active chat of this user
        activeChats = activeChats.filter(  
          (chat) => chat.userId !== userId
        );

        // Add current chat
        activeChats.push({
          userId,
          chatWith,
        });

        console.log("💬 Active Chats:", activeChats);

        // Messages from chatWith → current user
        // are now read 
        //! remove the await here because we don't need to wait for the result of this function, we just want to mark the messages as read in the database.
        
        markMessagesAsRead(chatWith, userId); 
        // Find chatWith user
        const senderUser = onlineUsers.find(
          (user) => user.userId === chatWith
        );
        //! testing the senderUser and receiverUser
        // const receiverUser = onlineUsers.find(
        //   (user) => user.userId === userId
        // );
        // console.log("senderUser", senderUser);
        // console.log("receiverUser", receiverUser);

        // Tell sender that their messages were read
        //! if i remove the if condition here, it will throw an error if the senderUser is not found. So i will keep the if condition here to avoid that error.
        if (senderUser) { 
          io.to(senderUser.socketId).emit("messagesRead", {
            readerId: userId,
          });
          
        }
      

      } catch (error) {
        console.error("Open Chat Error:", error);
      }
    });

    // =================================
    // User closes chat
    // =================================

    socket.on("closeChat", (userId) => {
      activeChats = activeChats.filter(
        (chat) => chat.userId !== userId
      );

      console.log("💬 Active Chats:", activeChats);
    });

    // =================================
    // Send 1-on-1 Message
    // =================================

    socket.on("sendMessage", async (data) => {
      try {
        const { sender, receiver, message } = data;

        // Check whether receiver is online
        const receiverUser = onlineUsers.find(
          (user) => user.userId === receiver
        );

        // Check whether receiver is currently
        // viewing sender's chat
        const receiverActiveChat = activeChats.find(
          (chat) =>
            chat.userId === receiver &&
            chat.chatWith === sender
        );

        let messageStatus = "sent";

        if (receiverUser) {
          // Receiver is online
          messageStatus = "delivered";

          // Receiver is actually looking at sender's chat
          if (receiverActiveChat) {
            messageStatus = "read";
          }
        }

        // Save message to MongoDB
        const newMessage = await createMessage(  //!  i don't remove this await because we need the updated data from the db.
          sender,
          receiver,
          message,
          messageStatus
        );
        // console.log("💬 New Message:", newMessage);
        // Send message to receiver if online
        //! Because if the receiver is offline then it give undefined 
         if (receiverUser) { 
          io.to(receiverUser.socketId).emit("receiveMessage", {
            success: true,
            data: newMessage,
          });
        }//!

        // Send message status back to sender
        socket.emit("messageSent", {
          success: true,
          data: newMessage,
        });
      } catch (error) {
        console.error("Socket Send Message Error:", error);
      }
    });

    // =================================
    // Disconnect
    // =================================

    socket.on("disconnect", () => {
      // Find disconnected user
      const disconnectedUser = onlineUsers.find(
        (user) => user.socketId === socket.id
      );

      // disconnectingUser = userid

      if (disconnectedUser) {
        // Remove from online users
        onlineUsers = onlineUsers.filter(
          (user) => user.socketId !== socket.id
        );

        // Remove active chat
        activeChats = activeChats.filter(
          (chat) => chat.userId !== disconnectedUser.userId
        );
      }

      console.log(
        "🔴 User disconnected:",
        disconnectedUser?.userId
      );

      io.emit("getOnlineUsers", onlineUsers);
    });
  });

  return io;
};