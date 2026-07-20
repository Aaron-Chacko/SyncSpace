import React, { useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import { EditorProvider, useEditorContext } from '../../context/EditorContext';
import FileExplorer from './FileExplorer';
import TabBar from './TabBar';
import LanguageSelector from './LanguageSelector';
import { useSocketContext } from '../../context/SocketContext';
import './Editor.css';

const InnerCodeEditor = () => {
  const { currentFile, updateFileContent, setFilesRaw } = useEditorContext();
  const { roomId } = useParams();
  const socket = useSocketContext();
  const activeRoom = roomId || 'default-room';

  // Listen for real-time code updates over WebSockets
  useEffect(() => {
    if (!socket) return;

    socket.emit('join-room', activeRoom);

    const handleCodeChange = (data) => {
      if (data && data.filePath && data.content !== undefined) {
        setFilesRaw((prev) =>
          prev.map((f) => (f.path === data.filePath ? { ...f, content: data.content } : f))
        );
      }
    };

    socket.on('code-change', handleCodeChange);

    return () => {
      socket.off('code-change', handleCodeChange);
    };
  }, [socket, activeRoom, setFilesRaw]);

  const handleEditorChange = (value) => {
    if (currentFile) {
      const newCode = value || '';
      updateFileContent(currentFile.path, newCode);

      if (socket) {
        socket.emit('code-change', {
          room: activeRoom,
          filePath: currentFile.path,
          content: newCode
        });
      }
    }
  };

  return (
    <div className="code-editor-container">
      <FileExplorer />
      
      <div className="editor-main-area">
        <TabBar />
        <LanguageSelector />
        <div className="editor-wrapper">
          <MonacoEditor
            height="100%"
            language={currentFile ? currentFile.language : 'javascript'}
            theme="vs-dark"
            value={currentFile ? currentFile.content : ''}
            onChange={handleEditorChange}
            options={{
              automaticLayout: true,
              fontSize: 14,
              fontFamily: 'var(--font-mono)',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              padding: { top: 12, bottom: 12 }
            }}
          />
        </div>
      </div>
    </div>
  );
};

const CodeEditor = () => {
  return (
    <EditorProvider>
      <InnerCodeEditor />
    </EditorProvider>
  );
};

export default CodeEditor;