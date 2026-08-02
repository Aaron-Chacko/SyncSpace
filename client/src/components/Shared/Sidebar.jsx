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
                >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                </button>

                {/* Rooms */}
                <button
                    className="sidebar-item"
                    onClick={() => navigate("/dashboard")}
                >
                    <FolderOpen size={18} />
                    <span>Rooms</span>
                </button>

                {/* Replay */}
                <button
                    className={`sidebar-item ${location.pathname === "/replay" ? "active" : ""
                        }`}
                    onClick={() => navigate("/replay")}
                >
                    <History size={18} />
                    <span>Replay</span>
                </button>
                <button
                    className={`sidebar-item ${location.pathname === "/network-error" ? "active" : ""
                        }`}
                    onClick={() => navigate("/network-error")}
                >
                    <WifiOff size={18} />
                    <span>Network Error</span>
                </button>
            <button
                className={`sidebar-item ${location.pathname === "/loading" ? "active" : ""
                    }`}
                onClick={() => navigate("/loading")}
            >
                <Loader2 size={18} />
                <span>Loading</span>
            </button>

                <button
                    className={`sidebar-item ${location.pathname === "/access-denied" ? "active" : ""
                        }`}
                    onClick={() => navigate("/access-denied")}
                >
                    <ShieldX size={18} />
                    <span>Access Denied</span>
                </button>
            </nav>


            {/* Logout */}
            <button
                className="sidebar-item logout-btn"
                onClick={() => navigate("/")}
            >
                <LogOut size={18} />
                <span>Logout</span>
            </button>

        </aside>
    );
};

export default Sidebar;