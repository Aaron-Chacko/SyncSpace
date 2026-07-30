import React from "react";

const RoomCard = ({ room, onInvite, onDelete }) => {
  return (
    <div className="room-card">
      <h3>{room.name}</h3>

      <p>📅 Created: {room.createdDate}</p>

      <div className="room-info">
        <span>👥 Members: {room.members}</span>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "15px",
          flexWrap: "wrap",
        }}
      >
        <button
          className="primary-btn"
          onClick={() => alert(`Joining ${room.name}`)}
        >
          Join
        </button>

        <button
          className="secondary-btn"
          onClick={() => onInvite(room)}
        >
          Invite
        </button>

        <button
          className="secondary-btn"
          onClick={() => onDelete(room)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default RoomCard;