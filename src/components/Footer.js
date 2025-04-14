import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section brand">
                    <h3>WordWise</h3>
                    <p>Empowering language learners through AI technology.</p>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                    </div>
                </div>
                <div className="footer-section links">
                    <h3>About</h3>
                    <ul>
                        <li><Link to="/our-story">Our Story</Link></li>
                        <li><Link to="/how-it-works">How it Works</Link></li>
                        <li><Link to="/testimonials">Testimonials</Link></li>
                        <li><Link to="/careers">Careers</Link></li>
                    </ul>
                </div>
                <div className="footer-section links">
                    <h3>Resources</h3>
                    <ul>
                        <li><Link to="/blog">Blog</Link></li>
                        <li><Link to="/help-center">Help Center</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                    </ul>
                </div>
                <div className="footer-section contact">
                    <h3>Contact Us</h3>
                    <p>Email: info@wordwise.com</p>
                    <p>Phone: +1 (234) 567-8901</p>
                    <p>Address: 123 Learning Lane, Education City, 12345</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2023 WordWise. All rights reserved.</p>
                <div className="footer-legal">
                    <Link to="/privacy-policy">Privacy Policy</Link>
                    <Link to="/terms-of-service">Terms of Service</Link>
                    <Link to="/cookies">Cookies</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;