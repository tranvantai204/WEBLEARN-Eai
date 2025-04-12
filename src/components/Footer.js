import React from 'react';
import { Link } from 'react-router-dom';
import '../css/components/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/images/wordwise-logo.svg" alt="WordWise" className="footer-logo-image" />
              <span className="footer-logo-text">WordWise</span>
            </Link>
            <p className="footer-tagline">
              Learn languages smarter, not harder
            </p>
            <div className="footer-social">
              <a href="https://twitter.com" className="social-link" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://facebook.com" className="social-link" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" className="social-link" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://youtube.com" className="social-link" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h3 className="footer-heading">Learn</h3>
              <ul className="footer-nav">
                <li><Link to="/flashcards" className="footer-link">Flashcards</Link></li>
                <li><Link to="/readings" className="footer-link">Readings</Link></li>
                <li><Link to="/writing" className="footer-link">Writing</Link></li>
                <li><Link to="/discover" className="footer-link">Discover</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3 className="footer-heading">About</h3>
              <ul className="footer-nav">
                <li><Link to="/about" className="footer-link">Our Story</Link></li>
                <li><Link to="/how-it-works" className="footer-link">How It Works</Link></li>
                <li><Link to="/testimonials" className="footer-link">Testimonials</Link></li>
                <li><Link to="/careers" className="footer-link">Careers</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3 className="footer-heading">Resources</h3>
              <ul className="footer-nav">
                <li><Link to="/resources" className="footer-link">Blog</Link></li>
                <li><Link to="/resources" className="footer-link">Help Center</Link></li>
                <li><Link to="/resources" className="footer-link">FAQ</Link></li>
                <li><Link to="/resources" className="footer-link">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} WordWise. All rights reserved.
          </p>
          <div className="legal-links">
            <Link to="/resources" className="legal-link">Terms of Service</Link>
            <Link to="/resources" className="legal-link">Privacy Policy</Link>
            <Link to="/resources" className="legal-link">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;