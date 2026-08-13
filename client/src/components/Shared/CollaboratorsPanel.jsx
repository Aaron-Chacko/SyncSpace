import { useState } from "react";
import { 
  UserPlus, 
  Info,
} from "lucide-react";

const CollaboratorsPanel = ({
  roomUsers = [],
  isHost = false,
  canEdit = false,
  onInvite = () => {},
  activeFile = "server.js",
  onGrantAccess = () => {},
  pendingRequests = [],
  onRequestEditAccess = () => {},
  requestMessage = "",
  lastJoined = null,
  currentUser = null,
}) => {
  const [activeTab, setActiveTab] = useState("collaborators");

  // Only show real users — no hardcoded fallback
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
          Chat
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
                      className="approve-btn"
                      onClick={() => onGrantAccess(req.userId, true)}
                    >
                      Approve
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Request Edit Access for Viewers */}
            {!isHost && !canEdit && (
              <div className="sidebar-request-card">
                <button
                  type="button"
                  className="request-edit-btn"
                  onClick={onRequestEditAccess}
                >
                  Request Edit Access
                </button>
                {requestMessage && (
                  <span className="request-msg-text">{requestMessage}</span>
                )}
              </div>
            )}

            {/* INVITE COLLABORATOR ACTION BUTTON */}
            <div className="invite-collaborator-wrapper">
              <button
                type="button"
                className="invite-collaborator-btn"
                onClick={onInvite}
              >
                <UserPlus size={15} />
                <span>+ Invite collaborator</span>
              </button>
            </div>
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
          <div className="panel-chat-placeholder">
            <p>Live session room chat active.</p>
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
