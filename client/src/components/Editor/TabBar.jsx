import React from 'react';
import { X, FileCode } from 'lucide-react';
import { useEditorContext } from '../../context/EditorContext';

const TabBar = () => {
  const { openTabs, activeFile, openFile, closeTab, files } = useEditorContext();

  return (
    <div className="editor-tab-bar" style={{ display: 'flex', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', overflowX: 'auto', userSelect: 'none' }}>
      {openTabs.map((tabPath) => {
        const fileObj = files.find((f) => f.path === tabPath) || { name: tabPath };
        const isActive = activeFile === tabPath;

        return (
          <div
            key={tabPath}
            className={`tab-item ${isActive ? 'active' : ''}`}
            onClick={() => openFile(tabPath)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              background: isActive ? 'var(--bg-secondary)' : 'transparent',
              color: isActive ? '#ffffff' : 'var(--text-secondary)',
              borderTop: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
              borderRight: '1px solid var(--border-color)',
              minWidth: '120px',
              justifyContent: 'space-between'
            }}
          >
            <FileCode size={14} color={isActive ? 'var(--accent-primary)' : '#94a3b8'} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {fileObj.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tabPath);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '3px'
              }}
              title="Close Tab"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default TabBar;
