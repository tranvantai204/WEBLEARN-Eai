import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { faFire, faPencilAlt, faBook, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



function Hero({ badgeText, title, subtitle, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink }) {
    const { translateText } = useLanguage();
    
    function scrollToSection() {
        const section = document.getElementById('visualFeatures');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <section className="hero bg-gray-50 pb-5 pt-4">
            <div className="container py-10">
                <div className="hero-content flex flex-col lg:flex-row items-center justify-between gap-8 m-auto mt-3">
                    <div className="hero-text w-full lg:w-1/2 animate-slide-up">
                        <h1 className="hero-title text-4xl md:text-5xl font-bold text-gray-900 mb-3 text-center lg:text-left">
                            {translateText('Master new languages the smart way powered by')} <span className="text-primary">{translateText(' cutting-edge AI')}</span>
                        </h1>
                        <ul className="text-lg text-gray-700 mb-6 leading-relaxed list-inside text-center lg:text-left p-2" style={{listStyleType: 'none'}}>
                            <h4>
                                <li><FontAwesomeIcon icon={faFire} className="text-orange-500 mr-2" /> {translateText('Auto-generate smart flashcards in seconds')}</li>
                                <li><FontAwesomeIcon icon={faPencilAlt} className="text-blue-500 mr-2" /> {translateText('Get instant AI feedback on your writing')}</li>
                                <li><FontAwesomeIcon icon={faBook} className="text-green-500 mr-2" /> {translateText('Understand readings with smart explanations')}</li>
                                <li><FontAwesomeIcon icon={faGamepad} className="text-purple-500 mr-2" /> {translateText('Battle friends in online flashcard mode')}</li>

                            </h4>
                        </ul>

                        
                        <div className="hero-buttons flex flex-wrap gap-4 mb-8 justify-center lg:justify-start">
                            <Link to="/register" className="btn btn-primary animate-pop">
                                <i className="fas fa-rocket mr-2"></i>
                                {translateText('Start Free Trial')}
                            </Link>
                            <Link to="#" className="btn btn-outline hover-lift" onClick={() => scrollToSection()}>
                                <i className="fas fa-compass mr-2"></i>
                                {translateText('Explore Features')}
                            </Link>
                        </div>
                        <div className="hero-stats d-flex justify-content-center mt-4">
                            <div className="stat-item">
                                <span className="stat-number text-primary">10K+</span>
                                <span className="stat-label">{translateText('Active Users')}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number text-secondary">1M+</span>
                                <span className="stat-label">{translateText('Flashcards Created')}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number text-accent">95%</span>
                                <span className="stat-label">{translateText('Success Rate')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-image w-full lg:w-1/2 relative">
                        <div className="hero-image-blob absolute -z-10 opacity-75 w-full h-full bg-primary-50 rounded-full filter blur-3xl"></div>
                        <img 
                            src="/images/hero-image.png" 
                            alt="WordWise Platform Preview" 
                            className="w-full max-w-md mx-auto animate-fade-in hover-lift"
                        />
                        <div className="hero-decorations">
                            <div className="hero-decoration-1 absolute top-0 right-0 w-16 h-16 bg-accent-50 rounded-full opacity-75 animate-pulse"></div>
                            <div className="hero-decoration-2 absolute bottom-10 left-10 w-10 h-10 bg-secondary-50 rounded-full opacity-75 animate-bounce"></div>
                            <div className="hero-decoration-3 absolute top-20 left-0 w-8 h-8 bg-primary-50 rounded-full opacity-75 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;