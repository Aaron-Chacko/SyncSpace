import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Canvas from "../components/Whiteboard/Canvas";
import CodeEditor from "../components/Editor/CodeEditor";
import ParticipantsSidebar from "../components/Shared/ParticipantsSidebar";
import { WhiteboardProvider } from "../context/WhiteboardContext";
import { useSocketContext } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import { SOCKET_EVENTS } from "../shared/socketEvents";

import { Code2, Edit3 } from "lucide-react";

const Room = () => {
  const { roomId } = useParams();
  const socket = useSocketContext();
  const { user } = useAuth();

  const [roomUsers, setRoomUsers] = useState([]);
  const [access, setAccess] = useState({ isHost: false, canEdit: false });
  const [accessRequests, setAccessRequests] = useState([]);
  const [requestMessage, setRequestMessage] = useState("");
  const [connectionError, setConnectionError] = useState("");
  const [copied, setCopied] = useState(false);

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(roomId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    if (!socket || !roomId) return;

    console.log(`Joining room: ${roomId}`);

    const joinRoom = () => {
      setConnectionError("");

      socket.emit(SOCKET_EVENTS.JOIN_ROOM, roomId, (result) => {
        if (!result?.ok) {
          setConnectionError(result?.error || "Unable to join this room.");
          return;
        }

        setRoomUsers(result.users || []);
        setAccess({
          isHost: Boolean(result.isHost),
          canEdit: Boolean(result.canEdit),
        });
      });
    };
    if (socket.connected) joinRoom();
    socket.on("connect", joinRoom);
    const handleConnectionError = (error) => {
      setConnectionError(
        error.message || "Unable to connect to real-time collaboration.",
      );
    };
    socket.on("connect_error", handleConnectionError);

    const handleRoomUsers = (users) => {
      setRoomUsers(users);
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
    socket.on(SOCKET_EVENTS.ACCESS_UPDATED, handleAccessUpdated);
    socket.on(SOCKET_EVENTS.EDIT_ACCESS_REQUESTED, handleAccessRequest);

    return () => {
      socket.off(SOCKET_EVENTS.ROOM_USERS, handleRoomUsers);
      socket.off(SOCKET_EVENTS.ACCESS_UPDATED, handleAccessUpdated);
      socket.off(SOCKET_EVENTS.EDIT_ACCESS_REQUESTED, handleAccessRequest);
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
          result.ok ? "Request sent to the host." : result.error,
        );
      },
    );
  };

  const setParticipantAccess = (userId, allow) => {
    socket.emit(
      SOCKET_EVENTS.GRANT_EDIT_ACCESS,
      { room: roomId, userId, allow },
      (result) => {
        if (result.ok)
          setAccessRequests((requests) =>
            requests.filter((request) => request.userId !== userId),
          );
      },
    );
  };

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
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "20px",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 10px",
            border: "1px solid var(--border-color)",
            borderRadius: "6px",
            background: "var(--bg-tertiary)",
            color: "var(--text-secondary)",
            fontSize: "12px",
          }}
        >
          <span>
            Room code:{" "}
            <strong
              style={{ color: "var(--text-primary)", letterSpacing: "0.08em" }}
            >
              {roomId}
            </strong>
          </span>

          <button
            type="button"
            className="secondary-btn"
            onClick={copyRoomCode}
            style={{ padding: "3px 7px", fontSize: "11px" }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <ParticipantsSidebar
          roomUsers={roomUsers}
          isHost={access.isHost}
          onGrantAccess={setParticipantAccess}
          pendingRequests={accessRequests}
        />

        {connectionError && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "270px",
              zIndex: 3,
              padding: "8px 12px",
              borderRadius: "6px",
              background: "#3f1d24",
              color: "#fecaca",
              fontSize: "12px",
            }}
          >
            {connectionError}
          </div>
        )}

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
              <Canvas canEdit={access.canEdit} />
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
              <CodeEditor
                roomId={roomId}
                userId={user?.id}
                userName={user?.name}
                canEdit={access.canEdit}
              />
            </div>
          </div>
        </div>
        {!access.isHost && !access.canEdit && (
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              right: "20px",
              zIndex: 3,
              padding: "10px",
              borderRadius: "6px",
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <button
              type="button"
              className="primary-btn"
              onClick={requestEditAccess}
            >
              Request edit access
            </button>
            {requestMessage && (
              <span style={{ marginLeft: "8px", fontSize: "12px" }}>
                {requestMessage}
              </span>
            )}
          </div>
        )}
      </div>
    </WhiteboardProvider>
  );
};

export default Room;
