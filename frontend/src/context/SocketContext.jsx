import { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import useAuth from "../features/auth/hooks/useAuth"; // Adjust import path if needed

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (user) {
      // Connect to backend Socket.IO server
      const newSocket = io("http://localhost:5000"); // Match your backend PORT
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSocket(newSocket);

      // Pass logged-in user ID to backend
      const userId = user._id || user.id;
      newSocket.emit("addNewUser", userId);

      // Receive updated list of online users from backend
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);