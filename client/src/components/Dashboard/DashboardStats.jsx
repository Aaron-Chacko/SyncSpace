import React from "react";
import {
    Users,
    FolderOpen,
    Activity,
    FileText,
} from "lucide-react";

const DashboardStats = ({
    totalRooms,
    totalMembers,
    activeRooms,
    filesShared,
}) => {
    const stats = [
        {
            title: "Total Rooms",
            value: totalRooms,
            icon: <FolderOpen size={26} />,
        },
        {
            title: "Members",
            value: totalMembers,
            icon: <Users size={26} />,
        },
        {
            title: "Active Rooms",
            value: activeRooms,
            icon: <Activity size={26} />,
        },
        {
            title: "Files Shared",
            value: filesShared,
            icon: <FileText size={26} />,
        },
    ];

    return (
        <div className="dashboard-stats">
            {stats.map((item, index) => (
                <div
                    key={index}
                    className="stat-card"
                >
                    <div className="stat-icon">
                        {item.icon}
                    </div>

                    <div className="stat-info">
                        <h3>{item.value}</h3>
                        <p>{item.title}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;