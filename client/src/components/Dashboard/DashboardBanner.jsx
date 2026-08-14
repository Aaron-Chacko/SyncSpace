import { PlusCircle, Sparkles } from "lucide-react";

const DashboardBanner = ({ onCreateRoom }) => {
  return (
    <div className="dashboard-banner">
      <div className="banner-content">
        <h1>👋 Welcome Back</h1>

        <p>
          Collaborate with your team in real-time.
          Create rooms, invite members, and start coding together.
        </p>

        <button
          type="button"
          className="rich-primary-btn banner-cta-btn"
          onClick={onCreateRoom}
        >
          <PlusCircle size={18} />
          <span>Create New Room</span>
          <Sparkles size={16} className="btn-sparkle" />
        </button>
      </div>
    </div>
  );
};

export default DashboardBanner;