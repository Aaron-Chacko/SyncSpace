import React from "react";

import Sidebar from "../components/Shared/Sidebar";
import LoadingDemo from "../components/Shared/LoadingDemo";

const Loading = () => {
    return (
        <div className="dashboard-layout">
            <Sidebar />

            <div className="dashboard-page">
                <LoadingDemo />
            </div>
        </div>
    );
};

export default Loading;