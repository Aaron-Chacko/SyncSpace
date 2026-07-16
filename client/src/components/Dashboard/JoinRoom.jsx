import React, { useState } from 'react';

const JoinRoom = ({ onJoin }) => {
  const [roomId, setRoomId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomId.trim()) {
      onJoin(roomId);
      setRoomId('');
    }
  };

  return (
    <form className="join-room-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="Enter Room ID" value={roomId} onChange={e => setRoomId(e.target.value)} required />
      <button type="submit">Join Room</button>
    </form>
  );
};

export default JoinRoom;