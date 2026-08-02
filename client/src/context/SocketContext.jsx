import React, { createContext, useContext, useEffect } from "react";
import socket, { connectSocket, disconnectSocket } from "../services/socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();

  useEffect(() => {
    if (token) connectSocket(token);
    else disconnectSocket();
    return () => disconnectSocket();
  }, [token]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocketContext = () => useContext(SocketContext);
