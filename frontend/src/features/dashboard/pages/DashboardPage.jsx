import UsersPage from "../../users/pages/UsersPage";
import ChatWindow from "../../chat/components/ChatWindow";

import useAuth from "../../auth/hooks/useAuth";

import "../styles/DashboardPage.css";

function DashboardPage() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">

      {/* Left side - Users */}
      <div className="users-section">

        <div className="users-header">
          <h2>Users</h2>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
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