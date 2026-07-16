import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';

const useSocket = (event, callback) => {
  const socket = useSocketContext();

  useEffect(() => {
    if (socket) {
      socket.on(event, callback);
      return () => {
        socket.off(event, callback);
      };
    }
  }, [socket, event, callback]);

  return socket;
};

export default useSocket;