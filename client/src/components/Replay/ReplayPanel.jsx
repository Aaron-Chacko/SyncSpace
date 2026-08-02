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
          aria-label="Replay Timeline"
        />

        <div className="timeline-time">
          <span>00:15</span>
          <span>01:00</span>
        </div>
      </div>

      <div className="replay-controls">
        <button
          className="secondary-btn"
          aria-label="Previous Frame"
          title="Previous Frame"
        >
          <SkipBack size={18} />
          Previous
        </button>

        <button
          className="primary-btn"
          aria-label="Play Replay"
          title="Play Replay"
        >
          <Play size={18} />
          Play
        </button>

        <button
          className="secondary-btn"
          aria-label="Pause Replay"
          title="Pause Replay"
        >
          <Pause size={18} />
          Pause
        </button>

        <button
          className="secondary-btn"
          aria-label="Next Frame"
          title="Next Frame"
        >
          <SkipForward size={18} />
          Next
        </button>
      </div>
    </div>
  );
};

export default ReplayPanel;