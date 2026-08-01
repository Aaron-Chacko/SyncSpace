import React from "react";
import Sidebar from "../components/Shared/Sidebar";
import ReplayPanel from "../components/Replay/ReplayPanel";

const Replay = () => {
    return (
        <div className="dashboard-layout">
            <Sidebar />

            <div className="dashboard-page">
                <ReplayPanel />
            </div>
        </div>
    );
};

export default Replay;