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
        {/* Join */}
        <button
          className="primary-btn"
          aria-label={`Join ${room.name}`}
          title={`Join ${room.name}`}
          onClick={() => alert(`Joining ${room.name}`)}
        >
          <LogIn size={16} />
          Join
        </button>

        {/* Invite */}
        <button
          className="secondary-btn"
          aria-label={`Invite users to ${room.name}`}
          title={`Invite users to ${room.name}`}
          onClick={() => onInvite(room)}
        >
          <UserPlus size={16} />
          Invite
        </button>

        {/* Delete */}
        <button
          className="secondary-btn delete-btn"
          aria-label={`Delete ${room.name}`}
          title={`Delete ${room.name}`}
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