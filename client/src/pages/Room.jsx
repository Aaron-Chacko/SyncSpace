import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Canvas from "../components/Whiteboard/Canvas";
import CodeEditor from "../components/Editor/CodeEditor";
import RoomHeaderBar from "../components/Shared/RoomHeaderBar";
import ProjectSidebar from "../components/Shared/ProjectSidebar";
import CollaboratorsPanel from "../components/Shared/CollaboratorsPanel";
import { WhiteboardProvider } from "../context/WhiteboardContext";
import { useSocketContext } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import { SOCKET_EVENTS } from "../shared/socketEvents";

import { FileCode, Search, Maximize2 } from "lucide-react";

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socket = useSocketContext();
  const { user } = useAuth();

  const [roomUsers, setRoomUsers] = useState([]);
  const [access, setAccess] = useState({ isHost: false, canEdit: false });
  const [accessRequests, setAccessRequests] = useState([]);
  const [requestMessage, setRequestMessage] = useState("");
  const [connectionError, setConnectionError] = useState("");
  const [copied, setCopied] = useState(false);
  const [lastJoined, setLastJoined] = useState(null);
  const [messages, setMessages] = useState([]);

  // New IDE Layout state matching screenshot
  const [viewMode, setViewMode] = useState("split"); // 'whiteboard' | 'split' | 'code'
  const [activeFile, setActiveFile] = useState("server.js");
  const [activeWorkspace, setActiveWorkspace] = useState("Distributed Systems");

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(roomId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleLeaveRoom = () => {
    if (socket && roomId) {
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM, roomId);
    }
    navigate("/dashboard");
  };

  useEffect(() => {
    if (!socket || !roomId) return;

    console.log(`Joining room: ${roomId}`);

    const joinRoom = () =>
      socket.emit(SOCKET_EVENTS.JOIN_ROOM, roomId, (result) => {
        if (!result?.ok) {
          setConnectionError(result?.error || "Unable to join this room.");
          return;
        }
        setConnectionError("");
        setRoomUsers(result.users);
        setAccess({ isHost: result.isHost, canEdit: result.canEdit });
      });

    if (socket.connected) joinRoom();
    socket.on("connect", joinRoom);

    const handleConnectionError = (error) => {
      setConnectionError(
        error.message || "Unable to connect to real-time collaboration."
      );
    };
    socket.on("connect_error", handleConnectionError);

    const handleRoomUsers = (users) => {
      // Detect last user who joined (new entry compared to current list)
      setRoomUsers((prev) => {
        const prevIds = new Set(prev.map((u) => u.socketId || u.userId));
        const newUser = users.find((u) => !prevIds.has(u.socketId || u.userId));
        if (newUser && newUser.name) {
          setLastJoined(newUser.name);
          // Auto-clear toast after 4 seconds
          window.setTimeout(() => setLastJoined(null), 4000);
        }
        return users;
      });
    };

    socket.on(SOCKET_EVENTS.ROOM_USERS, handleRoomUsers);
    const handleAccessUpdated = (update) => {
      if (update.room === roomId)
        setAccess((current) => ({ ...current, canEdit: update.canEdit }));
    };
    const handleAccessRequest = (request) => {
      if (request.room === roomId)
        setAccessRequests((requests) => [
          ...requests.filter((item) => item.userId !== request.userId),
          request,
        ]);
    };
    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };
    const handleChatHistory = (history) => {
      if (Array.isArray(history)) {
        setMessages(history);
      }
    };

    socket.on(SOCKET_EVENTS.ACCESS_UPDATED, handleAccessUpdated);
    socket.on(SOCKET_EVENTS.EDIT_ACCESS_REQUESTED, handleAccessRequest);
    socket.on("receive-message", handleReceiveMessage);
    socket.on("chat-history", handleChatHistory);

    return () => {
      socket.off(SOCKET_EVENTS.ROOM_USERS, handleRoomUsers);
      socket.off(SOCKET_EVENTS.ACCESS_UPDATED, handleAccessUpdated);
      socket.off(SOCKET_EVENTS.EDIT_ACCESS_REQUESTED, handleAccessRequest);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("chat-history", handleChatHistory);
      socket.off("connect", joinRoom);
      socket.off("connect_error", handleConnectionError);
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM, roomId);
    };
  }, [socket, roomId]);

  const requestEditAccess = () => {
    socket.emit(
      SOCKET_EVENTS.REQUEST_EDIT_ACCESS,
      { room: roomId },
      (result) => {
        setRequestMessage(
          result.ok ? "Request sent to the host." : result.error
        );
      }
    );
  };

  const setParticipantAccess = (userId, allow) => {
    socket.emit(
      SOCKET_EVENTS.GRANT_EDIT_ACCESS,
      { room: roomId, userId, allow },
      (result) => {
        if (result.ok)
          setAccessRequests((requests) =>
            requests.filter((request) => request.userId !== userId)
          );
      }
    );
  };

  const sendChatMessage = (text) => {
    if (!socket || !roomId || !text.trim()) return;
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      text: text.trim(),
      senderId: user?.id || "me",
      senderName: user?.name || "Me",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, message]);

    socket.emit("send-message", {
      room: roomId,
      text: text.trim(),
    });
  };

  return (
    <WhiteboardProvider>
      <div className="room-ide-wrapper">
        {/* 1. TOP UNIFIED HEADER BAR */}
        <RoomHeaderBar
          activeWorkspace={activeWorkspace}
          activeFile={activeFile}
          viewMode={viewMode}
          onSetViewMode={setViewMode}
          roomUsers={roomUsers}
          roomId={roomId}
          copied={copied}
          onShare={copyRoomCode}
        />

        {connectionError && (
          <div className="room-connection-error-banner">
            {connectionError}
          </div>
        )}

        {copied && (
          <div className="room-copied-toast">
            Room Code & Link Copied to Clipboard!
          </div>
        )}

        {/* 2. MAIN 3-COLUMN IDE BODY */}
        <div className="room-ide-main-body">
          {/* LEFT COLUMN: Project & Workspace Tree Sidebar */}
          <ProjectSidebar
            activeFile={activeFile}
            onSelectFile={setActiveFile}
            activeWorkspace={activeWorkspace}
            onSelectWorkspace={setActiveWorkspace}
            onBackToDashboard={handleLeaveRoom}
          />

          {/* CENTER COLUMN: Workspace Views (Whiteboard, Split View, or Code Editor) */}
          <main className="ide-center-workspace">
            {/* WHITEBOARD PANEL */}
            {(viewMode === "whiteboard" || viewMode === "split") && (
              <div className="ide-panel whiteboard-panel">
                <div className="panel-sub-header">
                  <span className="panel-title-text">WHITEBOARD</span>
                  <div className="drawing-user-badge">
                    <span className="drawing-dot"></span>
                    <span>{roomUsers.length > 0 ? `${(roomUsers.find(u => !u.isHost) || roomUsers[0])?.name || "Someone"} is drawing` : "Whiteboard"}</span>
                  </div>
                </div>

                <div className="panel-content-stage">
                  <Canvas canEdit={access.canEdit} isHost={access.isHost} />

                  {/* Bottom Canvas Controls Bar */}
                  <div className="canvas-bottom-controls-bar">
                    <div className="canvas-zoom-pill">
                      <button type="button">-</button>
                      <span>100%</span>
                      <button type="button">+</button>
                      <span className="pill-divider">|</span>
                      <button type="button" title="Undo">
                        ↺
                      </button>
                      <button type="button" title="Redo">
                        ↻
                      </button>
                    </div>

                    <button type="button" className="fit-screen-btn">
                      Fit to screen
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CODE EDITOR PANEL */}
            {(viewMode === "code" || viewMode === "split") && (
              <div className="ide-panel code-panel">
                <div className="code-tabs-sub-header">
                  <div className="editor-file-tabs">
                    {["server.js", "routes.js", "auth.js"].map((fileName) => (
                      <button
                        key={fileName}
                        type="button"
                        className={`editor-file-tab ${
                          activeFile === fileName ? "active" : ""
                        }`}
                        onClick={() => setActiveFile(fileName)}
                      >
                        <FileCode size={13} />
                        <span>{fileName}</span>
                      </button>
                    ))}
                  </div>

                  <div className="code-header-right-tools">
                    <span className="node-version-badge">Node.js</span>
                    <span className="active-file-label">{activeFile}</span>
                    <Search size={14} className="tool-icon" />
                    <Maximize2 size={14} className="tool-icon" />
                  </div>
                </div>

                <div className="panel-content-stage editor-stage">
                  <CodeEditor
                    roomId={roomId}
                    userId={user?.id}
                    userName={user?.name}
                    canEdit={access.canEdit}
                  />

                  {/* Bottom Editor Status Bar */}
                  <div className="editor-bottom-status-bar">
                    <div className="user-editing-pill">
                      <div className="small-avatar">
                        {(user?.name || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <span>{user?.name || "You"} is editing</span>
                    </div>

                    <div className="sync-status-indicator">
                      <span className="green-sync-dot"></span>
                      <span>Synced</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* RIGHT COLUMN: Collaborators, Activity & Chat Sidebar */}
          <CollaboratorsPanel
            roomUsers={roomUsers}
            isHost={access.isHost}
            canEdit={access.canEdit}
            onInvite={copyRoomCode}
            activeFile={activeFile}
            onGrantAccess={setParticipantAccess}
            pendingRequests={accessRequests}
            onRequestEditAccess={requestEditAccess}
            requestMessage={requestMessage}
            lastJoined={lastJoined}
            currentUser={user}
            messages={messages}
            onSendMessage={sendChatMessage}
          />
        </div>

        {/* 3. BOTTOM GLOBAL STATUS BAR */}
        <footer className="room-ide-footer-status">
          <div className="footer-status-left">
            <span className="green-dot"></span>
            <span>Connected</span>
            <span className="divider">•</span>
            <span>Synced</span>
            <span className="divider">•</span>
            <span>12 ms</span>
          </div>

          <div className="footer-status-right">
            <span>Node.js</span>
            <span>UTF-8</span>
            <span>Ln 18, Col 24</span>
            <span>Yjs - WebSocket</span>
          </div>
        </footer>
      </div>
    </WhiteboardProvider>
  );
};

export default Room;
