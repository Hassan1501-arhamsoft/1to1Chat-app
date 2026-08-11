import { useEffect, useState } from "react";

import { getMessages } from "../services/chat.service";
import { useChatContext } from "../../../context/ChatContext";
import { useSocket } from "../../../context/SocketContext";
import useAuth from "../../auth/hooks/useAuth";

function useChat() {
  const { selectedUser } = useChatContext();
  const {  onlineUsers } = useSocket();
  const { socket } = useSocket();

  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loadingMore, setLoadingMore] = useState(false);

  // Load messages when a user is selected
 useEffect(() => {
  if (!selectedUser) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages([]);
    return;
  }

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMessages(
        selectedUser._id,
        1
      );

      setMessages(response.data);
      setHasMore(response.hasMore);
      setPage(1);
    } catch (error) {
      console.error(error);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  loadMessages();
}, [selectedUser]);

  // Handle Socket.IO messages
  useEffect(() => {
    if (!socket || !selectedUser || !user) {
      return;
    }

    const currentUserId = user._id || user.id;
    const selectedUserId = selectedUser._id;

    console.log(currentUserId, selectedUserId);
    // Tell backend which chat is open
    socket.emit("openChat", {
      userId: currentUserId,
      chatWith: selectedUserId,
    });

    // Receive a new message
    const receiveMessage = (response) => {
      const newMessage = response.data;

      setMessages((oldMessages) => [
        ...oldMessages,
        newMessage,
      ]);
    };

    // Message sent successfully
    const messageSent = (response) => {
      const newMessage = response.data;

      setMessages((oldMessages) => [
        ...oldMessages,
        newMessage,
      ]);
    };

    // Someone read my messages
    const messagesRead = ({ readerId }) => {
      console.log("Messages read by:", readerId);

      setMessages((oldMessages) =>
        oldMessages.map((message) => {
          const senderId =
            typeof message.sender === "object"
              ? message.sender._id
              : message.sender;

          const receiverId =
            typeof message.receiver === "object"
              ? message.receiver._id
              : message.receiver;

          // Change my messages to "read"
          if (
            senderId === currentUserId &&
            receiverId === selectedUserId
          ) {
            return {
              ...message,
              status: "read",
            };
          }

          return message;
        })
      );
    };

    // Listen for socket events
    socket.on("receiveMessage", receiveMessage);
    socket.on("messageSent", messageSent);
    socket.on("messagesRead", messagesRead);

    // Cleanup
    return () => {
      socket.emit("closeChat", currentUserId);

      socket.off("receiveMessage", receiveMessage);
      socket.off("messageSent", messageSent);
      socket.off("messagesRead", messagesRead);
    };
  }, [socket, selectedUser, user]);


const fetchMoreMessages = async () => {
  if (!selectedUser) {
    return;
  }

  if (!hasMore) {
    return;
  }

  if (loadingMore) {
    return;
  }

  try {
    setLoadingMore(true);

    const nextPage = page + 1;

    const response = await getMessages(
      selectedUser._id,
      nextPage
    );

    setMessages((oldMessages) => [
      ...response.data,
      ...oldMessages,
    ]);

    setPage(nextPage);
    setHasMore(response.hasMore);
  } catch (error) {
    console.error(error);
  } finally {
    setLoadingMore(false);
  }
};
  // ==========================================
  // Change sent messages to delivered
  // when selected user comes online
  // ==========================================

  useEffect(() => {
    if (!selectedUser || !user) {
      return;
    }

    const selectedUserIsOnline = onlineUsers.some(
      (onlineUser) =>
        onlineUser.userId === selectedUser._id
    );

    // Selected user is offline
    if (!selectedUserIsOnline) {
      return;
    }

    const currentUserId = user._id || user.id;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages((oldMessages) =>
      oldMessages.map((message) => {
        const senderId =
          typeof message.sender === "object"
            ? message.sender._id
            : message.sender;

        const receiverId =
          typeof message.receiver === "object"
            ? message.receiver._id
            : message.receiver;

        // Only change my messages
        // sent to the selected user
        if (
          senderId === currentUserId &&
          receiverId === selectedUser._id &&
          message.status === "sent"
        ) {
          return {
            ...message,
            status: "delivered",
          };
        }

        return message;
      })
    );
  }, [onlineUsers, selectedUser, user]);

 return {
  messages,
  loading,
  error,
  setMessages,
  fetchMoreMessages,
  loadingMore,
  hasMore,
};
}

export default useChat;