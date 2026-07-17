import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text } from 'react-konva';
import useWhiteboard from '../../hooks/useWhiteboard';
import Toolbar from './Toolbar';
import './Whiteboard.css';

const Canvas = () => {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [newElement, setNewElement] = useState(null);
  const [textInput, setTextInput] = useState(null);
  const [textVal, setTextVal] = useState('');

  const {
    tool,
    color,
    strokeWidth,
    elements,
    setElements
  } = useWhiteboard();

  // for resize canvas 
  useEffect(() => {
    if (containerRef.current) {
      const handleResize = () => {
        setSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      };

      handleResize();
      
      // for ResizeObserver
      const observer = new ResizeObserver(handleResize);
      observer.observe(containerRef.current);

      return () => observer.disconnect();
    }
  }, []);

  const handleMouseDown = (e) => {
    // If clicking on text area input, ignore
    if (textInput) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (tool === 'text') {
      setTextInput({ x: point.x, y: point.y });
      setTextVal('');
      return;
    }

    setIsDrawing(true);

    if (tool === 'pencil' || tool === 'eraser') {
      setNewElement({
        id: Date.now().toString(),
        type: 'line',
        points: [point.x, point.y],
        color: tool === 'eraser' ? '#1a1c26' : color,
        strokeWidth,
        tool
      });
    } else if (tool === 'rectangle') {
      setNewElement({
        id: Date.now().toString(),
        type: 'rect',
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
        color,
        strokeWidth
      });
    } else if (tool === 'circle') {
      setNewElement({
        id: Date.now().toString(),
        type: 'circle',
        x: point.x,
        y: point.y,
        radius: 0,
        color,
        strokeWidth
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !newElement) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (newElement.type === 'line') {
      setNewElement({
        ...newElement,
        points: [...newElement.points, point.x, point.y]
      });
    } else if (newElement.type === 'rect') {
      setNewElement({
        ...newElement,
        width: point.x - newElement.x,
        height: point.y - newElement.y
      });
    } else if (newElement.type === 'circle') {
      const radius = Math.sqrt(
        Math.pow(point.x - newElement.x, 2) + Math.pow(point.y - newElement.y, 2)
      );
      setNewElement({
        ...newElement,
        radius
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (newElement) {
      if (
        (newElement.type === 'line' && newElement.points.length > 2) ||
        (newElement.type === 'rect' && Math.abs(newElement.width) > 1 && Math.abs(newElement.height) > 1) ||
        (newElement.type === 'circle' && newElement.radius > 1)
      ) {
        setElements([...elements, newElement]);
      }
      setNewElement(null);
    }
  };

  const handleTextSubmit = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveTextElement();
    }
  };

  const saveTextElement = () => {
    if (textVal.trim() && textInput) {
      const newTextEl = {
        id: Date.now().toString(),
        type: 'text',
        x: textInput.x,
        y: textInput.y,
        text: textVal,
        color,
        fontSize: strokeWidth * 3 + 14
      };
      setElements([...elements, newTextEl]);
    }
    setTextInput(null);
  };

  return (
    <div className="canvas-container" ref={containerRef}>
      <Toolbar />
      
      {/* HTML absolute textbox */}
      {textInput && (
        <textarea
          className="canvas-text-input"
          style={{
            position: 'absolute',
            top: textInput.y,
            left: textInput.x,
            color: color,
            fontSize: `${strokeWidth * 3 + 14}px`,
            fontFamily: 'inherit',
            background: 'rgba(18, 19, 26, 0.9)',
            border: '1px dashed var(--accent-primary)',
            borderRadius: '4px',
            outline: 'none',
            padding: '4px 8px',
            zIndex: 100,
            resize: 'both',
            overflow: 'hidden',
          }}
          autoFocus
          value={textVal}
          onChange={(e) => setTextVal(e.target.value)}
          onKeyDown={handleTextSubmit}
          onBlur={saveTextElement}
          placeholder="Type and press Enter..."
        />
      )}

      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          {elements.map((el) => {
            if (el.type === 'line') {
              return (
                <Line
                  key={el.id}
                  points={el.points}
                  stroke={el.color}
                  strokeWidth={el.strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    el.tool === 'eraser' ? 'destination-out' : 'source-over'
                  }
                />
              );
            } else if (el.type === 'rect') {
              return (
                <Rect
                  key={el.id}
                  x={el.x}
                  y={el.y}
                  width={el.width}
                  height={el.height}
                  stroke={el.color}
                  strokeWidth={el.strokeWidth}
                />
              );
            } else if (el.type === 'circle') {
              return (
                <Circle
                  key={el.id}
                  x={el.x}
                  y={el.y}
                  radius={el.radius}
                  stroke={el.color}
                  strokeWidth={el.strokeWidth}
                />
              );
            } else if (el.type === 'text') {
              return (
                <Text
                  key={el.id}
                  x={el.x}
                  y={el.y}
                  text={el.text}
                  fill={el.color}
                  fontSize={el.fontSize}
                />
              );
            }
            return null;
          })}

          {/* Active drawing element preview */}
          {newElement && (
            <>
              {newElement.type === 'line' && (
                <Line
                  points={newElement.points}
                  stroke={newElement.color}
                  strokeWidth={newElement.strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    newElement.tool === 'eraser' ? 'destination-out' : 'source-over'
                  }
                />
              )}
              {newElement.type === 'rect' && (
                <Rect
                  x={newElement.x}
                  y={newElement.y}
                  width={newElement.width}
                  height={newElement.height}
                  stroke={newElement.color}
                  strokeWidth={newElement.strokeWidth}
                />
              )}
              {newElement.type === 'circle' && (
                <Circle
                  x={newElement.x}
                  y={newElement.y}
                  radius={newElement.radius}
                  stroke={newElement.color}
                  strokeWidth={newElement.strokeWidth}
                />
              )}
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;