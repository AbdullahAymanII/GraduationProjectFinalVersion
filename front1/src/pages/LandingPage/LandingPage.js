import React from "react";
import './LandingPage.css';


const LandingPage = () => {
    return (
        <div className="App">
            <header className="hero">
                <div className="overlay"></div>
                <div className="hero-content">
                    <h1>🛡️ Secure Your IoMT Devices</h1>
                    <p>AI-Powered Intrusion Detection for Healthcare Systems</p>
                    <div className="hero-buttons">
                        <a href="/LoginForm" className="btn-primary">Discover Our System</a>
                    </div>
                </div>
            </header>

            <section className="features">
                <h2>Features of Our Intrusion Detection System</h2>
                <div className="features-container">
                    <div className="feature-card">
                        <h3>🛡️ Real-Time Threat Detection</h3>
                        <p>Instantly detect and isolate security threats in IoMT networks.</p>
                    </div>
                    <div className="feature-card">
                        <h3>📊 AI-Based Analytics</h3>
                        <p>Gain insights with predictive analytics and detailed reports.</p>
                    </div>
                    <div className="feature-card">
                        <h3>🔒 Secure Device Integration</h3>
                        <p>Seamlessly integrate and monitor IoMT devices in real time.</p>
                    </div>
                    <div className="feature-card">
                        <h3>📈 Customizable Dashboard</h3>
                        <p>Tailor your views for actionable insights and threat management.</p>
                    </div>
                </div>
            </section>

            <section className="testimonials">
                <h2>What Our Users Say</h2>
                <div className="testimonial">
                    <p>
                        ⭐️⭐️⭐️⭐️⭐️ <br/>
                        "Our hospital's network has never been safer. This system detected
                        threats we didn't even know existed!"
                    </p>
                    <span>- Healthcare IT Manager, MedSecure Hospital</span>
                </div>
            </section>

            <footer className="footer">
                <p>© 2024 IoMT IDS. All Rights Reserved.</p>
                <div className="footer-links">
                    <a href="#about">About Us</a>
                    <a href="#contact">Contact</a>
                    <a href="#privacy">Privacy Policy</a>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
