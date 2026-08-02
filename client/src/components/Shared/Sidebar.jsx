import React from "react";

const Sidebar = ({ roomUsers, isHost, onGrantAccess, pendingRequests = [] }) => {
  return (
    <aside
      className="app-sidebar"
      style={{
        width: "250px",
        background: "var(--bg-secondary)",
        padding: "20px",
        borderRight: "1px solid var(--border-color)",
      }}
    >
      <h3>Participants</h3>

      <p>{roomUsers.length} user(s) connected</p>

      <ul style={{ paddingLeft: "20px" }}>
        {roomUsers.map((user) => (
          <li key={user.socketId} style={{ marginBottom: "10px" }}>
            <strong>{user.name || user.socketId}</strong>{user.isHost ? " (Host)" : user.canEdit ? " (Editor)" : " (Viewer)"}
            {isHost && !user.isHost && (
              <button type="button" className="secondary-btn" style={{ marginLeft: "6px", padding: "2px 6px", fontSize: "11px" }} onClick={() => onGrantAccess(user.userId, !user.canEdit)}>
                {user.canEdit ? "Remove edit" : "Grant edit"}
              </button>
            )}
          </li>
        ))}
      </ul>
      {isHost && pendingRequests.length > 0 && <div><h4>Edit requests</h4>{pendingRequests.map((request) => <div key={request.userId}><span>{request.name}</span><button type="button" className="primary-btn" style={{ marginLeft: "6px", padding: "2px 6px", fontSize: "11px" }} onClick={() => onGrantAccess(request.userId, true)}>Approve</button></div>)}</div>}
    </aside>
  );
};

export default Sidebar;
