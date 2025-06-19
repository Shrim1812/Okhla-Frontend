import React, { useState } from "react";
import axios from "axios";
const ForgotPassword = () => {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const email = localStorage.getItem("resetEmail"); // :point_left: Get stored email
    const handleResetPassword = async () => {
        if (!otp || !newPassword || !confirmPassword) {
            setMessage("All fields are required.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }
        try {
            const res = await axios.post("https://okhla-backend.onrender.com/Ohkla/reset-password", {
                email,
                otp,
                newPassword,
            });
            setMessage(res.data.message);
            // Optionally redirect to login
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error resetting password.");
        }
    };
    return (
        <div>
            <h2>Reset Password</h2>
            <p>OTP has been sent to: <strong>{email}</strong></p>
            <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
            />
            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
            />
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
            />
            <button onClick={handleResetPassword}>Reset Password</button>
            <p>{message}</p>
        </div>
    );
};
export default ForgotPassword;






