import React, { createContext, useContext, useState, useCallback } from 'react';

const EditorContext = createContext(null);

const DEFAULT_FILES = [
  {
    path: 'index.js',
    name: 'index.js',
    language: 'javascript',
    content: '// Welcome to SyncSpace Collaborative Editor (ESM)\n\nfunction calculateSum(a, b) {\n  return a + b;\n}\n\nconsole.log("Sum:", calculateSum(10, 20));\n'
  },
  {
    path: 'styles.css',
    name: 'styles.css',
    language: 'css',
    content: '/* VS Code Dark Editor Theme */\n.container {\n  display: flex;\n  background-color: #1e1e1e;\n  color: #d4d4d4;\n}\n'
  },
  {
    path: 'script.py',
    name: 'script.py',
    language: 'python',
    content: '# Python Data Analytics Script\nimport math\n\ndef square_root(num):\n    return math.sqrt(num)\n\nprint("Square root of 16 is", square_root(16))\n'
  }
];

export const EditorProvider = ({ children }) => {
  const [files, setFiles] = useState(DEFAULT_FILES);
  const [activeFile, setActiveFile] = useState('index.js');
  const [openTabs, setOpenTabs] = useState(['index.js', 'styles.css', 'script.py']);

  const getLanguageFromFilename = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'py':
        return 'python';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'cpp':
      case 'c':
        return 'cpp';
      case 'java':
        return 'java';
      default:
        return 'plaintext';
    }
  };

  const openFile = useCallback((path) => {
    setActiveFile(path);
    if (!openTabs.includes(path)) {
      setOpenTabs((prev) => [...prev, path]);
    }
  }, [openTabs]);

  const closeTab = useCallback((path) => {
    setOpenTabs((prev) => {
      const nextTabs = prev.filter((t) => t !== path);
      if (activeFile === path && nextTabs.length > 0) {
        setActiveFile(nextTabs[nextTabs.length - 1]);
      }
      return nextTabs;
    });
  }, [activeFile]);

  const createFile = useCallback((fileName) => {
    if (!fileName || !fileName.trim()) return;
    const cleanName = fileName.trim();
    if (files.some((f) => f.path === cleanName)) return;

    const newFile = {
      path: cleanName,
      name: cleanName,
      language: getLanguageFromFilename(cleanName),
      content: `// New file: ${cleanName}\n`
    };

    setFiles((prev) => [...prev, newFile]);
    setOpenTabs((prev) => [...prev, cleanName]);
    setActiveFile(cleanName);
  }, [files]);

  const renameFile = useCallback((oldPath, newName) => {
    if (!newName || !newName.trim()) return;
    const cleanName = newName.trim();
    if (files.some((f) => f.path === cleanName)) return;

    const newLang = getLanguageFromFilename(cleanName);

    setFiles((prev) =>
      prev.map((f) => (f.path === oldPath ? { ...f, path: cleanName, name: cleanName, language: newLang } : f))
    );
    setOpenTabs((prev) => prev.map((t) => (t === oldPath ? cleanName : t)));
    if (activeFile === oldPath) {
      setActiveFile(cleanName);
    }
  }, [files, activeFile]);

  const deleteFile = useCallback((path) => {
    if (files.length <= 1) return; // keep at least one file
    setFiles((prev) => prev.filter((f) => f.path !== path));
    closeTab(path);
  }, [files, closeTab]);

  const updateFileContent = useCallback((path, newContent) => {
    setFiles((prev) =>
      prev.map((f) => (f.path === path ? { ...f, content: newContent } : f))
    );
  }, []);

  const currentFile = files.find((f) => f.path === activeFile) || files[0];

  return (
    <EditorContext.Provider
      value={{
        files,
        activeFile,
        currentFile,
        openTabs,
        openFile,
        closeTab,
        createFile,
        renameFile,
        deleteFile,
        updateFileContent,
        setFilesRaw: setFiles
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => useContext(EditorContext);
