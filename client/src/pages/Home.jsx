import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, LogIn, UserPlus, Code2, Layout, Zap } from "lucide-react";

const Home = () => {
  return (
    <div className="page home-page">
      <div className="hero">
        <div className="hero-badge">
          <Sparkles size={14} className="hero-sparkle" />
          <span>Real-time Workspace v2.0</span>
        </div>

        <h1 className="hero-title">SyncSpace</h1>

        <p className="hero-subtitle">
          Next-generation Real-Time Collaborative Whiteboard & Code Editor built for high-performance engineering teams.
        </p>

        <div className="hero-buttons">
          <Link to="/login" className="btn primary">
            <LogIn size={18} />
            <span>Log In</span>
          </Link>

          <Link to="/signup" className="btn secondary">
            <UserPlus size={18} />
            <span>Create Free Account</span>
          </Link>
        </div>

        <div className="hero-features-grid">
          <div className="feature-card">
            <Code2 size={20} className="feat-icon" />
            <span>Multiplayer Monaco IDE</span>
          </div>
          <div className="feature-card">
            <Layout size={20} className="feat-icon" />
            <span>Infinite Konva Canvas</span>
          </div>
          <div className="feature-card">
            <Zap size={20} className="feat-icon" />
            <span>Yjs CRDT Sync Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;