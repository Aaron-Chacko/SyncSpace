import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldX } from "lucide-react";

const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <div className="error-page">
            <ShieldX size={90} />

            <h1>Access Denied</h1>

            <p>
                You don't have permission to access this page.
            </p>

            <button
                className="primary-btn"
                onClick={() => navigate("/dashboard")}
            >
                Go Dashboard
            </button>
        </div>
    );
};

export default AccessDenied;