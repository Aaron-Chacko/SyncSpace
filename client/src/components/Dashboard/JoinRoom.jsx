import React, { useState } from "react";

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend integration baad me hogi
    console.log({
      roomCode,
    });

    alert("Join Room UI Ready (Backend not connected)");

    setRoomCode("");
  };

  return (
    <div className="join-room-card">
      <h2>Join Room</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="roomCode">Room Code</label>

          <input
            id="roomCode"
            type="text"
            placeholder="Enter Room Code"
            aria-label="Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="secondary-btn"
          aria-label="Join Room"
        >
          Join Room
        </button>
      </form>
    </div>
  );
};

export default JoinRoom;