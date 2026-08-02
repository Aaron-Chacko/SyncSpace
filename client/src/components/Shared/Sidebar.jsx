import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    FolderOpen,
    History,
    LogOut,
    Loader2,
    WifiOff,
    ShieldX,
} from "lucide-react";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-logo">
                <h2>SyncSpace</h2>
            </div>

            <nav className="sidebar-menu">
                {/* Dashboard */}
                <button
                    className={`sidebar-item ${location.pathname === "/dashboard" ? "active" : ""
                        }`}
                    onClick={() => navigate("/dashboard")}
                    aria-label="Dashboard"
                    title="Dashboard"
                >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                </button>

                {/* Rooms */}
                <button
                    className="sidebar-item"
                    onClick={() => navigate("/dashboard")}
                    aria-label="Rooms"
                    title="Rooms"
                >
                    <FolderOpen size={18} />
                    <span>Rooms</span>
                </button>

                {/* Replay */}
                <button
                    className={`sidebar-item ${location.pathname === "/replay" ? "active" : ""
                        }`}
                    onClick={() => navigate("/replay")}
                    aria-label="Replay"
                    title="Replay"
                >
                    <History size={18} />
                    <span>Replay</span>
                </button>

                {/* Network Error */}
                <button
                    className={`sidebar-item ${location.pathname === "/network-error" ? "active" : ""
                        }`}
                    onClick={() => navigate("/network-error")}
                    aria-label="Network Error"
                    title="Network Error"
                >
                    <WifiOff size={18} />
                    <span>Network Error</span>
                </button>

                {/* Loading */}
                <button
                    className={`sidebar-item ${location.pathname === "/loading" ? "active" : ""
                        }`}
                    onClick={() => navigate("/loading")}
                    aria-label="Loading"
                    title="Loading"
                >
                    <Loader2 size={18} />
                    <span>Loading</span>
                </button>

                {/* Access Denied */}
                <button
                    className={`sidebar-item ${location.pathname === "/access-denied" ? "active" : ""
                        }`}
                    onClick={() => navigate("/access-denied")}
                    aria-label="Access Denied"
                    title="Access Denied"
                >
                    <ShieldX size={18} />
                    <span>Access Denied</span>
                </button>
            </nav>

            {/* Logout */}
            <button
                className="sidebar-item logout-btn"
                onClick={() => navigate("/")}
                aria-label="Logout"
                title="Logout"
            >
                <LogOut size={18} />
                <span>Logout</span>
            </button>
        </aside>
    );
};

export default Sidebar;