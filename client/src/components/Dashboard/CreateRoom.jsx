import React, { useState } from "react";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      roomName,
      description,
    });

    alert("Room UI Ready! Backend integration will be added later.");

    setRoomName("");
    setDescription("");
  };

  return (
    <div className="dashboard-form-card">
      <h2>Create Room</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Room Name</label>

          <input
            type="text"
            placeholder="Enter room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>

          <textarea
            rows="4"
            placeholder="Enter room description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit" className="primary-btn">
          Create Room
        </button>
      </form>
    </div>
  );
};

export default CreateRoom;