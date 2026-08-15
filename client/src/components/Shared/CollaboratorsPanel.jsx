import { useState, useEffect, useRef } from "react";
import { 
  Info,
  Send
} from "lucide-react";

const CollaboratorsPanel = ({
  roomUsers = [],
  isHost = false,
  canEdit = false,
  onInvite,
  activeFile = "server.js",
  onGrantAccess = () => {},
  pendingRequests = [],
  onRequestEditAccess = () => {},
  requestMessage = "",
  lastJoined = null,
  currentUser = null,
  messages = [],
  onSendMessage = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("collaborators");
  const [chatInput, setChatInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const chatEndRef = useRef(null);
  const prevMessagesLength = useRef(messages.length);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (activeTab === "chat" && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  // Track unread messages
  useEffect(() => {
    if (activeTab === "chat") {
      setUnreadCount(0);
    } else if (messages.length > prevMessagesLength.current) {
      setUnreadCount((prev) => prev + (messages.length - prevMessagesLength.current));
    }
    prevMessagesLength.current = messages.length;
  }, [messages, activeTab]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatInput);
    setChatInput("");
  };

  const displayUsers = roomUsers;

  return (
    <aside className="ide-collaborators-panel">
      {/* TOP TABS CONTROL */}
      <div className="panel-tabs-header">
        <button
          type="button"
          className={`panel-tab-btn ${activeTab === "collaborators" ? "active" : ""}`}
          onClick={() => setActiveTab("collaborators")}
        >
          Collaborators
        </button>
        <button
          type="button"
          className={`panel-tab-btn ${activeTab === "activity" ? "active" : ""}`}
          onClick={() => setActiveTab("activity")}
        >
          Activity
        </button>
        <button
          type="button"
          className={`panel-tab-btn ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          Chat {unreadCount > 0 ? (
            <span className="chat-unread-badge">{unreadCount}</span>
          ) : (
            messages.length > 0 && `(${messages.length})`
          )}
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="panel-tab-body">
        {activeTab === "collaborators" && (
          <div className="collaborators-list-container">
            <div className="users-stack-list">
              {displayUsers.map((u) => {
                const initials = (u.name || "U")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                const isUserHost = u.isHost;
                const canUserEdit = u.canEdit;
                const roleTag = u.role || (isUserHost ? "Host" : canUserEdit ? "Editor" : "Viewer");
                const userStatus = u.status || (canUserEdit ? `Editing ${activeFile}` : `Viewing ${activeFile}`);

                return (
                  <div key={u.socketId || u.name} className="collaborator-user-row">
                    <div className="user-avatar-badge-initials">
                      {initials}
                    </div>

                    <div className="collaborator-info-col">
                      <div className="collab-name-role-line">
                        <span className="collaborator-name">{u.name}</span>
                        <span className={`collaborator-role-tag ${roleTag.toLowerCase()}`}>
                          {roleTag}
                        </span>
                      </div>
                      <span className="collaborator-status-text">{userStatus}</span>
                    </div>

                    {/* Host Quick Grant/Revoke Button */}
                    {isHost && !isUserHost && u.userId && (
                      <button
                        type="button"
                        className="quick-role-toggle-btn"
                        onClick={() => onGrantAccess(u.userId, !canUserEdit)}
                        title={canUserEdit ? "Revoke access" : "Grant access"}
                      >
                        {canUserEdit ? "Revoke" : "Grant"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pending Edit Requests if Host */}
            {isHost && pendingRequests.length > 0 && (
              <div className="sidebar-pending-card">
                <span className="pending-title">Access Requests ({pendingRequests.length})</span>
                {pendingRequests.map((req) => (
                  <div key={req.userId} className="pending-row">
                    <span>{req.name || "User"}</span>
                    <button
                      type="button"
                      className="themed-approve-btn"
                      onClick={() => onGrantAccess(req.userId, true)}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Approve</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Request Edit Access for Viewers */}
            {!isHost && !canEdit && (
              <div className="sidebar-request-card">
                <div className="request-card-icon-row">
                  <div className="request-icon-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                    </svg>
                  </div>
                  <span className="request-card-title">View-Only Mode</span>
                </div>
                <p className="request-card-desc">You're currently viewing. Request edit access to collaborate.</p>
                <button
                  type="button"
                  className="request-edit-access-btn"
                  onClick={onRequestEditAccess}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="16" r="1" />
                    <rect x="3" y="10" width="18" height="12" rx="2" ry="2" />
                    <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                  </svg>
                  <span>Request Edit Access</span>
                </button>
                {requestMessage && (
                  <span className="request-msg-text">{requestMessage}</span>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="activity-timeline-container">
            {roomUsers.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", padding: "12px" }}>No activity yet.</p>
            ) : (
              roomUsers.map((u) => (
                <div key={u.socketId || u.name} className="timeline-item">
                  <span className="time">Active</span>
                  <span className="text"><strong>{u.name}</strong> is in the workspace.</span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "chat" && (
          <div className="panel-chat-container">
            <div className="chat-messages-scroll-area">
              {messages.length === 0 ? (
                <div className="chat-empty-state">
                  <p className="chat-empty-title">Session Chat</p>
                  <p className="chat-empty-desc">Send messages to collaborate with other people in this room.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === currentUser?.id || msg.senderId === "me";
                  const initial = (msg.senderName || "U")[0].toUpperCase();

                  return (
                    <div
                      key={msg.id}
                      className={`chat-message-row ${isMe ? "me" : "other"}`}
                    >
                      {!isMe && (
                        <div className="chat-message-avatar">
                          {initial}
                        </div>
                      )}
                      <div className="chat-message-bubble">
                        {!isMe && (
                          <span className="chat-message-sender-name">
                            {msg.senderName}
                          </span>
                        )}
                        <p className="chat-message-text">{msg.text}</p>
                        <span className="chat-message-time">{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSend} className="chat-input-submit-bar">
              <input
                type="text"
                placeholder="Send message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                maxLength={1000}
              />
              <button type="submit" disabled={!chatInput.trim()}>
                <Send size={14} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* FLOATING ACTIVITY TOAST — shows last joined user */}
      {lastJoined && (
        <div className="workspace-joined-toast">
          <Info size={14} className="toast-icon" />
          <span>{lastJoined} joined the workspace</span>
        </div>
      )}
    </aside>
  );
};

export default CollaboratorsPanel;
