import React from "react";

const DeleteRoom = ({ roomName, onCancel }) => {
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
                >
                    Cancel
                </button>

                <button
                    className="primary-btn"
                    onClick={() => {
                        alert(`${roomName} deleted`);
                        onCancel();
                    }}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default DeleteRoom;