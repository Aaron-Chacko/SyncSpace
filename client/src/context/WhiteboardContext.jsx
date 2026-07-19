import React, { createContext, useState, useCallback, useRef } from 'react';

export const WhiteboardContext = createContext(null);

export const WhiteboardProvider = ({ children }) => {
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#6366f1');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [elements, setElementsState] = useState([]);
  
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
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setElementsState(history[nextIndex]);
    }
  }, [history, historyIndex]);

  const clearCanvas = useCallback(() => {
    setElements([]);
  }, [setElements]);

  return (
    <WhiteboardContext.Provider
      value={{
        tool,
        setTool,
        color,
        setColor,
        strokeWidth,
        setStrokeWidth,
        elements,
        setElements,
        setElementsRaw: setElementsState,
        stageScale,
        setStageScale,
        stagePos,
        setStagePos,
        stageRef,
        undo,
        redo,
        clearCanvas,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
      }}
    >
      {children}
    </WhiteboardContext.Provider>
  );
};
