import React from 'react';
import useEditor from '../../hooks/useEditor';
import './Editor.css';

const LanguageSelector = () => {
  const { language, setLanguage } = useEditor();

  return (
    <div className="language-selector">
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
      </select>
    </div>
  );
};

export default LanguageSelector;