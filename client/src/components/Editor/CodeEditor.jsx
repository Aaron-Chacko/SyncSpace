import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import useEditor from '../../hooks/useEditor';
import LanguageSelector from './LanguageSelector';
import './Editor.css';

const CodeEditor = () => {
  const { code, handleEditorChange, language } = useEditor();

  return (
    <div className="code-editor-container">
      <LanguageSelector />
      <div className="editor-wrapper">
        <MonacoEditor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            automaticLayout: true,
            fontSize: 14,
            minimap: { enabled: true }
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;