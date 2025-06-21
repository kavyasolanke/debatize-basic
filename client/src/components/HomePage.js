import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      title: "Structured Debates",
      description: "Transform chaotic discussions into organized, evidence-based debates with clear arguments and counterpoints.",
      icon: "🎯",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      title: "Decision Intelligence",
      description: "Leverage AI-powered analysis to extract insights and identify the strongest arguments from every discussion.",
      icon: "🧠",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      title: "Verified Voices",
      description: "Connect with experts and verified contributors who bring credibility and depth to every debate topic.",
      icon: "✅",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      title: "Real Impact",
      description: "Drive awareness, clarity, and actionable insights that lead to better decisions and meaningful change.",
      icon: "🚀",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [features.length]);

  const stats = [
    { number: '40%', label: 'Better Decisions' },
    { number: '10K+', label: 'Structured Debates' },
    { number: '95%', label: 'Evidence-Based' },
    { number: '24/7', label: 'AI-Powered Analysis' }
  ];

  return (
    <div className="home-page">
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <img 
              src="/logo1.png" 
              alt="Debatize Logo" 
              className="logo-image"
              onError={(e) => {
                // Fallback to text if logo fails
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <h1 className="logo-text-fallback" style={{ display: 'none' }}>Debatize</h1>
          </div>
          <nav className="nav">
            <a href="#features" className="nav-link">Features</a>
            <a href="#about" className="nav-link">About</a>
            <button 
              className="cta-button"
              onClick={() => navigate('/topics')}
            >
              Start Debating
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Where Logic 
              <span className="highlight"> Meets Impact</span>
            </h1>
            <p className="hero-subtitle">
              Transform chaotic discussions into structured, evidence-based debates. 
              Drive awareness, clarity, and actionable insights through meaningful dialogue.
            </p>
            <div className="hero-buttons">
              <button 
                className="primary-button"
                onClick={() => navigate('/topics')}
              >
                <span className="button-text">Explore Topics</span>
                <span className="button-icon">→</span>
              </button>
              <button className="secondary-button">
                <span className="button-text">Learn More</span>
                <span className="button-icon">↓</span>
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card">
              <div className="card-header">
                <span className="user-avatar">👤</span>
                <span className="user-name">VerifiedAnalyst</span>
              </div>
              <div className="card-content">
                "Evidence shows that structured debates lead to 40% better decision outcomes..."
              </div>
              <div className="card-actions">
                <span className="vote-count">+23</span>
                <span className="vote-buttons">⬆️ ⬇️</span>
              </div>
            </div>
            <div className="floating-card delayed">
              <div className="card-header">
                <span className="user-avatar">👤</span>
                <span className="user-name">PolicyExpert</span>
              </div>
              <div className="card-content">
                "This platform enables data-driven policy discussions with real impact..."
              </div>
              <div className="card-actions">
                <span className="vote-count">+15</span>
                <span className="vote-buttons">⬆️ ⬇️</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Why Choose Debatize?</h2>
          <p>Experience the future of online discussions</p>
        </div>
        
        <div className="features-showcase">
          <div className="feature-display">
            <div className="feature-visual">
              <div 
                className="feature-icon"
                style={{ background: features[currentFeature].gradient }}
              >
                {features[currentFeature].icon}
              </div>
            </div>
            <div className="feature-content">
              <h3>{features[currentFeature].title}</h3>
              <p>{features[currentFeature].description}</p>
            </div>
          </div>
          
          <div className="feature-dots">
            {features.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentFeature ? 'active' : ''}`}
                onClick={() => setCurrentFeature(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Discussions?</h2>
          <p>Join thousands of users making better decisions through structured, evidence-based debates</p>
          <button 
            className="cta-button-large"
            onClick={() => navigate('/topics')}
          >
            Start Structured Debating
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img 
                src="/logo1.png" 
                alt="Debatize Logo" 
                className="footer-logo-image"
                onError={(e) => {
                  // Fallback to text if logo fails
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <h3 className="footer-logo-text-fallback" style={{ display: 'none' }}>Debatize</h3>
            </div>
            <p>Transforming discussions into structured, evidence-based debates that drive better decisions and real impact.</p>
          </div>
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Structured Debates</li>
              <li>Decision Intelligence</li>
              <li>Verified Voices</li>
              <li>AI-Powered Analysis</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Community Guidelines</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <button className="social-button">Twitter</button>
              <button className="social-button">LinkedIn</button>
              <button className="social-button">GitHub</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Debatize. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 