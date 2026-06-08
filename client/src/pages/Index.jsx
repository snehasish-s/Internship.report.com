import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="landing-page">
      <nav className="landing-nav animate-in">
        <div className="landing-brand">
          <span>INTERNLOG</span>
        </div>
        <div className="landing-nav-links">
          {user ? (
            <Link
              to={user.role === 'admin' ? '/admin' : '/dashboard'}
              className="btn btn-cta"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/login" className="btn btn-cta">
              Log In
            </Link>
          )}
        </div>
      </nav>

      <main className="landing-main">
        <div className="hero-section animate-in">
          <div className="hero-content">
            <div className="retro-badge">v2.0 // DATA ANALYTICS ONLY</div>
            <h1 className="hero-title">
              Track your <span className="text-pink">growth</span>,<br />
              one session at a time.
            </h1>
            <p className="hero-subtitle">
              A premium, high-contrast dashboard to track your learnings, tools used, ratings, confidence scores, and resolve doubt tickets in one central interface.
            </p>
            <div className="hero-actions">
              {user ? (
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="btn btn-cta hero-btn"
                >
                  Enter Dashboard
                </Link>
              ) : (
                <Link to="/login" className="btn btn-cta hero-btn">
                  Get Started Now
                </Link>
              )}
            </div>
          </div>

          <div className="hero-visual">
            <div className="scanline-box">
              <div className="scanline"></div>
              <div className="code-preview">
                &gt; INITIALIZING DB... [OK]<br />
                &gt; LOADING ANALYTICS CORE... [OK]<br />
                &gt; ACCENTS LOADED (NOIR PIXEL)... [OK]<br />
                <br />
                USER: {user ? user.name.toUpperCase() : 'ANONYMOUS_SESSION'}<br />
                STATUS: {user ? 'LOGGED_IN' : 'AWAITING_AUTH'}<br />
                TRACKED TOPICS: pandas, numpy, sql, ml, seaborn, powerbi<br />
                <span className="blinking-cursor">_</span>
              </div>
            </div>
          </div>
        </div>

        <section className="features-section animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="feature-card">
            <div className="feature-icon">★</div>
            <h3>Log Sessions</h3>
            <p>Log topics like Pandas, SQL queries, Excel formulas, Power BI metrics, or machine learning models. Keep track of dataset and mentor details.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">?</div>
            <h3>Clear Doubts</h3>
            <p>File specific questions linked to your logged sessions, track status, and get feedback directly from your instructors.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">~</div>
            <h3>Visual Analytics</h3>
            <p>See charts detailing your session metrics, hours completed, and average self-reported confidence progress per core tool.</p>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>Built for Data Analytics Internship Classes. Powered by MERN Stack & MongoDB Atlas.</p>
      </footer>
    </div>
  );
};

export default Index;
