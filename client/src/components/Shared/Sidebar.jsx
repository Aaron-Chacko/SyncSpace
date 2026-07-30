import React from "react";

const Sidebar = ({ roomUsers }) => {
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
          <li key={user.socketId}>
            {user.socketId}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;