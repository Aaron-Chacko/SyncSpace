import React from "react";

const RoomCard = ({ room }) => {
  return (
    <div className="room-card">
      <h3>{room.name}</h3>

      <p>📅 Created: {room.createdDate}</p>

      <div className="room-info">
        <span>👥 Members: {room.members}</span>
      </div>

      <button
        className="primary-btn"
        onClick={() => alert(`Joining ${room.name}`)}
      >
        Join Room
      </button>
    </div>
  );
};

export default RoomCard;