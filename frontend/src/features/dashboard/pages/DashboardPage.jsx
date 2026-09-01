import { useState } from "react";
import UsersPage from "../../users/pages/UsersPage";
import ChatWindow from "../../chat/components/ChatWindow";
import api from "../../../api/axios";
import useAuth from "../../auth/hooks/useAuth";
import "../styles/DashboardPage.css";
import { useChatContext } from "../../../context/ChatContext";
function DashboardPage() {
  const { selectedUser } = useChatContext();
  const { logout, user, login } = useAuth();
  
  // 2FA States
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.isTwoFactorEnabled || false);
  const [setupMode, setSetupMode] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [setupToken, setSetupToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStartSetup = async () => {
    try {
      setLoading(true);
      const response = await api.post("/auth/2fa/generate", { email: user.email });
      setQrCodeData(response.data.data); 
      setSetupMode(true);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Failed to start 2FA setup.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSetup = async () => {
    try {
      setLoading(true);
      const response = await api.post("/auth/2fa/verify-setup", {
        email: user.email,
        token: setupToken,
        secret: qrCodeData.secret
      });
      
      setIs2FAEnabled(true);
      setSetupMode(false);
      alert(response.message);
      
      login({ ...user, isTwoFactorEnabled: true }, localStorage.getItem("token"));
    } catch (error) {
      alert(error.response?.data?.message || "Invalid code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!window.confirm("Are you sure you want to disable Two-Factor Authentication?")) return;
    
    try {
      setLoading(true);
      await api.put("/auth/2fa/disable", { email: user.email });
      setIs2FAEnabled(false);
      alert("Authenticator disabled.");
      
      login({ ...user, isTwoFactorEnabled: false }, localStorage.getItem("token"));
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Failed to disable 2FA.");
    } finally {
      setLoading(false);
    }
  };
  const isChatActive = !!selectedUser;

  return (
    <div className={`dashboard ${isChatActive ? "show-chat" : ""}`}>
      <div className="users-section">
        
        <div className="users-header">
          <div className="users-header-top">
            <h2>{user?.name}</h2>
            <button className="logout-button" onClick={logout}>Logout</button>
          </div>

          <div className="two-factor-manage">
            
            {!is2FAEnabled && !setupMode && (
              <button className="btn-enable-2fa" onClick={handleStartSetup} disabled={loading}>
                {loading ? "Loading..." : "Enable Authenticator App"}
              </button>
            )}

            {is2FAEnabled && (
              <button className="btn-disable-2fa" onClick={handleDisable2FA} disabled={loading}>
                {loading ? "Loading..." : "Disable Authenticator App"}
              </button>
            )}

            {setupMode && qrCodeData && (
              <div className="qr-setup-container">
                <h4>Setup Authenticator</h4>
                <p className="qr-instruction-text">1. Scan this QR code with Google Authenticator or Authy.</p>
                <img src={qrCodeData.qrCodeUrl} alt="QR Code" className="qr-image" />
                <p className="qr-instruction-text">Or enter manually: <strong>{qrCodeData.secret}</strong></p>
                
                <p className="qr-instruction-text">2. Enter the 6-digit code from the app:</p>
                <div className="qr-action-row">
                  <input 
                    type="text" 
                    maxLength="6"
                    value={setupToken} 
                    onChange={(e) => setSetupToken(e.target.value)} 
                    placeholder="000000"
                    className="qr-input"
                  />
                  <button className="btn-confirm" onClick={handleConfirmSetup} disabled={loading || setupToken.length < 6}>
                    Confirm
                  </button>
                  <button className="btn-cancel" onClick={() => setSetupMode(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <UsersPage />
      </div>

      <div className="chat-section">
        <ChatWindow />
      </div>
    </div>
  );
}

export default DashboardPage;