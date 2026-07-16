import React, { useState } from 'react';

const CreateRoom = ({ onCreate }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name);
      setName('');
    }
  };

  return (
    <form className="create-room-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="Room Name" value={name} onChange={e => setName(e.target.value)} required />
      <button type="submit">Create Room</button>
    </form>
  );
};

export default CreateRoom;