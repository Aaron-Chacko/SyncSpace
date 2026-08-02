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

  return <div className="dashboard-form-card"><h2>Create Room</h2><form onSubmit={handleSubmit}>
    {error && <p role="alert">{error}</p>}
    <div className="form-group"><label>Room Name</label><input type="text" placeholder="Enter room name" value={roomName} onChange={(event) => setRoomName(event.target.value)} required /></div>
    <div className="form-group"><label>Description</label><textarea rows="4" placeholder="Enter room description" value={description} onChange={(event) => setDescription(event.target.value)} /></div>
    <button type="submit" className="primary-btn">Create Room</button>
  </form></div>;
};

export default CreateRoom;
