import React from "react";
import { 
  Code2, 
  Layout, 
  PenTool, 
  Copy,
  Check,
  FileCode,
  Sparkles
} from "lucide-react";

const RoomHeaderBar = ({
  activeWorkspace = "Distributed Systems",
  activeFile = "server.js",
  viewMode = "split",
  onSetViewMode = () => {},
  roomUsers = [],
  roomId = "",
  copied = false,
  onShare = () => {},
}) => {
  // Extract user initials for avatar stack
  const avatars = (roomUsers.length > 0 ? roomUsers : [
    { name: "Mayank" },
    { name: "Kavya" },
    { name: "Rishi" },
    { name: "Alex" },
    { name: "Sam" }
  ]).slice(0, 3);

  const overflowCount = Math.max(0, (roomUsers.length > 0 ? roomUsers.length : 5) - 3);

  return (
    <header className="room-ide-header">
      {/* LEFT: BRAND LOGO & BREADCRUMB */}
      <div className="header-left-group">
        <div className="brand-logo-inline">
          <Sparkles size={16} className="brand-sparkle" />
          <span className="brand-title">SyncSpace</span>
        </div>

        <div className="breadcrumb-divider">/</div>

        <div className="workspace-breadcrumb">
          <span className="ws-name">{activeWorkspace}</span>
          <span className="bread-sep">/</span>
          <FileCode size={13} className="file-bread-icon" />
          <span className="file-name">{activeFile}</span>
          <span className="unsaved-dot">•</span>
        </div>
      </div>

      {/* CENTER: VIEW MODE SWITCHER SEGMENTED CONTROL */}
      <div className="header-center-view-switcher">
        <div className="segmented-pill-container">
          <button
            type="button"
            className={`view-pill-btn ${viewMode === "whiteboard" ? "active" : ""}`}
            onClick={() => onSetViewMode("whiteboard")}
          >
            <PenTool size={13} />
            <span>Whiteboard</span>
          </button>

          <button
            type="button"
            className={`view-pill-btn ${viewMode === "split" ? "active" : ""}`}
            onClick={() => onSetViewMode("split")}
          >
            <Layout size={13} />
            <span>Split View</span>
          </button>

          <button
            type="button"
            className={`view-pill-btn ${viewMode === "code" ? "active" : ""}`}
            onClick={() => onSetViewMode("code")}
          >
            <Code2 size={13} />
            <span>Code</span>
          </button>
        </div>
      </div>

      {/* RIGHT: CONNECTION BADGE, AVATARS STACK, ROOM CODE + COPY */}
      <div className="header-right-group">
        {/* Connection Status Badge */}
        <div className="connection-latency-badge">
          <span className="status-dot green"></span>
          <span className="status-text">Connected • 12ms</span>
        </div>

        {/* User Avatars Stack */}
        <div className="user-avatars-stack">
          {avatars.map((u, i) => {
            const initials = (u.name || "U")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);
            return (
              <div key={i} className="stack-avatar" title={u.name}>
                {initials}
              </div>
            );
          })}
          {overflowCount > 0 && (
            <div className="stack-avatar overflow">
              +{overflowCount}
            </div>
          )}
        </div>

        {/* Room Code Display with Copy */}
        <div className="header-room-code-group">
          <span className="header-room-code-label">Room:</span>
          <span className="header-room-code-value">{roomId}</span>
          <button
            type="button"
            className={`header-copy-code-btn ${copied ? "copied" : ""}`}
            onClick={onShare}
            title="Copy Room Code"
          >
            {copied ? (
              <>
                <Check size={13} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default RoomHeaderBar;
