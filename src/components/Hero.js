import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
    return (
        <section className="hero bg-gray-50">
            <div className="container py-12">
                <div className="hero-content flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="hero-text w-full lg:w-1/2 animate-slide-up">
                        <h1 className="hero-title text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Master Languages with <span className="text-primary">Smart Flashcards</span>
                        </h1>
                        <p className="hero-subtitle text-lg text-gray-700 mb-8 leading-relaxed">
                            Transform your language learning journey with AI-powered flashcards, 
                            personalized study plans, and interactive exercises. 
                            Start learning smarter, not harder.
                        </p>
                        <div className="hero-buttons flex flex-wrap gap-4 mb-10">
                            <Link to="/register" className="btn btn-primary animate-pop">
                                <i className="fas fa-rocket"></i>
                                Start Free Trial
                            </Link>
                            <Link to="/discover" className="btn btn-outline hover-lift">
                                <i className="fas fa-compass"></i>
                                Explore Features
                            </Link>
                        </div>
                        <div className="hero-stats flex flex-wrap justify-start gap-8 py-4">
                            <div className="stat-item bg-white p-4 rounded-xl shadow-md pop-shadow">
                                <span className="stat-number text-2xl font-bold text-primary block">10K+</span>
                                <span className="stat-label text-gray-600">Active Users</span>
                            </div>
                            <div className="stat-item bg-white p-4 rounded-xl shadow-md pop-shadow">
                                <span className="stat-number text-2xl font-bold text-secondary block">1M+</span>
                                <span className="stat-label text-gray-600">Flashcards Created</span>
                            </div>
                            <div className="stat-item bg-white p-4 rounded-xl shadow-md pop-shadow">
                                <span className="stat-number text-2xl font-bold text-accent block">95%</span>
                                <span className="stat-label text-gray-600">Success Rate</span>
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