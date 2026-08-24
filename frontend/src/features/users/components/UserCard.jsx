import "../styles/UserCard.css";
import { useSocket } from "../../../context/SocketContext";
import { useChatContext } from "../../../context/ChatContext";


function UserCard({ user }) {
  const { onlineUsers } = useSocket();
  const {
    setSelectedUser,
  } = useChatContext();

  // Check if this specific user is online
  const isOnline = onlineUsers?.some(
    (u) => u.userId === (user._id || user.id)
  );

  return (
    <div className="user-card">
      

      <div className="user-info">
        <h3>{user.name}</h3>

        <p>{user.email}</p>

        <span
          className={
            isOnline
              ? "status online"
              : "status offline"
          }
        >
          {isOnline ? "🟢 Online" : "🔴 Offline"}
        </span>
      </div>

      <button
        className="message-btn"
        onClick={() => {
        setSelectedUser(user);
        }}
      >
        Message
      </button>
    </div>
  );
}

export default UserCard;