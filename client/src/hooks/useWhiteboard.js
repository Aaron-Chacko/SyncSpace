import { useCallback } from 'react';

const useWhiteboard = () => {
  const initWhiteboard = useCallback((canvas) => {
    console.log('Initializing whiteboard canvas:', canvas);
  }, []);

  return { initWhiteboard };
};

export default useWhiteboard;