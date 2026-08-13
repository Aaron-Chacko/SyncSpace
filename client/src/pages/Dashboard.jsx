import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import CreateRoom from "../components/Dashboard/CreateRoom";
import JoinRoom from "../components/Dashboard/JoinRoom";
import RoomCard from "../components/Dashboard/RoomCard";
import Modal from "../components/Shared/Modal";
import DeleteRoom from "../components/Dashboard/DeleteRoom";
import InviteUser from "../components/Dashboard/InviteUser";
import Sidebar from "../components/Shared/Sidebar";
import DashboardBanner from "../components/Dashboard/DashboardBanner";
import DashboardStats from "../components/Dashboard/DashboardStats";
import { FolderPlus, Sparkles, PlusCircle, LogIn } from "lucide-react";

const Dashboard = () => {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [showDeleteRoom, setShowDeleteRoom] = useState(false);
  const [showInviteUser, setShowInviteUser] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/rooms");
      const formattedRooms = (data.rooms || []).map((r) => ({
        id: r.id || r._id,
        name: r.roomName,
        roomCode: r.roomCode,
        creator: r.creator?.name || "Host",
        activeUsersCount: r.participants?.length || 1,
        description: r.description || "Collaborative Room",
        createdDate: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : "Recently",
      }));
      setRooms(formattedRooms);
    } catch (err) {
      console.error("Failed to fetch user rooms:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleDeleteConfirm = async () => {
    if (!selectedRoom) return;
    setIsDeleting(true);
    try {
      await api.delete(`/rooms/${selectedRoom.id}`);
      setRooms((prev) => prev.filter((r) => r.id !== selectedRoom.id));
      setShowDeleteRoom(false);
      setSelectedRoom(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete room.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-page">
        <DashboardBanner onCreateRoom={() => { setShowCreateRoom(true); setShowJoinRoom(false); }} />

        <DashboardStats
          totalRooms={rooms.length}
          totalMembers={rooms.reduce(
            (sum, room) => sum + room.activeUsersCount,
            0
          )}
          activeRooms={rooms.length}
          filesShared={0}
        />

        {/* Action Buttons */}
        <div className="dashboard-actions">
          <button
            type="button"
            className="rich-action-btn-primary"
            aria-label="Create Room"
            onClick={() => {
              setShowCreateRoom(true);
              setShowJoinRoom(false);
            }}
          >
            <PlusCircle size={16} />
            <span>Create Room</span>
          </button>

          <button
            type="button"
            className="rich-action-btn-secondary"
            aria-label="Join Room"
            onClick={() => {
              setShowJoinRoom(true);
              setShowCreateRoom(false);
            }}
          >
            <LogIn size={16} />
            <span>Join Room</span>
          </button>
        </div>

        {/* Create Room Modal */}
        <Modal
          isOpen={showCreateRoom}
          onClose={() => {
            setShowCreateRoom(false);
            fetchRooms();
          }}
          title="Create Room"
        >
          <CreateRoom />
        </Modal>

        {/* Join Room Modal */}
        <Modal
          isOpen={showJoinRoom}
          onClose={() => {
            setShowJoinRoom(false);
            fetchRooms();
          }}
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
              onConfirm={handleDeleteConfirm}
              isDeleting={isDeleting}
            />
          )}
        </Modal>

        {/* Recent Rooms */}
        <section className="recent-rooms">
          <h2>Your Active Rooms</h2>

          {isLoading ? (
            <div style={{ color: "var(--text-secondary)", padding: "20px 0" }}>Loading workspace rooms...</div>
          ) : rooms.length > 0 ? (
            <div className="rooms-grid">
              {rooms.map((room) => (
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
            <div className="rich-empty-state-card">
              <div className="empty-state-icon-glow">
                <FolderPlus size={36} className="empty-glowing-icon" />
              </div>

              <h3 className="empty-state-title">No Active Rooms Found</h3>
              <p className="empty-state-subtitle">
                Create a collaborative workspace room or join an existing session to start real-time drawing and coding with your team.
              </p>

              <div className="empty-state-pills">
                <span className="empty-pill">⚡ Real-time Sync</span>
                <span className="empty-pill">💻 Monaco Editor</span>
                <span className="empty-pill">🎨 Interactive Whiteboard</span>
              </div>

              <button
                className="rich-empty-cta-btn"
                aria-label="Create Your First Room"
                onClick={() => {
                  setShowCreateRoom(true);
                  setShowJoinRoom(false);
                }}
              >
                <Sparkles size={16} />
                <span>Create Your First Room</span>
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;