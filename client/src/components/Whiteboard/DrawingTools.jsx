import React from 'react';
import { MousePointer, Hand, Pencil, Minus, ArrowRight, Square, Circle, Disc, StickyNote, Type, Image as ImageIcon, Eraser } from 'lucide-react';
import useWhiteboard from '../../hooks/useWhiteboard';
import './Whiteboard.css';

const DrawingTools = () => {
  const { tool, setTool, setSelectedId } = useWhiteboard();

  const handleSelectTool = (newTool) => {
    setTool(newTool);
    if (newTool !== 'select') {
      setSelectedId(null);
    }
  };

  return (
    <div className="drawing-tools">
      <button
        title="Selection Tool (Select, Move, Resize)"
        className={tool === 'select' ? 'active' : ''}
        onClick={() => handleSelectTool('select')}
      >
        <MousePointer size={18} />
      </button>
      <button
        title="Pan / Hand Tool"
        className={tool === 'pan' ? 'active' : ''}
        onClick={() => handleSelectTool('pan')}
      >
        <Hand size={18} />
      </button>
      <button
        title="Pencil (Freehand)"
        className={tool === 'pencil' ? 'active' : ''}
        onClick={() => handleSelectTool('pencil')}
      >
        <Pencil size={18} />
      </button>
      <button
        title="Straight Line"
        className={tool === 'line' ? 'active' : ''}
        onClick={() => handleSelectTool('line')}
      >
        <Minus size={18} style={{ transform: 'rotate(-45deg)' }} />
      </button>
      <button
        title="Arrow Line"
        className={tool === 'arrow' ? 'active' : ''}
        onClick={() => handleSelectTool('arrow')}
      >
        <ArrowRight size={18} style={{ transform: 'rotate(-45deg)' }} />
      </button>
      <button
        title="Rectangle"
        className={tool === 'rectangle' ? 'active' : ''}
        onClick={() => handleSelectTool('rectangle')}
      >
        <Square size={18} />
      </button>
      <button
        title="Circle"
        className={tool === 'circle' ? 'active' : ''}
        onClick={() => handleSelectTool('circle')}
      >
        <Circle size={18} />
      </button>
      <button
        title="Ellipse"
        className={tool === 'ellipse' ? 'active' : ''}
        onClick={() => handleSelectTool('ellipse')}
      >
        <Disc size={18} />
      </button>
      <button
        title="Sticky Note"
        className={tool === 'sticky' ? 'active' : ''}
        onClick={() => handleSelectTool('sticky')}
      >
        <StickyNote size={18} />
      </button>
      <button
        title="Text"
        className={tool === 'text' ? 'active' : ''}
        onClick={() => handleSelectTool('text')}
      >
        <Type size={18} />
      </button>
      <button
        title="Image Upload"
        className={tool === 'image' ? 'active' : ''}
        onClick={() => handleSelectTool('image')}
      >
        <ImageIcon size={18} />
      </button>
      <button
        title="Eraser"
        className={tool === 'eraser' ? 'active' : ''}
        onClick={() => handleSelectTool('eraser')}
      >
        <Eraser size={18} />
      </button>
    </div>
  );
};

export default DrawingTools;