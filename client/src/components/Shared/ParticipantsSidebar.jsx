import { Users, Crown, Edit3, Eye, Copy, Check, Hash, KeyRound, CheckCircle2, ShieldAlert, UserCheck, LogOut } from "lucide-react";

const ParticipantsSidebar = ({
  roomId = "",
  copied = false,
  onCopyRoomCode = () => {},
  roomUsers = [],
  isHost = false,
  canEdit = false,
  onGrantAccess = () => {},
  pendingRequests = [],
  onRequestEditAccess = () => {},
  requestMessage = "",
  onLeaveRoom = () => {},
}) => {
  return (
    <aside className="room-participants-sidebar">
      {/* Top Room Code Card */}
      <div className="sidebar-room-code-card">
        <div className="code-card-header">
          <Hash size={14} className="code-hash-icon" />
          <span className="code-card-label">ROOM CODE</span>
        </div>
        <div className="code-card-body">
          <span className="code-card-value">{roomId}</span>
          <button
            type="button"
            className={`sidebar-copy-btn ${copied ? "copied" : ""}`}
            onClick={onCopyRoomCode}
            title="Copy Room Code"
          >
            {copied ? (
              <>
                <Check size={13} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Participants Header */}
      <div className="sidebar-section-header">
        <div className="section-title-group">
          <Users size={15} className="section-icon" />
          <span>Participants</span>
        </div>
        <span className="online-count-badge">{roomUsers.length} Online</span>
      </div>

      {/* Participants List */}
      <div className="sidebar-users-list">
        {roomUsers.map((u) => {
          const isUserHost = u.isHost;
          const canUserEdit = u.canEdit;

          return (
            <div key={u.socketId} className="user-item-row">
              <div className="user-info">
                <div className="user-avatar-small">
                  {(u.name || "U")[0].toUpperCase()}
                </div>
                <div className="user-details">
                  <span className="user-display-name">{u.name || u.socketId.substring(0, 8)}</span>
                  <span className="user-role-tag">
                    {isUserHost ? (
                      <><Crown size={11} className="role-icon host" /> Host</>
                    ) : canUserEdit ? (
                      <><Edit3 size={11} className="role-icon editor" /> Editor</>
                    ) : (
                      <><Eye size={11} className="role-icon viewer" /> Viewer</>
                    )}
                  </span>
                </div>
              </div>

              {/* Host Control Button */}
              {isHost && !isUserHost && (
                <button
                  type="button"
                  className={`host-toggle-access-btn ${canUserEdit ? "revoke" : "grant"}`}
                  onClick={() => onGrantAccess(u.userId, !canUserEdit)}
                  title={canUserEdit ? "Revoke edit access" : "Grant edit access"}
                >
                  {canUserEdit ? "Revoke" : "Grant Edit"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Access Permission Control for Viewers */}
      {!isHost && (
        <div className="access-status-card">
          <div className="access-card-header">
            <ShieldAlert size={14} className="access-icon" />
            <span>Your Permissions</span>
          </div>

          {canEdit ? (
            <div className="access-granted-pill">
              <CheckCircle2 size={14} color="#10b981" />
              <span>Full Edit & Draw Access Granted</span>
            </div>
          ) : (
            <div className="request-access-group">
              <p className="access-desc">You are currently in View-Only mode.</p>
              <button
                type="button"
                className="sidebar-request-access-btn"
                onClick={onRequestEditAccess}
              >
                <KeyRound size={14} />
                <span>Request Edit Access</span>
              </button>
              {requestMessage && (
                <span className="request-feedback-msg">{requestMessage}</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Pending Access Requests for Host */}
      {isHost && pendingRequests.length > 0 && (
        <div className="pending-requests-card">
          <div className="pending-card-header">
            <UserCheck size={14} className="pending-icon" />
            <span>Pending Edit Requests ({pendingRequests.length})</span>
          </div>
          <div className="pending-list">
            {pendingRequests.map((req) => (
              <div key={req.userId} className="pending-item">
                <span className="pending-user-name">{req.name || "User"}</span>
                <button
                  type="button"
                  className="approve-request-btn"
                  onClick={() => onGrantAccess(req.userId, true)}
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leave Room Action Card */}
      <div className="sidebar-leave-card">
        <button
          type="button"
          className="sidebar-leave-room-btn"
          onClick={onLeaveRoom}
          title="Leave Room & Return to Dashboard"
        >
          <LogOut size={15} />
          <span>Leave Room</span>
        </button>
      </div>
    </aside>
  );
};

export default ParticipantsSidebar;