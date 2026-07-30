import React, { useState } from "react";

const InviteUser = ({ roomName, onClose }) => {
    const [email, setEmail] = useState("");

    const handleInvite = () => {
        if (!email.trim()) {
            alert("Please enter an email.");
            return;
        }

        alert(`Invitation sent to ${email} for ${roomName}`);
        setEmail("");
        onClose();
    };

    return (
        <div>
            <p>Invite a user to <b>{roomName}</b></p>

            <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

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
                    onClick={onClose}
                >
                    Cancel
                </button>

                <button
                    className="primary-btn"
                    onClick={handleInvite}
                >
                    Send Invite
                </button>
            </div>
        </div>
    );
};

export default InviteUser;