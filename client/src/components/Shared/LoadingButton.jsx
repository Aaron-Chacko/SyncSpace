import React from "react";
import Loader from "./Loader";

const LoadingButton = ({
    loading,
    children,
    className = "primary-btn",
    ...props
}) => {
    return (
        <button
            className={className}
            disabled={loading}
            aria-busy={loading}
            aria-live="polite"
            {...props}
        >
            {loading ? <Loader size={18} /> : children}
        </button>
    );
};

export default LoadingButton;