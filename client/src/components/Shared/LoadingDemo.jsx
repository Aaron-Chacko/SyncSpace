import React, { useState } from "react";

import Loader from "./Loader";
import Skeleton from "./Skeleton";
import LoadingButton from "./LoadingButton";

const LoadingDemo = () => {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "30px",
            }}
        >
            <div>
                <h2>Loader</h2>

                <Loader />
            </div>

            <div>
                <h2>Skeleton</h2>

                <Skeleton height="22px" width="220px" />

                <br />

                <Skeleton height="18px" />

                <br />

                <Skeleton height="18px" width="80%" />
            </div>

            <div>
                <h2>Loading Button</h2>

                <LoadingButton
                    loading={loading}
                    onClick={handleClick}
                >
                    Create Room
                </LoadingButton>
            </div>
        </div>
    );
};

export default LoadingDemo;