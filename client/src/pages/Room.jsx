import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Canvas from "../components/Whiteboard/Canvas";
import CodeEditor from "../components/Editor/CodeEditor";
import Sidebar from "../components/Shared/Sidebar";

import { WhiteboardProvider } from "../context/WhiteboardContext";
import { useSocketContext } from "../context/SocketContext";
import { SOCKET_EVENTS } from "../shared/socketEvents";

import { Code2, Edit3 } from "lucide-react";

const Room = () => {
  const { roomId } = useParams();
  const socket = useSocketContext();

  const [roomUsers, setRoomUsers] = useState([]);

  useEffect(() => {
    if (!socket || !roomId) return;

    console.log(`Joining room: ${roomId}`);

    socket.emit(SOCKET_EVENTS.JOIN_ROOM, roomId);

    const handleRoomUsers = (users) => {
      setRoomUsers(users);
    };

    socket.on(SOCKET_EVENTS.ROOM_USERS, handleRoomUsers);

    return () => {
      socket.off(SOCKET_EVENTS.ROOM_USERS, handleRoomUsers);
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM, roomId);
    };
  }, [socket, roomId]);


  return (
    <WhiteboardProvider>
      <div
        className="page room-page"
        style={{
          flex: 1,
          display: "flex",
          height: "calc(100vh - 58px)",
          background: "var(--bg-primary)",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <Sidebar roomUsers={roomUsers} />

        <div
          style={{
            flex: 1,
            display: "flex",
            gap: "12px",
            padding: "12px",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* Whiteboard */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              background: "var(--bg-secondary)",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                background: "var(--bg-tertiary)",
                borderBottom: "1px solid var(--border-color)",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              <Edit3 size={14} color="var(--accent-primary)" />
              <span>Interactive Whiteboard</span>
            </div>

            <div
              style={{
                flex: 1,
                position: "relative",
                minHeight: 0,
              }}
            >
              <Canvas />
            </div>
          </div>

          {/* Code Editor */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              background: "var(--bg-secondary)",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                background: "var(--bg-tertiary)",
                borderBottom: "1px solid var(--border-color)",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              <Code2 size={14} color="#06b6d4" />
              <span>Collaborative Code Editor</span>
            </div>

            <div
              style={{
                flex: 1,
                minHeight: 0,
              }}
            >
              <CodeEditor />
            </div>
          </div>
        </div>
      </div>
    </WhiteboardProvider>
  );
};

export default Room;
