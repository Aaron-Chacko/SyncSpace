import React from "react";

const DashboardBanner = () => {
    return (
        <div className="dashboard-banner">
            <div className="banner-content">
                <h1>👋 Welcome Back</h1>

                <p>
                    Collaborate with your team in real-time.
                    Create rooms, invite members, and start coding together.
                </p>

                <button className="primary-btn">
                    + Create New Room
                </button>
            </div>
        </div>
    );
};

export default DashboardBanner;