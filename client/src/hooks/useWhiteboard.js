import { useContext } from 'react';
import { WhiteboardContext } from '../context/WhiteboardContext';

const useWhiteboard = () => {
  const context = useContext(WhiteboardContext);
  if (!context) {
    throw new Error('useWhiteboard must be used within a WhiteboardProvider');
  }
  return context;
};

export default useWhiteboard;