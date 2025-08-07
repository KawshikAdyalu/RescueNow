import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* 🔹 Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>🌍 RescueNow</h1>
          <p>Real-Time Disaster Management and SOS Alert Platform</p>
          <div className="hero-buttons">
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")} className="outline">
              Register
            </button>
          </div>
        </div>
      </header>

      {/* 🔹 About Section */}
      <section className="about">
        <h2>What is RescueNow?</h2>
        <p>
          RescueNow is a real-time disaster response and emergency SOS alerting
          system. Whether it’s floods, earthquakes, fires, or critical distress,
          users can report incidents instantly while admins monitor live updates,
          assign response teams, and save lives more efficiently.
        </p>
      </section>

      {/* 🔹 Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} RescueNow. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
