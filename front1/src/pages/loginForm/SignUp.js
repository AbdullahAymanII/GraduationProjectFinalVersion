import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import '@fortawesome/fontawesome-free/css/all.min.css';


function SignUpForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    // const [error, setError] = useState("");
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const signUpData = { username, email, password };

        try {
            const response = await fetch("http://localhost:8080/api/sign-up", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signUpData),
            });

            if (response.ok) {
                setMessage('Registration successful! Redirecting...');
                navigate("/LoginForm");
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Registration failed, please try again.');
                setIsError(true);
            }

        } catch (err) {
            setMessage('An error occurred during registration.');
            setIsError(true);
        }
    };

    const handleOAuthLogin = (provider) => {
        window.location.href = `http://localhost:8080/api/sign-in/provider/${provider}`;
    };

    return (
        <div className="LoginPage">
            <div className="glowing-light"></div>
            <div className="signUp-box">
                <form onSubmit={handleSubmit}>
                    <input type="checkbox" className="input-check" id="input-check"/>
                    <label htmlFor="input-check" className="toggle">
                        <span className="text off">off</span>
                        <span className="text on">on</span>
                    </label>
                    <div className="light"></div>

                    <h2>Create New Account</h2>
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
                    {message && (
                        <div className={`message ${isError ? 'error' : 'success'}`}>
                            {message}
                        </div>
                    )}

                    <div className="input-box">
            <span className="icon">
              <ion-icon name="mail"></ion-icon>
            </span>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label>Username</label>
                        <div className="input-line"></div>
                    </div>

                    <div className="input-box">
            <span className="icon">
              <ion-icon name="mail"></ion-icon>
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

                    <button type="submit">Sign-Up</button>

                    <div className="register-link">
                        <p>
                            You Already have an account? <a href="#" onClick={()=>navigate("/LoginForm")}>Login</a>
                        </p>
                    </div>
                </form>
            </div>

            {/* Error Modal */}
            {/*{error && (*/}
            {/*    <div className="error-modal">*/}
            {/*        <div className="error-content">*/}
            {/*            <h3>Error</h3>*/}
            {/*            <p>{error}</p>*/}
            {/*            <button onClick={() => setError("")}>Close</button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
            <script type="module" src={"https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"}></script>
            <script noModule src={"https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"}></script>
        </div>
    );
}

export default SignUpForm;
