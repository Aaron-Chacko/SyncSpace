import React from "react";

const DeleteRoom = ({ roomName, onCancel, onConfirm, isDeleting }) => {
    return (
        <div>
            <p>
                Are you sure you want to delete <b>{roomName}</b>?
            </p>

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "flex-end",
                    marginTop: "20px",
                }}
            >
                <button
                    className="secondary-btn"
                    onClick={onCancel}
                    disabled={isDeleting}
                >
                    Cancel
                </button>

                <button
                    className="danger-btn"
                    onClick={onConfirm}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    );
};

export default DeleteRoom;
