import React, { createContext, useState, useCallback, useRef } from 'react';

export const WhiteboardContext = createContext(null);

export const WhiteboardProvider = ({ children }) => {
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#6366f1');
  const [fillColor, setFillColor] = useState('transparent');
  const [opacity, setOpacity] = useState(1);
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [elements, setElementsState] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [clipboard, setClipboard] = useState(null);
  
  const stageRef = useRef(null);

  // for Zoom & Pan
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  // for Undo and Redo
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // for store elements and update history
  const setElements = useCallback((newElementsOrFn) => {
    setElementsState((prev) => {
      const next = typeof newElementsOrFn === 'function' ? newElementsOrFn(prev) : newElementsOrFn;

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(next);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      return next;
    });
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setElementsState(history[prevIndex]);
      setSelectedId(null);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setElementsState(history[nextIndex]);
      setSelectedId(null);
    }
  }, [history, historyIndex]);

  const clearCanvas = useCallback(() => {
    setElements([]);
    setSelectedId(null);
  }, [setElements]);

  // Object manipulations
  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  }, [selectedId, setElements]);

  const bringToFront = useCallback(() => {
    if (!selectedId) return;
    setElements((prev) => {
      const target = prev.find((el) => el.id === selectedId);
      if (!target) return prev;
      return [...prev.filter((el) => el.id !== selectedId), target];
    });
  }, [selectedId, setElements]);

  const sendToBack = useCallback(() => {
    if (!selectedId) return;
    setElements((prev) => {
      const target = prev.find((el) => el.id === selectedId);
      if (!target) return prev;
      return [target, ...prev.filter((el) => el.id !== selectedId)];
    });
  }, [selectedId, setElements]);

  const copySelected = useCallback(() => {
    if (!selectedId) return;
    const target = elements.find((el) => el.id === selectedId);
    if (target) {
      setClipboard(JSON.parse(JSON.stringify(target)));
    }
  }, [selectedId, elements]);

  const pasteSelected = useCallback(() => {
    if (!clipboard) return;
    const newEl = {
      ...JSON.parse(JSON.stringify(clipboard)),
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      x: (clipboard.x || 100) + 20,
      y: (clipboard.y || 100) + 20
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newEl.id);
  }, [clipboard, setElements]);

  const duplicateSelected = useCallback(() => {
    if (!selectedId) return;
    const target = elements.find((el) => el.id === selectedId);
    if (!target) return;
    const newEl = {
      ...JSON.parse(JSON.stringify(target)),
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      x: (target.x || 100) + 20,
      y: (target.y || 100) + 20
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newEl.id);
  }, [selectedId, elements, setElements]);

  // Export Stage drawings as high-resolution PNG image
  const exportAsImage = useCallback((fileName = 'whiteboard.png') => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = fileName;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [stageRef]);

  return (
    <WhiteboardContext.Provider
      value={{
        tool,
        setTool,
        color,
        setColor,
        fillColor,
        setFillColor,
        opacity,
        setOpacity,
        strokeWidth,
        setStrokeWidth,
        elements,
        setElements,
        setElementsRaw: setElementsState,
        selectedId,
        setSelectedId,
        deleteSelected,
        bringToFront,
        sendToBack,
        copySelected,
        pasteSelected,
        duplicateSelected,
        stageScale,
        setStageScale,
        stagePos,
        setStagePos,
        stageRef,
        undo,
        redo,
        clearCanvas,
        exportAsImage,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
      }}
    >
      {children}
    </WhiteboardContext.Provider>
  );
};
