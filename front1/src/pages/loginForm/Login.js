import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginData = { email, password };

        try {
            const response = await fetch("http://localhost:8080/api/sign-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) throw new Error("Invalid login credentials.");

            const data = await response.json();
            localStorage.setItem("token", data.token);
            navigate("/DashboardPage");
        } catch (err) {
            console.error("Error:", err);
            setError("Login failed. Please check your email and password.");
        }
    };

    const handleOAuthLogin = (provider) => {
        window.location.href = `http://localhost:8080/api/sign-in/provider/${provider}`;
    };

    return (
        <div className="LoginPage">
            <div className="glowing-light"></div>
            <div className="login-box">
                <form onSubmit={handleSubmit}>
                    <input type="checkbox" className="input-check" id="input-check"/>
                    <label htmlFor="input-check" className="toggle">
                        <span className="text off">off</span>
                        <span className="text on">on</span>
                    </label>
                    <div className="light"></div>

                    <h2>Login</h2>
                    <div className="social-icons">
                        <a href="#" className="icon" onClick={() => handleOAuthLogin('google')}><i
                            className="fa-brands fa-google-plus-g"></i></a>
                        <a href="#" className="icon" onClick={() => handleOAuthLogin('facebook')}><i
                            className="fa-brands fa-facebook-f"></i></a>
                        <a href="#" className="icon" onClick={() => handleOAuthLogin('github')}><i
                            className="fa-brands fa-github"></i></a>
                        <a href="#" className="icon" onClick={() => handleOAuthLogin('linkedin')}><i
                            className="fa-brands fa-linkedin-in"></i></a>
                    </div>
                    <div className="input-box">
            <span className="icon">
              <ion-icon name="lock-closed"></ion-icon>
            </span>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label>Email</label>
                        <div className="input-line"></div>
                    </div>

                    <div className="input-box">
            <span className="icon">
              <ion-icon name="lock-closed"></ion-icon>
            </span>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label>Password</label>
                        <div className="input-line"></div>
                    </div>

                    <div className="remember-forgot">
                        <label>
                            <input type="checkbox"/> Remember me
                        </label>
                        <a href="#">Forgot Password?</a>
                    </div>

                    <button type="submit">Login</button>

                    <div className="register-link">
                        <p>
                            Don't have an account? <a href="#" onClick={() => navigate("/SignUpForm")}>Register</a>
                        </p>
                    </div>
                </form>
            </div>

            {/* Error Modal */}
            {error && (
                <div className="error-modal">
                    <div className="error-content">
                        <h3>Error</h3>
                        <p>{error}</p>
                        <button onClick={() => setError("")}>Close</button>
                    </div>
                </div>
            )}
            <script type="module" src={"https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"}></script>
            <script noModule src={"https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"}></script>
        </div>
    );
}

export default LoginForm;
