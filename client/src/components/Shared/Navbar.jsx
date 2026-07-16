import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="app-navbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
      <Link to="/" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 'bold', fontSize: '20px' }}>SyncSpace</Link>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;