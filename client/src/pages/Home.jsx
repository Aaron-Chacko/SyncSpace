import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="page home-page" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
      <h1>SyncSpace</h1>
      <p>Real-time collaborative whiteboard and code editor</p>
      <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
        <Link to="/login" style={{ padding: '10px 20px', background: 'var(--accent-primary)', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Get Started</Link>
      </div>
    </div>
  );
};

export default Home;