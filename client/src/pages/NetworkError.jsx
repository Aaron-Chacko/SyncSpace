import React from "react";
import { WifiOff } from "lucide-react";

const NetworkError = () => {
    return (
        <div className="error-page">
            <WifiOff size={90} />

            <h1>Network Error</h1>

            <p>
                Unable to connect to the server.
            </p>

            <button
                className="primary-btn"
                onClick={() => window.location.reload()}
            >
                Retry
            </button>
        </div>
    );
};

export default NetworkError;