import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { KeyRound, LogIn, ClipboardPaste, Hash, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const navigate = useNavigate();

  const handleCodeChange = (e) => {
    setRoomCode(e.target.value.toUpperCase());
    setError("");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setRoomCode(text.trim().toUpperCase());
        setError("");
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 1800);
      }
    } catch {
      setError("Clipboard access denied. Please type room code manually.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanCode = roomCode.trim().toUpperCase();
    if (!cleanCode) return;
    setError("");
    setIsSubmitting(true);
    try {
      const { data } = await api.post(`/rooms/${cleanCode}/join`);
      navigate(`/room/${data.room.roomCode}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Room not found or access denied.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rich-form-card">
      <div className="form-card-header">
        <div className="form-card-icon-badge cyan">
          <KeyRound size={22} className="glowing-icon-cyan" />
        </div>
        <div>
          <h3 className="form-card-title">Join Existing Room</h3>
          <p className="form-card-subtitle">Enter 6-character room code to enter session</p>
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
          <div className="form-label-row">
            <label htmlFor="roomCode" className="form-label">
              <Hash size={14} className="label-icon" />
              <span>Room Code</span>
            </label>

            <button
              type="button"
              className="quick-paste-btn"
              onClick={handlePaste}
              title="Paste from clipboard"
            >
              {pasteSuccess ? (
                <>
                  <CheckCircle2 size={12} color="#10b981" />
                  <span style={{ color: "#10b981" }}>Pasted!</span>
                </>
              ) : (
                <>
                  <ClipboardPaste size={12} />
                  <span>Paste Code</span>
                </>
              )}
            </button>
          </div>

          <div className="input-code-wrapper">
            <input
              id="roomCode"
              type="text"
              placeholder="e.g. A1B2C3"
              aria-label="Room Code"
              value={roomCode}
              onChange={handleCodeChange}
              required
              className="rich-input room-code-input"
              maxLength={12}
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        </div>

        <div className="form-footer">
          <button
            type="submit"
            className="rich-secondary-btn cyan-gradient"
            disabled={isSubmitting || !roomCode.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="spin-icon" />
                <span>Joining Room...</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Join Workspace Room</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JoinRoom;

