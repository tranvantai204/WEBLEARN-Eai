import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { 
    faEnvelope, 
    faPhone, 
    faLocationDot, 
    faPaperPlane, 
    faGlobe, 
    faChevronDown,
    faArrowUp
} from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [showLanguages, setShowLanguages] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    const [showBackToTop, setShowBackToTop] = useState(false);
    
    const languages = [
        'English', 
        'French', 
        'Spanish', 
        'German', 
        'Italian',
        'Vietnamese'
    ];
    
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email && email.includes('@') && email.includes('.')) {
            // Here you would typically send this to your API
            console.log('Subscribed email:', email);
            setSubscribed(true);
            setEmail('');
            setTimeout(() => {
                setSubscribed(false);
            }, 3000);
        }
    };
    
    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language);
        setShowLanguages(false);
        // Here you would typically implement language change logic
        console.log('Selected language:', language);
    };

    return (
        <footer className="footer">
            {showBackToTop && (
                <button 
                    className="back-to-top" 
                    onClick={scrollToTop}
                    aria-label="Back to top"
                >
                    <FontAwesomeIcon icon={faArrowUp} />
                </button>
            )}
            
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
                    
                    <div className="language-selector">
                        <div 
                            className="selected-language" 
                            onClick={() => setShowLanguages(!showLanguages)}
                        >
                            <FontAwesomeIcon icon={faGlobe} />
                            <span>{selectedLanguage}</span>
                            <FontAwesomeIcon 
                                icon={faChevronDown} 
                                className={`arrow ${showLanguages ? 'up' : ''}`} 
                            />
                        </div>
                        {showLanguages && (
                            <ul className="languages-dropdown">
                                {languages.map((language, index) => (
                                    <li 
                                        key={index} 
                                        onClick={() => handleLanguageSelect(language)}
                                        className={language === selectedLanguage ? 'active' : ''}
                                    >
                                        {language}
                                    </li>
                                ))}
                            </ul>
                        )}
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
                    <p><FontAwesomeIcon icon={faEnvelope} /> Email: info@wordwise.com</p>
                    <p><FontAwesomeIcon icon={faPhone} /> Phone: +84 246 296 9969</p>
                    <p><FontAwesomeIcon icon={faLocationDot} /> Address: Ho Chi Minh City, VietNam</p>
                </div>

                <div className="footer-section newsletter">
                    <h3>Subscribe to Our Newsletter</h3>
                    <p>Get the latest news and updates delivered to your inbox.</p>
                    <form onSubmit={handleSubscribe} className="newsletter-form">
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="subscribe-btn">
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                        </div>
                        {subscribed && <div className="success-message">Thank you for subscribing!</div>}
                    </form>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} WordWise. All rights reserved.</p>
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