import React, { useState } from 'react';
import { FileCode, FilePlus, Edit2, Trash2, ChevronRight, Folder } from 'lucide-react';
import { useEditorContext } from '../../context/EditorContext';

const FileExplorer = () => {
  const { files, activeFile, openFile, createFile, renameFile, deleteFile } = useEditorContext();
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [editingPath, setEditingPath] = useState(null);
  const [editName, setEditName] = useState('');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (newFileName.trim()) {
      createFile(newFileName.trim());
    }
    setNewFileName('');
    setIsCreating(false);
  };

  const handleRenameSubmit = (oldPath, e) => {
    e.preventDefault();
    if (editName.trim()) {
      renameFile(oldPath, editName.trim());
    }
    setEditingPath(null);
    setEditName('');
  };

  return (
    <div className="file-explorer-sidebar" style={{ width: '220px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: '100%', userSelect: 'none' }}>
      
      {/* File Explorer Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid var(--border-color)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 700 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Folder size={14} color="var(--accent-primary)" /> EXPLORER
        </span>
        <button
          onClick={() => setIsCreating(true)}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
          title="New File"
        >
          <FilePlus size={16} />
        </button>
      </div>

      {/* File Creation Input */}
      {isCreating && (
        <form onSubmit={handleCreateSubmit} style={{ padding: '6px 12px' }}>
          <input
            type="text"
            className="file-input"
            autoFocus
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onBlur={() => setIsCreating(false)}
            placeholder="filename.js..."
            style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--accent-primary)', color: 'var(--text-primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', outline: 'none' }}
          />
        </form>
      )}

      {/* File List Tree */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
        {files.map((file) => {
          const isActive = activeFile === file.path;
          const isRenaming = editingPath === file.path;

          return (
            <div
              key={file.path}
              className={`file-item ${isActive ? 'active' : ''}`}
              onClick={() => openFile(file.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 14px',
                fontSize: '13px',
                cursor: 'pointer',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                borderLeft: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent'
              }}
            >
              {isRenaming ? (
                <form onSubmit={(e) => handleRenameSubmit(file.path, e)} style={{ flex: 1 }}>
                  <input
                    type="text"
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => setEditingPath(null)}
                    style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--accent-primary)', color: 'var(--text-primary)', padding: '2px 6px', borderRadius: '3px', fontSize: '12px' }}
                  />
                </form>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <FileCode size={15} color={isActive ? 'var(--accent-primary)' : '#94a3b8'} />
                  {file.name}
                </span>
              )}

              {/* Action Buttons (Rename / Delete) */}
              <div className="file-actions" style={{ display: 'flex', gap: '4px', opacity: isActive ? 1 : 0.6 }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingPath(file.path);
                    setEditName(file.name);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
                  title="Rename File"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(file.path);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '2px' }}
                  title="Delete File"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FileExplorer;
