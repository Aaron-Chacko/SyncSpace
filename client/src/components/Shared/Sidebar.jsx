import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderKanban, History, Sparkles, Layers } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Active Rooms", path: "/dashboard", icon: FolderKanban },
    { label: "Replay & History", path: "/replay", icon: History },
  ];

  return (
    <aside className="rich-dashboard-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <Layers size={18} className="brand-icon" />
          <span>Workspace</span>
        </div>
      </div>

      <div className="sidebar-nav-group">
        <span className="sidebar-group-title">NAVIGATION</span>
        <nav className="sidebar-nav-list">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path && idx === 0;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
              >
                <Icon size={16} className="nav-item-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer-card">
        <div className="footer-card-badge">
          <Sparkles size={14} color="#a855f7" />
          <span>SyncSpace v2.0</span>
        </div>
        <p className="footer-card-desc">Real-time code & canvas engine ready</p>
      </div>
    </aside>
  );
};

export default Sidebar;
