import React from 'react';
import { Pencil, Square, Circle, Eraser, Type, Grid } from 'lucide-react';
import useWhiteboard from '../../hooks/useWhiteboard';
import './Whiteboard.css';

const DrawingTools = () => {
  const { tool, setTool } = useWhiteboard();

  return (
    <div className="drawing-tools">
      <button
        title="Pencil"
        className={tool === 'pencil' ? 'active' : ''}
        onClick={() => setTool('pencil')}
      >
        <Pencil size={20} />
      </button>
      <button
        title="Rectangle"
        className={tool === 'rectangle' ? 'active' : ''}
        onClick={() => setTool('rectangle')}
      >
        <Square size={20} />
      </button>
      <button
        title="Circle"
        className={tool === 'circle' ? 'active' : ''}
        onClick={() => setTool('circle')}
      >
        <Circle size={20} />
      </button>
      <button
        title="Eraser"
        className={tool === 'eraser' ? 'active' : ''}
        onClick={() => setTool('eraser')}
      >
        <Eraser size={20} />
      </button>
      <button
        title="Text Tool"
        className={tool === 'text' ? 'active' : ''}
        onClick={() => setTool('text')}
      >
        <Type size={20} />
      </button>
    </div>
  );
};

export default DrawingTools;