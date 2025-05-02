import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

function Hero({ badgeText, title, subtitle, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink }) {
    const { translateText } = useLanguage();
    
    return (
        <section className="hero bg-gray-50">
            <div className="container py-10">
                <div className="hero-content flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="hero-text w-full lg:w-1/2 animate-slide-up">
                        <h1 className="hero-title text-4xl md:text-5xl font-bold text-gray-900 mb-3 text-center lg:text-left">
                            {translateText('Master Languages with')} <span className="text-primary">{translateText('Smart Flashcards')}</span>
                        </h1>
                        <p className="hero-subtitle text-lg text-gray-700 mb-6 leading-relaxed text-center lg:text-left">
                            {translateText('Transform your language learning journey with AI-powered flashcards, personalized study plans, and interactive exercises. Start learning smarter, not harder.')}
                        </p>
                        <div className="hero-buttons flex flex-wrap gap-4 mb-8 justify-center lg:justify-start">
                            <Link to="/register" className="btn btn-primary animate-pop">
                                <i className="fas fa-rocket mr-2"></i>
                                {translateText('Start Free Trial')}
                            </Link>
                            <Link to="/discover" className="btn btn-outline hover-lift">
                                <i className="fas fa-compass mr-2"></i>
                                {translateText('Explore Features')}
                            </Link>
                        </div>
                        <div className="hero-stats">
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