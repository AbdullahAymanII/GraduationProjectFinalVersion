import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Loading from "./pages/app/Loading";
// import Login from "./pages/loginForm/Login";
import LandingPage from "./pages/LandingPage/LandingPage";
// import OAuth2RedirectHandler from "./pages/app/OAuth2RedirectHandler";
import NotFound from "./pages/app/NotFound";
import LoginForm from "./pages/loginForm/Login";
import OAuth2RedirectHandler from "./pages/app/OAuth2RedirectHandler";
import SignUpForm from "./pages/loginForm/SignUp";
import DashboardPage from "./pages/DashboardPage/DashboardPage";

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
      <div className="App">
        <AnimatePresence mode="wait">
          {loading && <Loading />}
        </AnimatePresence>

        {!loading && (
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>LandingPage
                <Route path="/" element={<LandingPage />} />
                <Route path="/LoginForm" element={<LoginForm />} />
                <Route path="/SignUpForm" element={<SignUpForm />} />
                <Route path="/DashboardPage" element={<DashboardPage />} />
                <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                <Route path="*" element={<NotFound />} />

              </Routes>
            </AnimatePresence>
        )}
      </div>
  );
}

export default function AppWrapper() {
  return (
      <Router>
        <App />
      </Router>
  );
}
