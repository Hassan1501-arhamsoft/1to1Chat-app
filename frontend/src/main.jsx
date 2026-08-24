import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

import AuthProvider from "./features/auth/context/AuthContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import { CallProvider } from "./features/call/context/CallContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketContextProvider>
          <ChatProvider>
             <CallProvider>
             <App />
              </CallProvider>
          </ChatProvider>
        </SocketContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);