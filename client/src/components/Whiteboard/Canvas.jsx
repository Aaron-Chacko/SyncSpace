import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text, Group, Path } from 'react-konva';
import { useParams } from 'react-router-dom';
import useWhiteboard from '../../hooks/useWhiteboard';
import { useSocketContext } from '../../context/SocketContext';
import Toolbar from './Toolbar';
import './Whiteboard.css';

const Canvas = () => {
  const containerRef = useRef(null);
  const { roomId } = useParams();
  const socket = useSocketContext();
  
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [newElement, setNewElement] = useState(null);
  const [textInput, setTextInput] = useState(null);
  const [textVal, setTextVal] = useState('');
  const [remoteCursors, setRemoteCursors] = useState({});

  const {
    tool,
    color,
    strokeWidth,
    elements,
    setElements,
    setElementsRaw,
    stageScale,
    setStageScale,
    stagePos,
    setStagePos,
    stageRef
  } = useWhiteboard();

  const activeRoom = roomId || 'default-room';

  useEffect(() => {
    if (!socket) return;

    socket.emit('join-room', activeRoom);

    const handleDrawElement = (remoteEl) => {
      setElementsRaw((prev) => [...prev, remoteEl]);
    };

    const handleClearCanvas = () => {
      setElementsRaw([]);
    };

    const handleCursorMove = (data) => {
      setRemoteCursors((prev) => ({
        ...prev,
        [data.socketId]: data
      }));
    };

    const handleCursorLeave = (data) => {
      setRemoteCursors((prev) => {
        const next = { ...prev };
        delete next[data.socketId];
        return next;
      });
    };

    socket.on('draw-element', handleDrawElement);
    socket.on('clear-canvas', handleClearCanvas);
    socket.on('cursor-move', handleCursorMove);
    socket.on('cursor-leave', handleCursorLeave);

    return () => {
      socket.off('draw-element', handleDrawElement);
      socket.off('clear-canvas', handleClearCanvas);
      socket.off('cursor-move', handleCursorMove);
      socket.off('cursor-leave', handleCursorLeave);
    };
  }, [socket, activeRoom, setElementsRaw]);

  useEffect(() => {
    if (containerRef.current) {
      const handleResize = () => {
        setSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      };

      handleResize();
      
      const observer = new ResizeObserver(handleResize);
      observer.observe(containerRef.current);

      return () => observer.disconnect();
    }
  }, []);

  const getRelativePointerPosition = (stage) => {
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const pos = stage.getPointerPosition();
    return transform.point(pos);
  };

  const handleMouseDown = (e) => {
    if (textInput || tool === 'pan') return;

    const stage = e.target.getStage();
    const pointScreen = stage.getPointerPosition();
    const pointGrid = getRelativePointerPosition(stage);

    if (tool === 'text') {
      setTextInput({
        screenX: pointScreen.x,
        screenY: pointScreen.y,
        gridX: pointGrid.x,
        gridY: pointGrid.y
      });
      setTextVal('');
      return;
    }

    setIsDrawing(true);

    if (tool === 'pencil' || tool === 'eraser') {
      setNewElement({
        id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
        type: 'line',
        points: [pointGrid.x, pointGrid.y],
        color: tool === 'eraser' ? '#1a1c26' : color,
        strokeWidth: strokeWidth / stageScale,
        tool
      });
    } else if (tool === 'rectangle') {
      setNewElement({
        id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
        type: 'rect',
        x: pointGrid.x,
        y: pointGrid.y,
        width: 0,
        height: 0,
        color,
        strokeWidth: strokeWidth / stageScale
      });
    } else if (tool === 'circle') {
      setNewElement({
        id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
        type: 'circle',
        x: pointGrid.x,
        y: pointGrid.y,
        radius: 0,
        color,
        strokeWidth: strokeWidth / stageScale
      });
    } else if (tool === 'line') {
      setNewElement({
        id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
        type: 'straight-line',
        x1: pointGrid.x,
        y1: pointGrid.y,
        x2: pointGrid.x,
        y2: pointGrid.y,
        color,
        strokeWidth: strokeWidth / stageScale
      });
    }
  };

  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const pointGrid = getRelativePointerPosition(stage);

    if (socket) {
      socket.emit('cursor-move', {
        room: activeRoom,
        x: pointGrid.x,
        y: pointGrid.y,
        name: 'User ' + (socket.id ? socket.id.substring(0, 4) : ''),
        color: color
      });
    }

    if (!isDrawing || !newElement) return;

    if (newElement.type === 'line') {
      setNewElement({
        ...newElement,
        points: [...newElement.points, pointGrid.x, pointGrid.y]
      });
    } else if (newElement.type === 'rect') {
      setNewElement({
        ...newElement,
        width: pointGrid.x - newElement.x,
        height: pointGrid.y - newElement.y
      });
    } else if (newElement.type === 'circle') {
      const radius = Math.sqrt(
        Math.pow(pointGrid.x - newElement.x, 2) + Math.pow(pointGrid.y - newElement.y, 2)
      );
      setNewElement({
        ...newElement,
        radius
      });
    } else if (newElement.type === 'straight-line') {
      setNewElement({
        ...newElement,
        x2: pointGrid.x,
        y2: pointGrid.y
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
        (newElement.type === 'circle' && newElement.radius > 1) ||
        (newElement.type === 'straight-line' && (Math.abs(newElement.x2 - newElement.x1) > 1 || Math.abs(newElement.y2 - newElement.y1) > 1))
      ) {
        setElements([...elements, newElement]);
        if (socket) {
          socket.emit('draw-element', {
            room: activeRoom,
            element: newElement
          });
        }
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
        id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
        type: 'text',
        x: textInput.gridX,
        y: textInput.gridY,
        text: textVal,
        color,
        fontSize: (strokeWidth * 3 + 14) / stageScale 
      };
      setElements([...elements, newTextEl]);

      if (socket) {
        socket.emit('draw-element', {
          room: activeRoom,
          element: newTextEl
        });
      }
    }
    setTextVal('');
    setTextInput(null);
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.08;
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const boundedScale = Math.max(0.1, Math.min(10, newScale));

    setStageScale(boundedScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * boundedScale,
      y: pointer.y - mousePointTo.y * boundedScale,
    });
  };

  const handleStageDragEnd = (e) => {
    if (e.target === stageRef.current) {
      setStagePos({
        x: e.target.x(),
        y: e.target.y()
      });
    }
  };

  return (
    <div className={`canvas-container ${tool === 'pan' ? 'pan-mode' : ''}`} ref={containerRef}>
      <Toolbar />
      
      {/* HTML absolute textbox */}
      {textInput && (
        <textarea
          className="canvas-text-input"
          style={{
            position: 'absolute',
            top: textInput.screenY,
            left: textInput.screenX,
            color: color,
            fontSize: `${(strokeWidth * 3 + 14)}px`,
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
        x={stagePos.x}
        y={stagePos.y}
        scaleX={stageScale}
        scaleY={stageScale}
        draggable={tool === 'pan'}
        onDragEnd={handleStageDragEnd}
        onWheel={handleWheel}
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
            } else if (el.type === 'straight-line') {
              return (
                <Line
                  key={el.id}
                  points={[el.x1, el.y1, el.x2, el.y2]}
                  stroke={el.color}
                  strokeWidth={el.strokeWidth}
                  lineCap="round"
                  lineJoin="round"
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
              {newElement.type === 'straight-line' && (
                <Line
                  points={[newElement.x1, newElement.y1, newElement.x2, newElement.y2]}
                  stroke={newElement.color}
                  strokeWidth={newElement.strokeWidth}
                  lineCap="round"
                  lineJoin="round"
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