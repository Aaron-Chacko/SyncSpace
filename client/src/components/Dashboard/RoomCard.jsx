import React from "react";
import {
  Users,
  CalendarDays,
  LogIn,
  UserPlus,
  Trash2,
} from "lucide-react";

const RoomCard = ({ room, onInvite, onDelete }) => {
  return (
    <div className="room-card">
      <div className="room-card-header">
        <h3>{room.name}</h3>
      </div>

      <div className="room-card-body">
        <p className="room-detail">
          <CalendarDays size={16} />
          <span>{room.createdDate}</span>
        </p>

        <p className="room-detail">
          <Users size={16} />
          <span>{room.members} Members</span>
        </p>
      </div>

      <div className="room-card-actions">
        <button
          className="primary-btn"
          onClick={() => alert(`Joining ${room.name}`)}
        >
          <LogIn size={16} />
          Join
        </button>

        <button
          className="secondary-btn"
          onClick={() => onInvite(room)}
        >
          <UserPlus size={16} />
          Invite
        </button>

        <button
          className="secondary-btn delete-btn"
          onClick={() => onDelete(room)}
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default RoomCard;