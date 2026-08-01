import React, { useState } from "react";
import CreateRoom from "../components/Dashboard/CreateRoom";
import JoinRoom from "../components/Dashboard/JoinRoom";
import RoomCard from "../components/Dashboard/RoomCard";
import Modal from "../components/Shared/Modal";
import DeleteRoom from "../components/Dashboard/DeleteRoom";
import InviteUser from "../components/Dashboard/InviteUser";
import Sidebar from "../components/Shared/Sidebar";
import DashboardBanner from "../components/Dashboard/DashboardBanner";
import DashboardStats from "../components/Dashboard/DashboardStats";

const Dashboard = () => {
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
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-page">

        <DashboardBanner />

        <DashboardStats
          totalRooms={recentRooms.length}
          totalMembers={recentRooms.reduce(
            (sum, room) => sum + room.members,
            0
          )}
          activeRooms={recentRooms.length}
          filesShared={0}
        />


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
          <CreateRoom />
        </Modal>

        {/* Join Room Modal */}
        <Modal
          isOpen={showJoinRoom}
          onClose={() => setShowJoinRoom(false)}
          title="Join Room"
        >
          <JoinRoom />
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
    </div>
  );
};

export default Dashboard;