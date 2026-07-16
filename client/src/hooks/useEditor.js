import { useState, useCallback } from 'react';

const useEditor = () => {
  const [code, setCode] = useState('// Welcome to SyncSpace Editor');
  const [language, setLanguage] = useState('javascript');

  const handleEditorChange = useCallback((value) => {
    setCode(value);
  }, []);

  return { code, handleEditorChange, language, setLanguage };
};

export default useEditor;