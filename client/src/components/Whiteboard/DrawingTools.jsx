import React from 'react';
import { Pencil, Square, Circle, Eraser, Type, Minus, Hand } from 'lucide-react';
import useWhiteboard from '../../hooks/useWhiteboard';
import './Whiteboard.css';

const DrawingTools = () => {
  const { tool, setTool } = useWhiteboard();

  return (
    <div className="drawing-tools">
      <button
        title="Pan/Hand Tool"
        className={tool === 'pan' ? 'active' : ''}
        onClick={() => setTool('pan')}
      >
        <Hand size={20} />
      </button>
      <button
        title="Pencil"
        className={tool === 'pencil' ? 'active' : ''}
        onClick={() => setTool('pencil')}
      >
        <Pencil size={20} />
      </button>
      <button
        title="Line"
        className={tool === 'line' ? 'active' : ''}
        onClick={() => setTool('line')}
      >
        <Minus size={20} style={{ transform: 'rotate(-45deg)' }} />
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