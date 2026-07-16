import React from 'react';
import DrawingTools from './DrawingTools';
import './Whiteboard.css';

const Toolbar = () => {
  return (
    <div className="whiteboard-toolbar">
      <DrawingTools />
    </div>
  );
};

export default Toolbar;