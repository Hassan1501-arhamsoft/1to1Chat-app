import {
  createContext,
  useContext,
  useState,
} from "react";

import { useSocket } from "./SocketContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const { socket } = useSocket();

  const sendSocketMessage = (data) => {
    if (!socket) {
      console.log("Socket is not connected");
      return;
    }

    socket.emit("sendMessage", data);
  };

  return (
    <ChatContext.Provider
      value={{
        selectedUser,
        setSelectedUser,
        sendSocketMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChatContext = () => {
  return useContext(ChatContext);
};