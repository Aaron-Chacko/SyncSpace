import React from 'react';
import { useParams } from 'react-router-dom';
import Canvas from '../components/Whiteboard/Canvas';
import CodeEditor from '../components/Editor/CodeEditor';
import Sidebar from '../components/Shared/Sidebar';
import { WhiteboardProvider } from '../context/WhiteboardContext';
import { Code2, Edit3, Users } from 'lucide-react';

const Room = () => {
  const { roomId } = useParams();

  return (
    <WhiteboardProvider>
      <div className="page room-page" style={{ flex: 1, display: 'flex', height: 'calc(100vh - 60px)', background: 'var(--bg-primary)', overflow: 'hidden' }}>
        <Sidebar />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', gap: '16px', height: '100%' }}>
          
          {/* Room Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Room: <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>{roomId || 'demo'}</span>
              </span>
              <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> Live Session
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={15} color="var(--accent-primary)" /> Team Collaborators Active
              </span>
            </div>
          </div>

          {/* Split Screen Workspace (50% Whiteboard Left | 50% Editor Right) */}
          <div style={{ flex: 1, display: 'flex', gap: '16px', height: 'calc(100% - 60px)' }}>
            
            {/* LEFT SIDE: Interactive Whiteboard */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                <Edit3 size={15} color="var(--accent-primary)" />
                <span>Interactive Whiteboard</span>
              </div>
              <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Canvas />
              </div>
            </div>

            {/* RIGHT SIDE: Collaborative Code Editor */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                <Code2 size={15} color="#06b6d4" />
                <span>Collaborative Code Editor</span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CodeEditor />
              </div>
            </div>

          </div>
        </div>
      </div>
    </WhiteboardProvider>
  );
};

export default Room;