import React, { useState } from 'react';
import CreateRoom from '../components/Dashboard/CreateRoom';
import JoinRoom from '../components/Dashboard/JoinRoom';
import RoomCard from '../components/Dashboard/RoomCard';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);

  const handleCreateRoom = (name) => {
    const newRoom = { id: Math.random().toString(36).substring(7), name, creator: 'Me', activeUsersCount: 1 };
    setRooms([...rooms, newRoom]);
  };

  const handleJoinRoom = (id) => {
    console.log('Joining room:', id);
  };

  return (
    <div className="page dashboard-page" style={{ padding: '40px', flex: 1 }}>
      <h2>Your Dashboard</h2>
      <div style={{ display: 'flex', gap: '30px', margin: '20px 0' }}>
        <CreateRoom onCreate={handleCreateRoom} />
        <JoinRoom onJoin={handleJoinRoom} />
      </div>
      <div className="rooms-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {rooms.map(room => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;