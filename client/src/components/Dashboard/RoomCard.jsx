import { useNavigate } from "react-router-dom";
import {
  Users,
  CalendarDays,
  LogIn,
  UserPlus,
  Trash2,
} from "lucide-react";

const RoomCard = ({ room, onInvite, onDelete }) => {
  const navigate = useNavigate();

  const handleJoin = () => {
    if (room.roomCode) {
      navigate(`/room/${room.roomCode}`);
    }
  };

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
          type="button"
          className="room-card-btn room-join-btn"
          aria-label={`Join ${room.name}`}
          title={`Join ${room.name}`}
          onClick={handleJoin}
        >
          <LogIn size={15} />
          <span>Join</span>
        </button>

        {/* Invite */}
        <button
          type="button"
          className="room-card-btn room-invite-btn"
          aria-label={`Invite users to ${room.name}`}
          title={`Invite users to ${room.name}`}
          onClick={() => onInvite(room)}
        >
          <UserPlus size={15} />
          <span>Invite</span>
        </button>

        {/* Delete */}
        <button
          type="button"
          className="room-card-btn room-delete-btn"
          aria-label={`Delete ${room.name}`}
          title={`Delete ${room.name}`}
          onClick={() => onDelete(room)}
        >
          <Trash2 size={15} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default RoomCard;