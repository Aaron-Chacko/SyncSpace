import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, LayoutDashboard, Sparkles, LogIn, UserPlus } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <nav className="app-navbar">
      <Link
        to="/"
        className="logo"
        aria-label="Go to Home"
        title="Home"
      >
        <Sparkles size={18} className="logo-sparkle" />
        <span>SyncSpace</span>
      </Link>

      <div className="nav-links">
        {user ? (
          <>
            <div className="user-profile-badge">
              <div className="user-avatar-circle">
                <span>{getInitials(user.name)}</span>
                <span className="online-indicator"></span>
              </div>
              <span className="user-name-label">{user.name}</span>
            </div>

            <Link
              to="/dashboard"
              className="nav-item-link"
              aria-label="Dashboard"
              title="Dashboard"
            >
              <LayoutDashboard size={14} />
              <span>Dashboard</span>
            </Link>

            <button
              className="nav-logout-btn"
              onClick={handleLogout}
              aria-label="Log Out"
              title="Log Out"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="nav-item-link"
              aria-label="Login"
              title="Login"
            >
              <LogIn size={14} />
              <span>Login</span>
            </Link>

            <Link
              to="/signup"
              className="nav-primary-link"
              aria-label="Signup"
              title="Signup"
            >
              <UserPlus size={14} />
              <span>Sign Up</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
