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