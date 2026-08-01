import React from "react";
import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Clock,
} from "lucide-react";

const ReplayPanel = () => {
  return (
    <div className="replay-panel">
      <h2>Replay Session</h2>

      <div className="timeline-section">
        <div className="timeline-header">
          <Clock size={18} />
          <span>Timeline</span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value="25"
          readOnly
          className="timeline-slider"
        />

        <div className="timeline-time">
          <span>00:15</span>
          <span>01:00</span>
        </div>
      </div>

      <div className="replay-controls">
        <button className="secondary-btn">
          <SkipBack size={18} />
          Previous
        </button>

        <button className="primary-btn">
          <Play size={18} />
          Play
        </button>

        <button className="secondary-btn">
          <Pause size={18} />
          Pause
        </button>

        <button className="secondary-btn">
          <SkipForward size={18} />
          Next
        </button>
      </div>
    </div>
  );
};

export default ReplayPanel;