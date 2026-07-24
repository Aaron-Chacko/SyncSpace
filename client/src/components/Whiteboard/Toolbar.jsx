import React from 'react';
import { Undo, Redo, Trash2, Palette, ZoomIn, ZoomOut, Maximize2, Download, ArrowUp, ArrowDown, Copy, CopyPlus, Trash, PaintBucket } from 'lucide-react';
import { useParams } from 'react-router-dom';
import useWhiteboard from '../../hooks/useWhiteboard';
import { useSocketContext } from '../../context/SocketContext';
import DrawingTools from './DrawingTools';
import './Whiteboard.css';

const Toolbar = () => {
  const { roomId } = useParams();
  const socket = useSocketContext();
  const activeRoom = roomId || 'default-room';

  const {
    color,
    setColor,
    fillColor,
    setFillColor,
    opacity,
    setOpacity,
    strokeWidth,
    setStrokeWidth,
    undo,
    redo,
    clearCanvas,
    exportAsImage,
    selectedId,
    deleteSelected,
    bringToFront,
    sendToBack,
    copySelected,
    duplicateSelected,
    canUndo,
    canRedo,
    stageScale,
    setStageScale,
    setStagePos
  } = useWhiteboard();

  const strokePresets = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ffffff'];

  const handleZoomIn = () => {
    setStageScale((prev) => Math.min(10, prev * 1.15));
  };

  const handleZoomOut = () => {
    setStageScale((prev) => Math.max(0.1, prev / 1.15));
  };

  const handleZoomReset = () => {
    setStageScale(1);
    setStagePos({ x: 0, y: 0 });
  };

  const handleClear = () => {
    clearCanvas();
    if (socket) {
      socket.emit('clear-canvas', { room: activeRoom });
    }
  };

  return (
    <div className="whiteboard-toolbar">
      <DrawingTools />
      
      <div className="toolbar-divider" />
      
      {/* Stroke Colors */}
      <div className="color-section" title="Stroke Color">
        {strokePresets.map((c) => (
          <button
            key={c}
            className={`color-preset ${color === c ? 'active' : ''}`}
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
          />
        ))}
        <label className="custom-color-picker" title="Stroke Color">
          <Palette size={16} />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
      </div>

      <div className="toolbar-divider" />

      {/* Fill Color */}
      <div className="color-section" title="Fill Color">
        <label className="custom-color-picker" title="Fill Color">
          <PaintBucket size={16} color={fillColor === 'transparent' ? '#94a3b8' : fillColor} />
          <input
            type="color"
            value={fillColor === 'transparent' ? '#ffffff' : fillColor}
            onChange={(e) => setFillColor(e.target.value)}
          />
        </label>
        <button
          className={`color-preset ${fillColor === 'transparent' ? 'active' : ''}`}
          style={{ background: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '8px 8px', border: '1px solid var(--border-color)' }}
          onClick={() => setFillColor('transparent')}
          title="Transparent Fill"
        />
      </div>

      <div className="toolbar-divider" />

      {/* Brush Size & Opacity */}
      <div className="size-section" title="Stroke Width">
        <span className="size-label">{strokeWidth}px</span>
        <input
          type="range"
          min="1"
          max="30"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          className="size-slider"
        />
      </div>

      <div className="size-section" title="Opacity">
        <span className="size-label">{Math.round(opacity * 100)}%</span>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="size-slider"
        />
      </div>

      <div className="toolbar-divider" />

      {/* Selected Object Manipulation Controls */}
      {selectedId && (
        <>
          <div className="history-section" title="Object Controls">
            <button onClick={bringToFront} title="Bring to Front" className="icon-button">
              <ArrowUp size={16} />
            </button>
            <button onClick={sendToBack} title="Send to Back" className="icon-button">
              <ArrowDown size={16} />
            </button>
            <button onClick={copySelected} title="Copy Selected" className="icon-button">
              <Copy size={16} />
            </button>
            <button onClick={duplicateSelected} title="Duplicate Selected" className="icon-button">
              <CopyPlus size={16} />
            </button>
            <button onClick={deleteSelected} title="Delete Selected" className="icon-button delete-button">
              <Trash size={16} />
            </button>
          </div>
          <div className="toolbar-divider" />
        </>
      )}

      {/* Zoom Controls */}
      <div className="zoom-section">
        <button onClick={handleZoomOut} title="Zoom Out" className="icon-button">
          <ZoomOut size={16} />
        </button>
        <span className="zoom-percentage" onClick={handleZoomReset} title="Reset Zoom" style={{ cursor: 'pointer', fontSize: '11px', color: 'var(--text-secondary)', minWidth: '38px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
          {Math.round(stageScale * 100)}%
        </span>
        <button onClick={handleZoomIn} title="Zoom In" className="icon-button">
          <ZoomIn size={16} />
        </button>
        <button onClick={handleZoomReset} title="Reset Viewport" className="icon-button">
          <Maximize2 size={15} />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* History & Action Controls */}
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
          onClick={() => exportAsImage()}
          title="Export Canvas as PNG Image"
          className="icon-button download-button"
        >
          <Download size={18} />
        </button>
        <button
          onClick={handleClear}
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