import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

 const handleLogout = async () => {
  await logout();
  navigate("/");
  };

  return (
    <nav className="app-navbar">
      <Link
        to="/"
        className="logo"
        aria-label="Go to Home"
        title="Home"
      >
        SyncSpace
      </Link>

      <div className="nav-links">
        {user ? (
          <>
            <span>Welcome, {user.name}</span>

            <Link
              to="/dashboard"
              aria-label="Dashboard"
              title="Dashboard"
            >
              Dashboard
            </Link>

            <button
              className="secondary-btn"
              onClick={handleLogout}
              aria-label="Log Out"
              title="Log Out"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              aria-label="Login"
              title="Login"
            >
              Login
            </Link>

            <Link
              to="/signup"
              aria-label="Signup"
              title="Signup"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
