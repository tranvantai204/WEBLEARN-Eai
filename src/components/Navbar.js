import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import '../css/components/Navbar.css';

function Navbar() {
    const { currentLanguage, languages, changeLanguage, isTranslating } = useLanguage();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="navbar-logo">
                    WebLearnAI
                </Link>
            </div>
            
            <div className="navbar-menu">
                <div className="language-selector">
                    <select
                        value={currentLanguage}
                        onChange={(e) => changeLanguage(e.target.value)}
                        disabled={isTranslating}
                        className="language-select"
                    >
                        {languages.map(lang => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                    {isTranslating && (
                        <span className="translating-indicator">
                            <i className="fas fa-spinner fa-spin"></i>
                        </span>
                    )}
                </div>
                
                <Link to="/discover" className="nav-link">
                    <i className="fas fa-compass"></i>
                    Discover
                </Link>
                <Link to="/readings" className="nav-link">
                    <i className="fas fa-book"></i>
                    Readings
                </Link>
                <Link to="/writings" className="nav-link">
                    <i className="fas fa-pen"></i>
                    Writing
                </Link>
                <Link to="/flashcards" className="nav-link">
                    <i className="fas fa-cards"></i>
                    Flashcards
                </Link>
                <Link to="/profile" className="nav-link">
                    <i className="fas fa-user"></i>
                    Profile
                </Link>
            </div>
        </nav>
    );
}

export default Navbar; 