import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const { data } = await api.post(`/rooms/${roomCode.trim().toUpperCase()}/join`);
      navigate(`/room/${data.room.roomCode}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to join room.");
    }
  };

  return <div className="join-room-card"><h2>Join Room</h2><form onSubmit={handleSubmit}>
    {error && <p role="alert">{error}</p>}
    <div className="form-group"><label>Room Code</label><input type="text" placeholder="Enter Room Code" value={roomCode} onChange={(event) => setRoomCode(event.target.value)} required /></div>
    <button type="submit" className="secondary-btn">Join Room</button>
  </form></div>;
};

export default JoinRoom;
