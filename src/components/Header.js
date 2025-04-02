import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img src="/images/wordwise-logo.svg" alt="WordWise" className="logo-image" />
          <span className="logo-text">WordWise</span>
        </Link>
        
        <nav className="main-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/flashcards" className="nav-link">
                <i className="fas fa-layer-group"></i>
                <span>Flashcards</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/readings" className="nav-link">
                <i className="fas fa-book"></i>
                <span>Readings</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/writing" className="nav-link">
                <i className="fas fa-pen"></i>
                <span>Writing</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/discover" className="nav-link">
                <i className="fas fa-compass"></i>
                <span>Discover</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="header-actions">
          <Link to="/login" className="btn btn-outline btn-sm header-login">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm header-signup">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header; 