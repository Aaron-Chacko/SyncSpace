import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Ellipse, Arrow, Text, Group, Path, Image as KonvaImage, Transformer } from 'react-konva';
import { useParams } from 'react-router-dom';
import useWhiteboard from '../../hooks/useWhiteboard';
import { useSocketContext } from '../../context/SocketContext';
import Toolbar from './Toolbar';
import './Whiteboard.css';

// Helper image component for Konva
const URLImage = ({ imageEl }) => {
  const [img, setImg] = useState(null);

  useEffect(() => {
    const image = new window.Image();
    image.src = imageEl.src;
    image.onload = () => setImg(image);
  }, [imageEl.src]);

  return (
    <KonvaImage
      id={imageEl.id}
      x={imageEl.x}
      y={imageEl.y}
      width={imageEl.width || 200}
      height={imageEl.height || 150}
      image={img}
      opacity={imageEl.opacity || 1}
      draggable={imageEl.draggable}
      onClick={imageEl.onClick}
      onTap={imageEl.onTap}
      onDragEnd={imageEl.onDragEnd}
      onTransformEnd={imageEl.onTransformEnd}
    />
  );
};

const Canvas = () => {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const transformerRef = useRef(null);
  const { roomId } = useParams();
  const socket = useSocketContext();

  const [size, setSize] = useState({ width: 800, height: 600 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [newElement, setNewElement] = useState(null);
  const [textInput, setTextInput] = useState(null);
  const [textVal, setTextVal] = useState('');
  const [stickyInput, setStickyInput] = useState(null);
  const [stickyVal, setStickyVal] = useState('');
  const [remoteCursors, setRemoteCursors] = useState({});

  const {
    tool,
    setTool,
    color,
    fillColor,
    opacity,
    strokeWidth,
    elements,
    setElements,
    setElementsRaw,
    selectedId,
    setSelectedId,
    stageScale,
    setStageScale,
    stagePos,
    setStagePos,
    stageRef
  } = useWhiteboard();

  const activeRoom = roomId || 'default-room';

  // Attach transformer to selected shape
  useEffect(() => {
    if (transformerRef.current && stageRef.current) {
      if (selectedId) {
        const selectedNode = stageRef.current.findOne('#' + selectedId);
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode]);
          transformerRef.current.getLayer().batchDraw();
        } else {
          transformerRef.current.nodes([]);
        }
      } else {
        transformerRef.current.nodes([]);
      }
    }
  }, [selectedId, elements]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.emit('join-room', activeRoom);

    const handleDrawElement = (remoteEl) => {
      setElementsRaw((prev) => [...prev, remoteEl]);
    };

    const handleUpdateElement = (updatedEl) => {
      setElementsRaw((prev) => prev.map((el) => (el.id === updatedEl.id ? updatedEl : el)));
    };

    const handleClearCanvas = () => {
      setElementsRaw([]);
      setSelectedId(null);
    };

    const handleCursorMove = (data) => {
      if (socket && data.socketId === socket.id) return;
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
    socket.on('update-element', handleUpdateElement);
    socket.on('clear-canvas', handleClearCanvas);
    socket.on('cursor-move', handleCursorMove);
    socket.on('cursor-leave', handleCursorLeave);

    return () => {
      socket.off('draw-element', handleDrawElement);
      socket.off('update-element', handleUpdateElement);
      socket.off('clear-canvas', handleClearCanvas);
      socket.off('cursor-move', handleCursorMove);
      socket.off('cursor-leave', handleCursorLeave);
    };
  }, [socket, activeRoom, setElementsRaw, setSelectedId]);

  // Resize observer
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

  // Helper for coordinate conversion under zoom/pan
  const getRelativePointerPosition = (stage) => {
    if (!stage) return { x: 0, y: 0 };
    const pos = stage.getPointerPosition();
    if (!pos) return { x: 0, y: 0 };
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    return transform.point(pos);
  };

  // Trigger local file upload dialog for image tool
  useEffect(() => {
    if (tool === 'image' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [tool]);

  const handleImageFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const newImgEl = {
          id: 'img_' + Date.now().toString() + Math.random().toString(36).substring(2, 5),
          type: 'image',
          src: evt.target.result,
          x: (size.width / 2 - stagePos.x) / stageScale,
          y: (size.height / 2 - stagePos.y) / stageScale,
          width: 240,
          height: 160,
          opacity
        };
        setElements([...elements, newImgEl]);
        if (socket) {
          socket.emit('draw-element', { room: activeRoom, element: newImgEl });
        }
        setTool('select');
        setSelectedId(newImgEl.id);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };

  const handleMouseDown = (e) => {
    if (textInput || stickyInput || tool === 'pan') return;

    const clickedOnEmpty = e.target === e.target.getStage();
    const stage = e.target.getStage();
    const pointScreen = stage ? stage.getPointerPosition() : null;
    if (!pointScreen) return;
    const pointGrid = getRelativePointerPosition(stage);

    if (tool === 'select') {
      if (clickedOnEmpty) {
        setSelectedId(null);
      }
      return;
    }

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

    if (tool === 'sticky') {
      setStickyInput({
        screenX: pointScreen.x,
        screenY: pointScreen.y,
        gridX: pointGrid.x,
        gridY: pointGrid.y
      });
      setStickyVal('');
      return;
    }

    setIsDrawing(true);
    const elementId = 'el_' + Date.now().toString() + Math.random().toString(36).substring(2, 5);

    if (tool === 'pencil' || tool === 'eraser') {
      setNewElement({
        id: elementId,
        type: 'line',
        points: [pointGrid.x, pointGrid.y],
        color: tool === 'eraser' ? '#1a1c26' : color,
        strokeWidth: strokeWidth / stageScale,
        opacity,
        tool
      });
    } else if (tool === 'rectangle') {
      setNewElement({
        id: elementId,
        type: 'rect',
        x: pointGrid.x,
        y: pointGrid.y,
        width: 0,
        height: 0,
        color,
        fillColor,
        strokeWidth: strokeWidth / stageScale,
        opacity
      });
    } else if (tool === 'circle') {
      setNewElement({
        id: elementId,
        type: 'circle',
        x: pointGrid.x,
        y: pointGrid.y,
        radius: 0,
        color,
        fillColor,
        strokeWidth: strokeWidth / stageScale,
        opacity
      });
    } else if (tool === 'ellipse') {
      setNewElement({
        id: elementId,
        type: 'ellipse',
        x: pointGrid.x,
        y: pointGrid.y,
        radiusX: 0,
        radiusY: 0,
        color,
        fillColor,
        strokeWidth: strokeWidth / stageScale,
        opacity
      });
    } else if (tool === 'line') {
      setNewElement({
        id: elementId,
        type: 'straight-line',
        x1: pointGrid.x,
        y1: pointGrid.y,
        x2: pointGrid.x,
        y2: pointGrid.y,
        color,
        strokeWidth: strokeWidth / stageScale,
        opacity
      });
    } else if (tool === 'arrow') {
      setNewElement({
        id: elementId,
        type: 'arrow',
        points: [pointGrid.x, pointGrid.y, pointGrid.x, pointGrid.y],
        color,
        strokeWidth: strokeWidth / stageScale,
        opacity
      });
    }
  };

  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    if (!stage) return;
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
      setNewElement({ ...newElement, radius });
    } else if (newElement.type === 'ellipse') {
      setNewElement({
        ...newElement,
        radiusX: Math.abs(pointGrid.x - newElement.x),
        radiusY: Math.abs(pointGrid.y - newElement.y)
      });
    } else if (newElement.type === 'straight-line') {
      setNewElement({
        ...newElement,
        x2: pointGrid.x,
        y2: pointGrid.y
      });
    } else if (newElement.type === 'arrow') {
      setNewElement({
        ...newElement,
        points: [newElement.points[0], newElement.points[1], pointGrid.x, pointGrid.y]
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (newElement) {
      if (
        (newElement.type === 'line' && newElement.points.length >= 2) ||
        (newElement.type === 'rect' && Math.abs(newElement.width) > 1 && Math.abs(newElement.height) > 1) ||
        (newElement.type === 'circle' && newElement.radius > 1) ||
        (newElement.type === 'ellipse' && newElement.radiusX > 1 && newElement.radiusY > 1) ||
        (newElement.type === 'straight-line' && (Math.abs(newElement.x2 - newElement.x1) > 1 || Math.abs(newElement.y2 - newElement.y1) > 1)) ||
        (newElement.type === 'arrow' && (Math.abs(newElement.points[2] - newElement.points[0]) > 1 || Math.abs(newElement.points[3] - newElement.points[1]) > 1))
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
        id: 'txt_' + Date.now().toString() + Math.random().toString(36).substring(2, 5),
        type: 'text',
        x: textInput.gridX,
        y: textInput.gridY,
        text: textVal,
        color,
        opacity,
        fontSize: (strokeWidth * 3 + 14) / stageScale 
      };
      setElements([...elements, newTextEl]);
      if (socket) {
        socket.emit('draw-element', { room: activeRoom, element: newTextEl });
      }
    }
    setTextVal('');
    setTextInput(null);
  };

  const handleStickySubmit = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveStickyElement();
    }
  };

  const saveStickyElement = () => {
    if (stickyVal.trim() && stickyInput) {
      const newStickyEl = {
        id: 'stk_' + Date.now().toString() + Math.random().toString(36).substring(2, 5),
        type: 'sticky',
        x: stickyInput.gridX,
        y: stickyInput.gridY,
        width: 160,
        height: 120,
        text: stickyVal,
        color: fillColor === 'transparent' ? '#f59e0b' : fillColor,
        textColor: '#1e293b',
        opacity
      };
      setElements([...elements, newStickyEl]);
      if (socket) {
        socket.emit('draw-element', { room: activeRoom, element: newStickyEl });
      }
    }
    setStickyVal('');
    setStickyInput(null);
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    if (Math.abs(e.evt.deltaY) < 2) return;

    const oldScale = stage.scaleX();
    const scaleBy = 1.05;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const boundedScale = Math.max(0.2, Math.min(5, newScale));

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

  // Update object coordinates when dragged or transformed
  const handleElementDragEnd = (id, e) => {
    const node = e.target;
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          const updated = { ...el, x: node.x(), y: node.y() };
          if (socket) {
            socket.emit('update-element', { room: activeRoom, element: updated });
          }
          return updated;
        }
        return el;
      })
    );
  };

  const handleTransformEnd = (id, e) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    setElements((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          const updated = {
            ...el,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, (el.width || 100) * scaleX),
            height: Math.max(5, (el.height || 100) * scaleY),
            radius: el.radius ? el.radius * Math.max(scaleX, scaleY) : undefined,
            radiusX: el.radiusX ? el.radiusX * scaleX : undefined,
            radiusY: el.radiusY ? el.radiusY * scaleY : undefined
          };
          if (socket) {
            socket.emit('update-element', { room: activeRoom, element: updated });
          }
          return updated;
        }
        return el;
      })
    );
  };

  // Generate canvas dot grid background pattern
  const gridDots = [];
  const dotGap = 30;
  const gridRange = 2500;
  for (let x = -gridRange; x < gridRange; x += dotGap) {
    for (let y = -gridRange; y < gridRange; y += dotGap) {
      gridDots.push({ x, y });
    }
  }

  return (
    <div className={`canvas-container ${tool === 'pan' ? 'pan-mode' : ''}`} ref={containerRef}>
      <Toolbar />

      {/* Hidden File Input for Image Tool */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageFileChange}
      />

      {/* Text Tool Overlay */}
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
            background: 'rgba(18, 19, 26, 0.95)',
            border: '1px dashed var(--accent-primary)',
            borderRadius: '4px',
            outline: 'none',
            padding: '4px 8px',
            zIndex: 100
          }}
          autoFocus
          value={textVal}
          onChange={(e) => setTextVal(e.target.value)}
          onKeyDown={handleTextSubmit}
          onBlur={saveTextElement}
          placeholder="Type text..."
        />
      )}

      {/* Sticky Note Tool Overlay */}
      {stickyInput && (
        <textarea
          className="canvas-text-input"
          style={{
            position: 'absolute',
            top: stickyInput.screenY,
            left: stickyInput.screenX,
            width: '160px',
            height: '120px',
            color: '#1e293b',
            fontSize: '14px',
            fontFamily: 'inherit',
            background: fillColor === 'transparent' ? '#f59e0b' : fillColor,
            border: '2px solid #b45309',
            borderRadius: '6px',
            outline: 'none',
            padding: '8px',
            zIndex: 100,
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
          }}
          autoFocus
          value={stickyVal}
          onChange={(e) => setStickyVal(e.target.value)}
          onKeyDown={handleStickySubmit}
          onBlur={saveStickyElement}
          placeholder="Sticky note..."
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
        {/* Infinite Dot Grid Layer */}
        <Layer>
          {gridDots.map((dot, idx) => (
            <Circle key={idx} x={dot.x} y={dot.y} radius={1.2} fill="#334155" opacity={0.6} />
          ))}
        </Layer>

        <Layer>
          {elements.map((el) => {
            const isSelected = selectedId === el.id;
            const isDraggable = tool === 'select';

            if (el.type === 'line') {
              return (
                <Line
                  key={el.id}
                  id={el.id}
                  points={el.points}
                  stroke={el.color}
                  strokeWidth={el.strokeWidth}
                  opacity={el.opacity || 1}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={el.tool === 'eraser' ? 'destination-out' : 'source-over'}
                  draggable={isDraggable}
                  onClick={() => tool === 'select' && setSelectedId(el.id)}
                  onTap={() => tool === 'select' && setSelectedId(el.id)}
                  onDragEnd={(e) => handleElementDragEnd(el.id, e)}
                  onTransformEnd={(e) => handleTransformEnd(el.id, e)}
                />
              );
            } else if (el.type === 'rect') {
              return (
                <Rect
                  key={el.id}
                  id={el.id}
                  x={el.x}
                  y={el.y}
                  width={el.width}
                  height={el.height}
                  stroke={el.color}
                  fill={el.fillColor !== 'transparent' ? el.fillColor : undefined}
                  strokeWidth={el.strokeWidth}
                  opacity={el.opacity || 1}
                  draggable={isDraggable}
                  onClick={() => tool === 'select' && setSelectedId(el.id)}
                  onTap={() => tool === 'select' && setSelectedId(el.id)}
                  onDragEnd={(e) => handleElementDragEnd(el.id, e)}
                  onTransformEnd={(e) => handleTransformEnd(el.id, e)}
                />
              );
            } else if (el.type === 'circle') {
              return (
                <Circle
                  key={el.id}
                  id={el.id}
                  x={el.x}
                  y={el.y}
                  radius={el.radius}
                  stroke={el.color}
                  fill={el.fillColor !== 'transparent' ? el.fillColor : undefined}
                  strokeWidth={el.strokeWidth}
                  opacity={el.opacity || 1}
                  draggable={isDraggable}
                  onClick={() => tool === 'select' && setSelectedId(el.id)}
                  onTap={() => tool === 'select' && setSelectedId(el.id)}
                  onDragEnd={(e) => handleElementDragEnd(el.id, e)}
                  onTransformEnd={(e) => handleTransformEnd(el.id, e)}
                />
              );
            } else if (el.type === 'ellipse') {
              return (
                <Ellipse
                  key={el.id}
                  id={el.id}
                  x={el.x}
                  y={el.y}
                  radiusX={el.radiusX}
                  radiusY={el.radiusY}
                  stroke={el.color}
                  fill={el.fillColor !== 'transparent' ? el.fillColor : undefined}
                  strokeWidth={el.strokeWidth}
                  opacity={el.opacity || 1}
                  draggable={isDraggable}
                  onClick={() => tool === 'select' && setSelectedId(el.id)}
                  onTap={() => tool === 'select' && setSelectedId(el.id)}
                  onDragEnd={(e) => handleElementDragEnd(el.id, e)}
                  onTransformEnd={(e) => handleTransformEnd(el.id, e)}
                />
              );
            } else if (el.type === 'straight-line') {
              return (
                <Line
                  key={el.id}
                  id={el.id}
                  points={[el.x1, el.y1, el.x2, el.y2]}
                  stroke={el.color}
                  strokeWidth={el.strokeWidth}
                  opacity={el.opacity || 1}
                  lineCap="round"
                  lineJoin="round"
                  draggable={isDraggable}
                  onClick={() => tool === 'select' && setSelectedId(el.id)}
                  onTap={() => tool === 'select' && setSelectedId(el.id)}
                  onDragEnd={(e) => handleElementDragEnd(el.id, e)}
                  onTransformEnd={(e) => handleTransformEnd(el.id, e)}
                />
              );
            } else if (el.type === 'arrow') {
              return (
                <Arrow
                  key={el.id}
                  id={el.id}
                  points={el.points}
                  stroke={el.color}
                  fill={el.color}
                  strokeWidth={el.strokeWidth}
                  opacity={el.opacity || 1}
                  pointerLength={10}
                  pointerWidth={10}
                  draggable={isDraggable}
                  onClick={() => tool === 'select' && setSelectedId(el.id)}
                  onTap={() => tool === 'select' && setSelectedId(el.id)}
                  onDragEnd={(e) => handleElementDragEnd(el.id, e)}
                  onTransformEnd={(e) => handleTransformEnd(el.id, e)}
                />
              );
            } else if (el.type === 'text') {
              return (
                <Text
                  key={el.id}
                  id={el.id}
                  x={el.x}
                  y={el.y}
                  text={el.text}
                  fill={el.color}
                  fontSize={el.fontSize}
                  opacity={el.opacity || 1}
                  draggable={isDraggable}
                  onClick={() => tool === 'select' && setSelectedId(el.id)}
                  onTap={() => tool === 'select' && setSelectedId(el.id)}
                  onDragEnd={(e) => handleElementDragEnd(el.id, e)}
                  onTransformEnd={(e) => handleTransformEnd(el.id, e)}
                />
              );
            } else if (el.type === 'sticky') {
              return (
                <Group
                  key={el.id}
                  id={el.id}
                  x={el.x}
                  y={el.y}
                  opacity={el.opacity || 1}
                  draggable={isDraggable}
                  onClick={() => tool === 'select' && setSelectedId(el.id)}
                  onTap={() => tool === 'select' && setSelectedId(el.id)}
                  onDragEnd={(e) => handleElementDragEnd(el.id, e)}
                  onTransformEnd={(e) => handleTransformEnd(el.id, e)}
                >
                  <Rect
                    width={el.width || 160}
                    height={el.height || 120}
                    fill={el.color || '#f59e0b'}
                    cornerRadius={6}
                    shadowColor="#000"
                    shadowBlur={10}
                    shadowOpacity={0.25}
                  />
                  <Text
                    x={10}
                    y={10}
                    width={(el.width || 160) - 20}
                    height={(el.height || 120) - 20}
                    text={el.text}
                    fill={el.textColor || '#1e293b'}
                    fontSize={14}
                    wrap="word"
                  />
                </Group>
              );
            } else if (el.type === 'image') {
              return (
                <URLImage
                  key={el.id}
                  imageEl={{
                    ...el,
                    draggable: isDraggable,
                    onClick: () => tool === 'select' && setSelectedId(el.id),
                    onTap: () => tool === 'select' && setSelectedId(el.id),
                    onDragEnd: (e) => handleElementDragEnd(el.id, e),
                    onTransformEnd: (e) => handleTransformEnd(el.id, e)
                  }}
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
                  opacity={newElement.opacity}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={newElement.tool === 'eraser' ? 'destination-out' : 'source-over'}
                />
              )}
              {newElement.type === 'rect' && (
                <Rect
                  x={newElement.x}
                  y={newElement.y}
                  width={newElement.width}
                  height={newElement.height}
                  stroke={newElement.color}
                  fill={newElement.fillColor !== 'transparent' ? newElement.fillColor : undefined}
                  strokeWidth={newElement.strokeWidth}
                  opacity={newElement.opacity}
                />
              )}
              {newElement.type === 'circle' && (
                <Circle
                  x={newElement.x}
                  y={newElement.y}
                  radius={newElement.radius}
                  stroke={newElement.color}
                  fill={newElement.fillColor !== 'transparent' ? newElement.fillColor : undefined}
                  strokeWidth={newElement.strokeWidth}
                  opacity={newElement.opacity}
                />
              )}
              {newElement.type === 'ellipse' && (
                <Ellipse
                  x={newElement.x}
                  y={newElement.y}
                  radiusX={newElement.radiusX}
                  radiusY={newElement.radiusY}
                  stroke={newElement.color}
                  fill={newElement.fillColor !== 'transparent' ? newElement.fillColor : undefined}
                  strokeWidth={newElement.strokeWidth}
                  opacity={newElement.opacity}
                />
              )}
              {newElement.type === 'straight-line' && (
                <Line
                  points={[newElement.x1, newElement.y1, newElement.x2, newElement.y2]}
                  stroke={newElement.color}
                  strokeWidth={newElement.strokeWidth}
                  opacity={newElement.opacity}
                  lineCap="round"
                  lineJoin="round"
                />
              )}
              {newElement.type === 'arrow' && (
                <Arrow
                  points={newElement.points}
                  stroke={newElement.color}
                  fill={newElement.color}
                  strokeWidth={newElement.strokeWidth}
                  opacity={newElement.opacity}
                  pointerLength={10}
                  pointerWidth={10}
                />
              )}
            </>
          )}

          {/* Konva Transformer for Selection & Resizing */}
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) return oldBox;
              return newBox;
            }}
          />

          {/* Live Multiplayer Cursors */}
          {Object.entries(remoteCursors).map(([id, cursor]) => (
            <Group key={id} x={cursor.x} y={cursor.y}>
              <Path
                data="M0,0 L0,15 L4,11 L8,18 L11,17 L7,10 L13,10 Z"
                fill={cursor.color || '#06b6d4'}
                stroke="#ffffff"
                strokeWidth={1}
              />
              <Rect
                x={12}
                y={12}
                width={(cursor.name || 'User').length * 7 + 10}
                height={18}
                fill={cursor.color || '#06b6d4'}
                cornerRadius={4}
              />
              <Text
                x={16}
                y={16}
                text={cursor.name || 'User'}
                fill="#ffffff"
                fontSize={11}
                fontStyle="bold"
              />
            </Group>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;