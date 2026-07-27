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
      createdDate: "26 Jul 2026",
      members: 3,
    },
    {
      id: "room-2",
      name: "Backend Team",
      createdDate: "25 Jul 2026",
      members: 2,
    },
    {
      id: "room-3",
      name: "Interview Room",
      createdDate: "24 Jul 2026",
      members: 5,
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

      {/* Action Buttons */}
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

        {recentRooms.length > 0 ? (
          <div className="rooms-grid">
            {recentRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No Rooms Found</h3>

            <p>
              You haven't created or joined any rooms yet.
            </p>

            <button
              className="primary-btn"
              onClick={() => {
                setShowCreateRoom(true);
                setShowJoinRoom(false);
              }}
            >
              Create Your First Room
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;