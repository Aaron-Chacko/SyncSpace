import React from 'react';
import { Undo, Redo, Trash2, Palette } from 'lucide-react';
import useWhiteboard from '../../hooks/useWhiteboard';
import DrawingTools from './DrawingTools';
import './Whiteboard.css';

const Toolbar = () => {
  const {
    color,
    setColor,
    strokeWidth,
    setStrokeWidth,
    undo,
    redo,
    clearCanvas,
    canUndo,
    canRedo
  } = useWhiteboard();

  const presets = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ffffff'];

  return (
    <div className="whiteboard-toolbar">
      <DrawingTools />
      
      <div className="toolbar-divider" />
      
      {/* Preset Colors */}
      <div className="color-section">
        {presets.map((c) => (
          <button
            key={c}
            className={`color-preset ${color === c ? 'active' : ''}`}
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
          />
        ))}
        {/* Custom Color Input */}
        <label className="custom-color-picker" title="Custom Color">
          <Palette size={16} />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
      </div>

      <div className="toolbar-divider" />

      {/* Brush Size */}
      <div className="size-section">
        <span className="size-label">{strokeWidth}px</span>
        <input
          type="range"
          min="2"
          max="30"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          className="size-slider"
        />
      </div>

      <div className="toolbar-divider" />

      {/* History Controls */}
      <div className="history-section">
        <button
          onClick={undo}
          disabled={!canUndo}
          title="Undo"
          className="icon-button"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          title="Redo"
          className="icon-button"
        >
          <Redo size={18} />
        </button>
        <button
          onClick={clearCanvas}
          title="Clear Whiteboard"
          className="icon-button delete-button"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;