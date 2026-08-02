import React from "react";
import { useNavigate } from "react-router-dom";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="error-page">
            <FileQuestion size={90} />

            <h1>404</h1>

            <h2>Page Not Found</h2>

            <p>
                The page you are looking for doesn't exist.
            </p>

            <button
                className="primary-btn"
                onClick={() => navigate("/")}
            >
                Go Home
            </button>
        </div>
    );
};

export default NotFound;