import React from "react";
import {
    LayoutDashboard,
    FolderOpen,
    History,
    LogOut,
} from "lucide-react";

const Sidebar = () => {
    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-logo">
                <h2>SyncSpace</h2>
            </div>

            <nav className="sidebar-menu">
                <button className="sidebar-item active">
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                </button>

                <button className="sidebar-item">
                    <FolderOpen size={18} />
                    <span>Rooms</span>
                </button>

                <button className="sidebar-item">
                    <History size={18} />
                    <span>Replay</span>
                </button>
            </nav>

            <button className="sidebar-item logout-btn">
                <LogOut size={18} />
                <span>Logout</span>
            </button>
        </aside>
    );
};

export default Sidebar;