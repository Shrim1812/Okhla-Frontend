import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const VerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const handleVerify = async () => {
        const email = localStorage.getItem("resetEmail"); // Email fetch from localStorage
        if (!email) {
            setMessage("Email not found. Please go through forgot password again.");
            return;
        }
        try {
            const res = await axios.post("https://okhla-backend.onrender.com/Ohkla/verify-otp", {
                email,
                otp
            });
            if (res.data.success) {
                setMessage("OTP verified successfully.");
                // :white_check_mark: Redirect to Reset Password page
                navigate("/reset-password");
            } else {
                setMessage(res.data.message || "Invalid OTP");
            }
        } catch (err) {
            setMessage("OTP verification failed. Please try again.");
        }
    };
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
                <h3 className="text-center mb-4">Verify OTP</h3>
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <button className="btn btn-primary w-100" onClick={handleVerify}>
                    Verify
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
export default VerifyOTP;






