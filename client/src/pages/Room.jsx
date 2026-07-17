import React from 'react';
import { useParams } from 'react-router-dom';
import Canvas from '../components/Whiteboard/Canvas';
import CodeEditor from '../components/Editor/CodeEditor';
import Sidebar from '../components/Shared/Sidebar';
import { WhiteboardProvider } from '../context/WhiteboardContext';

const Room = () => {
  const { roomId } = useParams();

  return (
    <WhiteboardProvider>
      <div className="page room-page" style={{ flex: 1, display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', padding: '20px', gap: '20px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <h3>Whiteboard</h3>
            <Canvas />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3>Editor</h3>
            <CodeEditor />
          </div>
        </div>
      </div>
    </WhiteboardProvider>
  );
};

export default Room;