import React, { createContext, useContext, useEffect } from 'react';
import socket from '../services/socket';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('🔌 Socket.IO connected successfully to backend server! ID:', socket.id);
    });
    socket.on('connect_error', (err) => {
      console.error('❌ Socket.IO connection error details:', err.message);
    });
    socket.on('disconnect', (reason) => {
      console.warn('🔌 Socket.IO disconnected from backend server:', reason);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);