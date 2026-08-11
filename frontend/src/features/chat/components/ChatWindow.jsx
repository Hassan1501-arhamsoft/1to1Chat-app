import { useRef, useState } from "react";

import { useChatContext } from "../../../context/ChatContext";
import useAuth from "../../auth/hooks/useAuth";
import useChat from "../hooks/useChat";

import "../styles/ChatWindow.css";
import { useLayoutEffect } from "react";

function ChatWindow() {
  const { user } = useAuth();

  const {
    selectedUser,
    sendSocketMessage,
  } = useChatContext();

  const {
    messages,
    loading,
    error,
    fetchMoreMessages,
    loadingMore,
    hasMore,
  } = useChat();

  const [message, setMessage] = useState("");

  const containerRef = useRef(null);
  const previousScrollHeightRef = useRef(0);

  // ==============================
  // Load older messages
  // ==============================
  const handleScroll = async () => {
    const container = containerRef.current;

    if (!container) return;

    const reachedTop = container.scrollTop === 0;

    if (!reachedTop || !hasMore || loadingMore) {
      return;
    }

    // Save current height
    previousScrollHeightRef.current =
      container.scrollHeight;

    // Load older messages
    await fetchMoreMessages();

    // Keep scroll position
    requestAnimationFrame(() => {
      const newScrollHeight =
        container.scrollHeight;

      const heightDifference =
        newScrollHeight -
        previousScrollHeightRef.current;

      container.scrollTop = heightDifference;
    });
  };
  useLayoutEffect(() => {
    const container = containerRef.current;

    if (container) {
      // Scroll to bottom when messages change
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // ==============================
  // Send message
  // ==============================
  const handleSendMessage = () => {
    if (!message.trim()) return;

    const senderId = user?._id || user?.id;
    const receiverId = selectedUser?._id;

    if (!senderId || !receiverId) {
      console.error("Sender or receiver ID is missing");
      return;
    }

    sendSocketMessage({
      sender: senderId,
      receiver: receiverId,
      message: message.trim(),
    });

    setMessage("");
  };

  // ==============================
  // No user selected
  // ==============================
  if (!selectedUser) {
    return (
      <div className="chat-window empty-chat">
        <h2>Select a user</h2>

        <p>
          Select a user to start chatting.
        </p>
      </div>
    );
  }

  return (
    <div className="chat-window">

      {/* Chat Header */}
      <div className="chat-header">
        <h2>{selectedUser.name}</h2>
        <p>{selectedUser.email}</p>
      </div>

      {/* Messages */}
      <div
        className="chat-messages"
        ref={containerRef}
        onScroll={handleScroll}
      >
        {loading && (
          <p>Loading messages...</p>
        )}

        {loadingMore && (
          <p>Loading older messages...</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        {!loading &&
          !loadingMore &&
          !error &&
          messages.length === 0 && (
            <p>
              No messages yet. Start the conversation!
            </p>
          )}

        {messages.map((message) => {
          const senderId =
            typeof message.sender === "object"
              ? message.sender._id
              : message.sender;

          const currentUserId =
            user?._id || user?.id;

          const isMyMessage =
            senderId === currentUserId;

          return (
            <div
              key={message._id}
              className={
                isMyMessage
                  ? "message my-message"
                  : "message received-message"
              }
            >
              {!isMyMessage && (
                <strong>
                  {message.sender.name}
                </strong>
              )}

              <div className="message-content">
                <p>{message.message}</p>

                {isMyMessage && (
                  <span
                    className={`message-status ${message.status}`}
                  >
                    {message.status === "sent" && "✓"}

                    {message.status === "delivered" && "✓✓"}

                    {message.status === "read" && "✓✓"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />

        <button onClick={handleSendMessage}>
          Send
        </button>
      </div>

    </div>
  );
}

export default ChatWindow;