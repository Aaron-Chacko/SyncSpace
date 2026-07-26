import React from "react";

const RoomCard = ({ room }) => {
  return (
    <div className="room-card">
      <h3>{room.name}</h3>

      <p>{room.description}</p>

      <div className="room-info">
        <span>👤 {room.creator}</span>
        <span>🟢 {room.activeUsersCount} Active</span>
      </div>

      <button className="primary-btn">
        Open Room
      </button>
    </div>
  );
};

export default RoomCard;