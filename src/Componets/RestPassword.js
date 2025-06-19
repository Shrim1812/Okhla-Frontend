 import React, { useState } from "react";
import axios from "axios";
const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const handleReset = async () => {
        const email = localStorage.getItem("resetEmail");
        if (newPassword !== confirm) {
            setMessage("Passwords do not match");
            return;
        }
        try {
            const res = await axios.post("https://okhla-backend.onrender.com/Ohkla/reset-password", {
                email,
                newPassword,
            });
            setMessage(res.data.message);
            setTimeout(() => {
                window.location.href = "/"; // back to login
            }, 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to reset password");
        }
    };
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
                <h3 className="text-center mb-4">Reset Password</h3>
                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Confirm Password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                />
                <button className="btn btn-primary w-100" onClick={handleReset}>
                    Reset Password
                </button>
                {message && (
                    <div className="alert alert-info mt-3" role="alert">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};
export default ResetPassword;
