import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // 👉 if your CSS is in a separate file

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("https://okhla-backend.onrender.com/Ohkla/login", {
                email,
                password,
            });

            const { user } = res.data;
            localStorage.setItem("userId",user.userID)
            localStorage.setItem("role", user.role);
            localStorage.setItem("username", user.name);
            localStorage.setItem("email", email);
            localStorage.setItem("isLoggedIn", "true");

            setEmail("");
            setPassword("");

            navigate("/dashboard");
        } catch (err) {
            setError("Invalid email or password.");
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            alert("Please enter your email to proceed.");
            return;
        }

        try {
            const res = await axios.get(`https://okhla-backend.onrender.com/Ohkla/getRoleByEmail?Email=${email}`);
            const { role } = res.data;
            if (role === "admin") {
                await axios.post("https://okhla-backend.onrender.com/Ohkla/send-otp", { email });
                localStorage.setItem("resetEmail", email);
                navigate("/verify-otp");
            } else {
                alert("You are not allowed to forgot password.");
            }
        } catch (err) {
            alert("User not found or server error.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h3 className="text-center mb-4">Login</h3>

                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={handleLogin} autoComplete="off" name="loginForm">
                    <div className="form-group">
                        <label></label>
                        <input
                            type="email"
                            name="email"
                            autoComplete="off"
                            className="form-input"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label></label>
                        <input
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            className="form-input"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit" className="login-btn">
                            Login
                        </button>
                    </div>

                    <button type="button" className="forgot-btn" onClick={handleForgotPassword}>
                        Forgot Password?
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
