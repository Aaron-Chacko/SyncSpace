import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { PlusCircle, Sparkles, FolderPlus, AlignLeft, ArrowRight, Tag, Loader2, AlertCircle } from "lucide-react";

const PRESET_TAGS = [
  { label: "Frontend Team", desc: "React UI development and styling" },
  { label: "Backend API", desc: "Express, Socket.io, and Database architecture" },
  { label: "System Design", desc: "Collaborative whiteboard practice" },
  { label: "Live Interview", desc: "Algorithms and live coding session" },
];

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!roomName.trim()) return;
    setError("");
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/rooms", { roomName: roomName.trim(), description: description.trim() });
      navigate(`/room/${data.room.roomCode}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create room. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyPreset = (preset) => {
    setRoomName(preset.label);
    setDescription(preset.desc);
  };

  return (
    <div className="rich-form-card">
      <div className="form-card-header">
        <div className="form-card-icon-badge">
          <Sparkles size={22} className="glowing-icon" />
        </div>
        <div>
          <h3 className="form-card-title">Create a Collaboration Room</h3>
          <p className="form-card-subtitle">Set up a real-time whiteboard & code workspace</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rich-form-body">
        {error && (
          <div className="form-error-banner" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="roomName" className="form-label">
            <FolderPlus size={14} className="label-icon" />
            <span>Room Name</span>
          </label>
          <div className="input-icon-wrapper">
            <input
              id="roomName"
              type="text"
              placeholder="e.g. Frontend Architecture Sync"
              aria-label="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
              className="rich-input"
              maxLength={60}
            />
            <span className="input-char-count">{roomName.length}/60</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="presets-container">
          <span className="presets-title">
            <Tag size={12} />
            <span>Quick Presets:</span>
          </span>
          <div className="presets-grid">
            {PRESET_TAGS.map((tag) => (
              <button
                type="button"
                key={tag.label}
                className={`preset-pill ${roomName === tag.label ? 'active' : ''}`}
                onClick={() => applyPreset(tag)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            <AlignLeft size={14} className="label-icon" />
            <span>Description (Optional)</span>
          </label>
          <textarea
            id="description"
            rows="3"
            placeholder="Describe the goal or agenda for this workspace..."
            aria-label="Room Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rich-textarea"
          />
        </div>

        <div className="form-footer">
          <button
            type="submit"
            className="rich-primary-btn"
            disabled={isSubmitting || !roomName.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="spin-icon" />
                <span>Creating Workspace...</span>
              </>
            ) : (
              <>
                <PlusCircle size={16} />
                <span>Create Workspace Room</span>
                <ArrowRight size={16} className="btn-arrow" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRoom;

