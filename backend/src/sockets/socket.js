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
      // origin: "*",

      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 New Socket Connection:", socket.id);

    // =================================
    //* User comes online
    // =================================

    socket.on("addNewUser", (userId) => {
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
    //* User opens a chat
    // =================================

    socket.on("openChat", async ({ userId, chatWith }) => {
      try {
        activeChats = activeChats.filter(
          (chat) => chat.userId !== userId
        );

        activeChats.push({
          userId,
          chatWith,
        });

        console.log("💬 Active Chats:", activeChats);

        await markMessagesAsRead(chatWith, userId);
        
        const senderUser = onlineUsers.find(
          (user) => user.userId === chatWith
        );
        
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
    //* User closes chat
    // =================================

    socket.on("closeChat", (userId) => {
      activeChats = activeChats.filter(
        (chat) => chat.userId !== userId
      );

      console.log("💬 Active Chats:", activeChats);
    });

    // =================================
    //* Send 1-on-1 Message
    // =================================

    socket.on("sendMessage", async (data) => {
      try {
        const { sender, receiver, message } = data;
        
        const receiverUser = onlineUsers.find(
          (user) => user.userId === receiver
        );

        const receiverActiveChat = activeChats.find(
          (chat) =>
            chat.userId === receiver &&
            chat.chatWith === sender
            
        );

        let messageStatus = "sent";

        if (receiverUser) {
          messageStatus = "delivered";
          
          if (receiverActiveChat) {
            messageStatus = "read";
            
          }
        }

        const newMessage = await createMessage(
          sender,
          receiver,
          message,
          messageStatus
        );

        if (receiverUser) {
          io.to(receiverUser.socketId).emit(
            "receiveMessage",
            {
              success: true,
              data: newMessage,
            }
          );
        }

        socket.emit("messageSent", {
          success: true,
          data: newMessage,
        });
      } catch (error) {
        console.error(
          "Socket Send Message Error:",
          error
        );
      }
    });

    // ==================================================
    //!                 AUDIO CALLING
    // ==================================================

    // =================================
    //* User A calls User B
    // =================================

    socket.on(
      "callUser",
      ({ callerId, receiverId, callerName, offer, callType }) => {
        const receiverUser = onlineUsers.find(
          (user) => user.userId === receiverId
        );

        // Receiver is offline
        if (!receiverUser) {
          socket.emit("callFailed", {
            message: "User is offline",
          });

          return;
        }

        // Send incoming call to receiver
        io.to(receiverUser.socketId).emit(
          "incomingCall",
          {
            callerId,
            callerName,
            offer,
            callType,
          }
        );
      }
    );

    // =================================
    //* User B accepts call
    // =================================

    socket.on(
      "acceptCall",
      ({ callerId, answer }) => {
        const callerUser = onlineUsers.find(
          (user) => user.userId === callerId
        );

        if (!callerUser) {
          return;
        }

        io.to(callerUser.socketId).emit(
          "callAccepted",
          {
            answer,
          }
        );
      }
    );

    // =================================
    //* User B rejects call
    // =================================

    socket.on(
      "rejectCall",
      ({ callerId }) => {
        const callerUser = onlineUsers.find(
          (user) => user.userId === callerId
        );

        if (!callerUser) {
          return;
        }

        io.to(callerUser.socketId).emit(
          "callRejected"
        );
      }
    );

    // =================================
    //* End Call
    // =================================

    socket.on(
      "endCall",
      ({ targetUserId }) => {
        const targetUser = onlineUsers.find(
          (user) => user.userId === targetUserId
        );

        if (!targetUser) {
          return;
        }

        io.to(targetUser.socketId).emit(
          "callEnded"
        );
      }
    );

    // =================================
    //* Disconnect
    // =================================

    socket.on("disconnect", () => {
      const disconnectedUser = onlineUsers.find(
        (user) => user.socketId === socket.id
      );

      if (disconnectedUser) {
        onlineUsers = onlineUsers.filter(
          (user) => user.socketId !== socket.id
        );

        activeChats = activeChats.filter(
          (chat) =>
            chat.userId !== disconnectedUser.userId
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