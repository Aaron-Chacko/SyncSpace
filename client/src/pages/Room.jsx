import React from 'react';
import { useParams } from 'react-router-dom';
import Canvas from '../components/Whiteboard/Canvas';
import CodeEditor from '../components/Editor/CodeEditor';
import { WhiteboardProvider } from '../context/WhiteboardContext';
import { Code2, Edit3, Users, ShieldCheck } from 'lucide-react';

const Room = () => {
  const { roomId } = useParams();

  return (
    <WhiteboardProvider>
      <div className="page room-page" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 58px)', background: 'var(--bg-primary)', overflow: 'hidden', boxSizing: 'border-box' }}>
        
        {/* Compact Room Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '8px 16px', borderBottom: '1px solid var(--border-color)', height: '42px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="var(--accent-primary)" /> Room ID: <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>{roomId || 'demo'}</span>
            </span>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> Live Sync Active
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={14} color="var(--accent-primary)" /> Active Room Session
            </span>
          </div>
        </div>

        {/* 50/50 Split Workspace (Whiteboard Left | Editor Right) */}
        <div style={{ flex: 1, display: 'flex', gap: '12px', padding: '12px', minHeight: 0, overflow: 'hidden' }}>
          
          {/* LEFT 50%: Whiteboard Canvas */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0, overflow: 'hidden', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0 }}>
              <Edit3 size={14} color="var(--accent-primary)" />
              <span>Interactive Whiteboard</span>
            </div>
            <div style={{ flex: 1, position: 'relative', minHeight: 0, overflow: 'hidden' }}>
              <Canvas />
            </div>
          </div>

          {/* RIGHT 50%: Monaco Code Editor */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0, overflow: 'hidden', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0 }}>
              <Code2 size={14} color="#06b6d4" />
              <span>Collaborative Code Editor</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
              <CodeEditor />
            </div>
          </div>

        </div>
      </div>
    </WhiteboardProvider>
  );
};

export default Room;