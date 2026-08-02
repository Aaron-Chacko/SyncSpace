import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/rooms", { roomName, description });
      navigate(`/room/${data.room.roomCode}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create room.");
    }
  };

 return (
  <div className="dashboard-form-card">
    <h2>Create Room</h2>

    <form onSubmit={handleSubmit}>
      {error && <p role="alert">{error}</p>}

      <div className="form-group">
        <label htmlFor="roomName">Room Name</label>

        <input
          id="roomName"
          type="text"
          placeholder="Enter room name"
          aria-label="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>

        <textarea
          id="description"
          rows="4"
          placeholder="Enter room description"
          aria-label="Room Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="primary-btn"
        aria-label="Create Room"
      >
        Create Room
      </button>
    </form>
  </div>
);
};

export default CreateRoom;
