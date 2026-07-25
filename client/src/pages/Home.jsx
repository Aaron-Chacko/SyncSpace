import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="page home-page">
      <div className="hero">
        <h1>SyncSpace</h1>

        <p>
          Real-Time Collaborative Whiteboard & Code Editor for Teams
        </p>

        <div className="hero-buttons">
          <Link to="/login" className="btn primary">
            Login
          </Link>

          <Link to="/signup" className="btn secondary">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;