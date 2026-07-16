import React, { useRef, useEffect } from 'react';
import useWhiteboard from '../../hooks/useWhiteboard';
import './Whiteboard.css';

const Canvas = () => {
  const canvasRef = useRef(null);
  const { initWhiteboard } = useWhiteboard();

  useEffect(() => {
    if (canvasRef.current) {
      initWhiteboard(canvasRef.current);
    }
  }, [initWhiteboard]);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} id="whiteboard-canvas" />
    </div>
  );
};

export default Canvas;