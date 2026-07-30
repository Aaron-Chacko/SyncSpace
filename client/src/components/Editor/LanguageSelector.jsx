// src/components/LanguageSelector.jsx
import React, { useState } from 'react';
import { Play, Save, Braces, RotateCcw, Settings, FileCode, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from './CodeEditor';

// Helper to get file details and colors
const getFileDetails = (langValue) => {
  const mapping = {
    javascript: { name: 'index.js', color: '#eab308' },
    typescript: { name: 'index.ts', color: '#2563eb' },
    python: { name: 'main.py', color: '#387eb8' },
    java: { name: 'Main.java', color: '#ea2d2e' },
    cpp: { name: 'main.cpp', color: '#00599c' },
    c: { name: 'main.c', color: '#a8b9cc' },
    go: { name: 'main.go', color: '#00add8' },
    rust: { name: 'main.rs', color: '#dea584' },
    ruby: { name: 'main.rb', color: '#cc342d' },
    php: { name: 'index.php', color: '#777bb4' },
    html: { name: 'index.html', color: '#e34f26' },
    css: { name: 'styles.css', color: '#1572b6' },
    json: { name: 'package.json', color: '#cbcb41' },
    markdown: { name: 'README.md', color: '#083fa6' },
  };
  return mapping[langValue] || { name: 'file.txt', color: '#a0a0a0' };
};

const LanguageSelector = ({
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  fontSize,
  onFontSizeChange,
  wordWrap,
  onWordWrapToggle,
  minimap,
  onMinimapToggle,
  lineNumbers,
  onLineNumbersToggle,
  onFormatCode,
  onSave,
  onRun,
  onResetCode,
  isSaving,
  isCollaborative,
  connectedUsers,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const fileDetails = getFileDetails(language);

  return (
    <div className="vs-tab-bar">
      {/* File Tabs - Flat, Rectangular Codespace Style */}
      <div className="vs-tabs-left">
        <div className="vs-tab active">
          <FileCode size={14} color={fileDetails.color} className="vs-file-icon" />
          <span className="vs-tab-title">{fileDetails.name}</span>
        </div>

        {/* Dropdown styled as a clean select menu */}
        <div className="vs-quick-lang">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="vs-lang-select"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          <ChevronDown size={11} className="vs-dropdown-caret" />
        </div>
      </div>

      {/* Action Controls - Flat, Monochromatic Minimal Buttons */}
      <div className="vs-tabs-right">
        {isCollaborative && (
          <div className="vs-collaborator-count" title={`${connectedUsers.length + 1} users connected`}>
            <span className="vs-pulse-indicator"></span>
            <span>{connectedUsers.length + 1} online</span>
          </div>
        )}

        <div className="vs-actions-wrapper">
          {/* Run button */}
          <button
            onClick={onRun}
            className="vs-action-btn run-btn"
            title="Run Code (Ctrl+Enter)"
          >
            <Play size={13} className="vs-action-icon" />
            <span>Run</span>
          </button>

          {/* Submit button */}
          <button
            onClick={onSave}
            disabled={isSaving}
            className="vs-action-btn save-btn"
            title="Save and Sync (Ctrl+S)"
          >
            <Save size={13} className="vs-action-icon" />
            <span>{isSaving ? 'Saving...' : 'Sync'}</span>
          </button>

          {/* Format button */}
          <button
            onClick={onFormatCode}
            className="vs-action-btn-icon"
            title="Format Document"
          >
            <Braces size={13} />
          </button>

          {/* Reset button */}
          <button
            onClick={onResetCode}
            className="vs-action-btn-icon"
            title="Reset Template"
          >
            <RotateCcw size={13} />
          </button>

          {/* Settings button */}
          <div className="vs-settings-container">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`vs-action-btn-icon ${showSettings ? 'active' : ''}`}
              title="Editor Preferences"
            >
              <Settings size={13} />
            </button>

            {showSettings && (
              <div className="vs-settings-dropdown">
                <div className="vs-settings-header">Preferences</div>
                
                <div className="vs-settings-row">
                  <span>Font Size</span>
                  <select
                    value={fontSize}
                    onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
                    className="vs-settings-select"
                  >
                    {[12, 13, 14, 15, 16, 18, 20].map((size) => (
                      <option key={size} value={size}>{size}px</option>
                    ))}
                  </select>
                </div>

                <div className="vs-settings-row">
                  <span>Theme</span>
                  <select
                    value={theme}
                    onChange={(e) => onThemeChange(e.target.value)}
                    className="vs-settings-select"
                  >
                    <option value="syncspace-dark">SyncSpace Minimal</option>
                    <option value="vs-dark">VS Dark</option>
                    <option value="light">Light</option>
                    <option value="hc-black">High Contrast</option>
                  </select>
                </div>

                <div className="vs-settings-row">
                  <span>Word Wrap</span>
                  <button
                    onClick={onWordWrapToggle}
                    className={`vs-settings-toggle-btn ${wordWrap === 'on' ? 'on' : ''}`}
                  >
                    {wordWrap === 'on' ? 'On' : 'Off'}
                  </button>
                </div>

                <div className="vs-settings-row">
                  <span>Minimap</span>
                  <button
                    onClick={onMinimapToggle}
                    className={`vs-settings-toggle-btn ${minimap ? 'on' : ''}`}
                  >
                    {minimap ? 'On' : 'Off'}
                  </button>
                </div>

                <div className="vs-settings-row">
                  <span>Line Numbers</span>
                  <button
                    onClick={onLineNumbersToggle}
                    className={`vs-settings-toggle-btn ${lineNumbers === 'on' ? 'on' : ''}`}
                  >
                    {lineNumbers === 'on' ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
