import React, { useState } from "react";
import CreateRoom from "../components/Dashboard/CreateRoom";
import JoinRoom from "../components/Dashboard/JoinRoom";
import RoomCard from "../components/Dashboard/RoomCard";

const Dashboard = () => {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);

  // Dummy data (Backend integration baad me hogi)
  const recentRooms = [
    {
      id: "room-1",
      name: "Frontend Team",
      creator: "Aaron",
      activeUsersCount: 3,
      description: "React UI Development",
    },
    {
      id: "room-2",
      name: "Backend Team",
      creator: "Rahul",
      activeUsersCount: 2,
      description: "Socket.io & APIs",
    },
    {
      id: "room-3",
      name: "Interview Room",
      creator: "Admin",
      activeUsersCount: 5,
      description: "Whiteboard Practice",
    },
  ];

  return (
    <div className="dashboard-page">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome 👋</h1>
          <p>Manage your collaborative workspaces</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="dashboard-actions">
        <button
          className="primary-btn"
          onClick={() => {
            setShowCreateRoom(!showCreateRoom);
            setShowJoinRoom(false);
          }}
        >
          + Create Room
        </button>

        <button
          className="secondary-btn"
          onClick={() => {
            setShowJoinRoom(!showJoinRoom);
            setShowCreateRoom(false);
          }}
        >
          Join Room
        </button>
      </div>

      {/* Forms */}
      {showCreateRoom && <CreateRoom />}

      {showJoinRoom && <JoinRoom />}

      {/* Recent Rooms */}
      <section className="recent-rooms">
        <h2>Recent Rooms</h2>

        <div className="rooms-grid">
          {recentRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

    </div>
  );
};

export default Dashboard;