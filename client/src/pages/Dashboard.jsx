import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateRoom from "../components/Dashboard/CreateRoom";
import JoinRoom from "../components/Dashboard/JoinRoom";
import RoomCard from "../components/Dashboard/RoomCard";
import Modal from "../components/Shared/Modal";
import DeleteRoom from "../components/Dashboard/DeleteRoom";
import InviteUser from "../components/Dashboard/InviteUser";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [showDeleteRoom, setShowDeleteRoom] = useState(false);
  const [showInviteUser, setShowInviteUser] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Dummy data (Backend integration baad me hogi)
  const recentRooms = [
    {
      id: "room-1",
      name: "Frontend Team",
      creator: "Aaron",
      activeUsersCount: 3,
      description: "React UI Development",
      createdDate: "26 Jul 2026",
    },
    {
      id: "room-2",
      name: "Backend Team",
      creator: "Rahul",
      activeUsersCount: 2,
      description: "Socket.io & APIs",
      createdDate: "25 Jul 2026",
    },
    {
      id: "room-3",
      name: "Interview Room",
      creator: "Admin",
      activeUsersCount: 5,
      description: "Whiteboard Practice",
      createdDate: "24 Jul 2026",
    },
  ];

  const handleCreateRoom = (roomName) => {
    // Generate a random 6-character room code
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    console.log(`Creating room: ${roomName} (${randomCode})`);
    setShowCreateRoom(false);
    navigate(`/room/${randomCode}`);
  };

  const handleJoinRoom = (roomId) => {
    console.log(`Joining room: ${roomId}`);
    setShowJoinRoom(false);
    navigate(`/room/${roomId}`);
  };

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
            setShowCreateRoom(true);
            setShowJoinRoom(false);
          }}
        >
          + Create Room
        </button>

        <button
          className="secondary-btn"
          onClick={() => {
            setShowJoinRoom(true);
            setShowCreateRoom(false);
          }}
        >
          Join Room
        </button>
      </div>

      {/* Create Room Modal */}
      <Modal
        isOpen={showCreateRoom}
        onClose={() => setShowCreateRoom(false)}
        title="Create Room"
      >
        <CreateRoom onCreate={handleCreateRoom} />
      </Modal>

      {/* Join Room Modal */}
      <Modal
        isOpen={showJoinRoom}
        onClose={() => setShowJoinRoom(false)}
        title="Join Room"
      >
        <JoinRoom onJoin={handleJoinRoom} />
      </Modal>

      {/* Invite User Modal */}
      <Modal
        isOpen={showInviteUser}
        onClose={() => setShowInviteUser(false)}
        title="Invite User"
      >
        {selectedRoom && (
          <InviteUser
            roomName={selectedRoom.name}
            onClose={() => setShowInviteUser(false)}
          />
        )}
      </Modal>

      {/* Delete Room Modal */}
      <Modal
        isOpen={showDeleteRoom}
        onClose={() => setShowDeleteRoom(false)}
        title="Delete Room"
      >
        {selectedRoom && (
          <DeleteRoom
            roomName={selectedRoom.name}
            onCancel={() => setShowDeleteRoom(false)}
          />
        )}
      </Modal>
      {/* Recent Rooms */}
      <section className="recent-rooms">
        <h2>Recent Rooms</h2>

        {recentRooms.length > 0 ? (
          <div className="rooms-grid">
            {recentRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onInvite={(room) => {
                  setSelectedRoom(room);
                  setShowInviteUser(true);
                }}
                onDelete={(room) => {
                  setSelectedRoom(room);
                  setShowDeleteRoom(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No Rooms Found</h3>
            <p>You haven't created or joined any rooms yet.</p>
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