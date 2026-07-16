import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  return (
    <div className="room-card" onClick={() => navigate('/room/' + room.id)}>
      <h3>{room.name}</h3>
      <p>Created by: {room.creator}</p>
      <p>Active users: {room.activeUsersCount}</p>
    </div>
  );
};

export default RoomCard;