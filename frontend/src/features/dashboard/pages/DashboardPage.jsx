import UsersPage from "../../users/pages/UsersPage";
import ChatWindow from "../../chat/components/ChatWindow";
import api from "../../../api/axios";
import useAuth from "../../auth/hooks/useAuth";

import "../styles/DashboardPage.css";
import { useState } from "react";

function DashboardPage() {
  const { logout, user } = useAuth();
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.isTwoFactorEnabled || false);
const handleToggle2FA = async () => {
    try {
      const newValue = !is2FAEnabled;
      
      // Call the backend endpoint we created earlier
      await api.put("/auth/toggle-2fa", {
        email: user.email,
        isTwoFactorEnabled: newValue
      });
      
      setIs2FAEnabled(newValue);
      alert(`2FA (OTP Login) is now ${newValue ? 'Enabled' : 'Disabled'}`);
      
      // Optional: Update your local AuthContext user object here if needed
    } catch (error) {
      console.error(error);
      alert("Failed to update 2FA settings.");
    }
  };
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">

      {/* Left side - Users */}
      <div className="users-section">

        <div className="users-header">
          <h2>{user?.name}</h2>
          

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
          <div className="two-factor-toggle" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontSize: "14px", cursor: "pointer" }}>
            <input 
              type="checkbox" 
              checked={is2FAEnabled} 
              onChange={handleToggle2FA} 
              style={{ marginRight: "5px", cursor: "pointer" }}
            />
            Enable 2FA (OTP)
          </label>
        </div>
        </div>

        <UsersPage />

      </div>

      {/* Right side - Chat */}
      <div className="chat-section">
        <ChatWindow />
      </div>

    </div>
  );
}

export default DashboardPage;