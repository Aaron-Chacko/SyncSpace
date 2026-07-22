import React, { useState, useRef, useEffect, useCallback } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import { EditorProvider, useEditorContext } from '../../context/EditorContext';
import FileExplorer from './FileExplorer';
import TabBar from './TabBar';
import LanguageSelector from './LanguageSelector';
import { useSocketContext } from '../../context/SocketContext';
import './Editor.css';

// Supported Languages for Selector
export const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' }
];

export const THEMES = [
  { value: 'vs-dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'hc-black', label: 'High Contrast' }
];

const InnerCodeEditor = () => {
  const { currentFile, updateFileContent, setFilesRaw } = useEditorContext();
  const { roomId } = useParams();
  const socket = useSocketContext();
  const activeRoom = roomId || 'default-room';

  // Monaco and Editor configuration state
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState('on');
  const [minimap, setMinimap] = useState(false);
  const [lineNumbers, setLineNumbers] = useState('on');
  const [saveStatus, setSaveStatus] = useState('✅ Saved');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());

  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // Sync cursor & presence states
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [remoteCursors, setRemoteCursors] = useState([]);

  // Setup sockets and listen for collaborative changes
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

  // Handle editor contents changes
  const handleEditorChange = (value) => {
    if (currentFile) {
      const newCode = value || '';
      updateFileContent(currentFile.path, newCode);
      setSaveStatus('⏳ Saving...');
      setIsSaving(true);

      // Broadcast changes to active room collaborators
      if (socket) {
        socket.emit('code-change', {
          room: activeRoom,
          filePath: currentFile.path,
          content: newCode
        });
      }

      setTimeout(() => {
        setSaveStatus('✅ Saved');
        setIsSaving(false);
        setLastSaved(new Date());
      }, 500);
    }
  };

  // Mount callback
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  // Action handlers
  const handleLanguageChange = (newLang) => {
    if (currentFile) {
      setFilesRaw((prev) =>
        prev.map((f) => (f.path === currentFile.path ? { ...f, language: newLang } : f))
      );
    }
  };

  const handleThemeChange = (newTheme) => {
    setEditorTheme(newTheme);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
  };

  const handleWordWrapToggle = () => {
    setWordWrap((prev) => (prev === 'on' ? 'off' : 'on'));
  };

  const handleMinimapToggle = () => {
    setMinimap((prev) => !prev);
  };

  const handleLineNumbersToggle = () => {
    setLineNumbers((prev) => (prev === 'on' ? 'off' : 'on'));
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const handleManualSave = () => {
    setSaveStatus('⏳ Saving...');
    setIsSaving(true);
    setTimeout(() => {
      setSaveStatus('✅ Saved');
      setIsSaving(false);
      setLastSaved(new Date());
    }, 400);
  };

  return (
    <div className="code-editor-container">
      <FileExplorer />
      
      <div className="editor-main-area">
        <TabBar />
        
        <LanguageSelector
          language={currentFile ? currentFile.language : 'javascript'}
          onLanguageChange={handleLanguageChange}
          theme={editorTheme}
          onThemeChange={handleThemeChange}
          fontSize={fontSize}
          onFontSizeChange={handleFontSizeChange}
          wordWrap={wordWrap}
          onWordWrapToggle={handleWordWrapToggle}
          minimap={minimap}
          onMinimapToggle={handleMinimapToggle}
          lineNumbers={lineNumbers}
          onLineNumbersToggle={handleLineNumbersToggle}
          onFormatCode={handleFormatCode}
          onSave={handleManualSave}
          saveStatus={saveStatus}
          isSaving={isSaving}
          lastSaved={lastSaved}
          isCollaborative={true}
          connectedUsers={connectedUsers}
        />

        <div className="editor-wrapper">
          <MonacoEditor
            height="100%"
            language={currentFile ? currentFile.language : 'javascript'}
            theme={editorTheme}
            value={currentFile ? currentFile.content : ''}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              automaticLayout: true,
              fontSize: fontSize,
              minimap: { enabled: minimap },
              wordWrap: wordWrap,
              lineNumbers: lineNumbers,
              scrollBeyondLastLine: false,
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
