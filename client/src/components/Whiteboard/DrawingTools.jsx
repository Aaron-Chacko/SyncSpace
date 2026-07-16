import React from 'react';
import { Pencil, Square, Circle, Eraser, Type, Grid } from 'lucide-react';
import './Whiteboard.css';

const DrawingTools = () => {
  return (
    <div className="drawing-tools">
      <button title="Pencil"><Pencil size={20} /></button>
      <button title="Rectangle"><Square size={20} /></button>
      <button title="Circle"><Circle size={20} /></button>
      <button title="Eraser"><Eraser size={20} /></button>
      <button title="Text"><Type size={20} /></button>
      <button title="Grid"><Grid size={20} /></button>
    </div>
  );
};

export default DrawingTools;