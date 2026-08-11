import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

import AuthProvider from "./features/auth/context/AuthContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketContextProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </SocketContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);