import React, { useState, useEffect } from 'react';
import NotFound from '../assets/404.png';
import { useLanguage } from '../contexts/LanguageContext';

const NotFoundPage = () => {
    const { translateText } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
  
  // Animation for elements to appear with a delay
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="container-fluid bg-light py-5">
      {/* CSS animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .digital-symbol {
            position: absolute;
            color: rgba(13, 110, 253, 0.2);
            font-family: monospace;
            pointer-events: none;
            z-index: -1;
          }
          
          .float-animation {
            animation: float 6s ease-in-out infinite;
          }
          
          .fade-in {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeIn 1s forwards;
          }
          
          .delay-1 {
            animation-delay: 0.3s;
          }
          
          .delay-2 {
            animation-delay: 0.6s;
          }
          
          .delay-3 {
            animation-delay: 0.9s;
          }
          
          .pulse-animation {
            animation: pulse 2s infinite;
          }
          
          .rotate-animation {
            animation: rotate 20s linear infinite;
          }
          
          .image-container:hover img {
            transform: scale(1.05);
            transition: transform 0.3s ease;
          }
        `}
      </style>
      
      {/* Digital background decorations */}
      <div className="position-relative overflow-hidden" style={{ minHeight: '80vh' }}>
        {isVisible && Array(15).fill(0).map((_, i) => (
          <div 
            key={i}
            className="digital-symbol"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 12}px`,
              opacity: Math.random() * 0.3 + 0.1,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          >
            {['<>', '{}', '404', '[]', '//', '==', '!=', '=>'].sort(() => Math.random() - 0.5)[0]}
          </div>
        ))}
        
        <div className="row justify-content-center text-center">
          {/* 404 Text */}
          <div className="col-12 mb-4">
            <h1 className="display-1 fw-bold text-warning pulse-animation" style={{ fontSize: '7rem' }}>
              404
            </h1>
          </div>
          
          {/* Image container with animation */}
          <div className="col-12 col-md-6 mb-4 image-container">
            <div className="float-animation">
              <img 
                src={NotFound} 
                alt="404 - Page Not Found" 
                className="img-fluid" 
                style={{ maxWidth: '300px', transition: 'transform 0.3s ease' }} 
              />
            </div>
          </div>
          
          {/* Error message */}
          <div className="col-12 col-md-8 mb-4">
            <h2 className={`h2 text-primary mb-3 ${isVisible ? 'fade-in delay-1' : ''}`}>
              {translateText('Oops! You\'ve Wandered Into Uncharted Territory')}
            </h2>
            <p className={`lead text-secondary ${isVisible ? 'fade-in delay-2' : ''}`}>
              {translateText('Our clever squirrel seems to be as lost as you are! It\'s trying to navigate the digital maze but can\'t find the page you\'re looking for.')}
            </p>
          </div>
          
          {/* Action buttons */}
          <div className={`col-12 mt-4 ${isVisible ? 'fade-in delay-3' : ''}`}>
            <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
              <button 
                className="btn btn-primary btn-lg px-4 py-2"
                onClick={() => window.location.href = '/'}
              >
                <i className="bi bi-house-door me-2"></i> {translateText('Go Home')}
              </button>
              
              <button 
                className="btn btn-outline-warning btn-lg px-4 py-2"
                onClick={() => window.history.back()}
              >
                <i className="bi bi-arrow-left me-2"></i> {translateText('Go Back')}
              </button>
            </div>
          </div>
          
          {/* Additional help text */}
          <div className={`col-12 mt-5 text-muted ${isVisible ? 'fade-in delay-3' : ''}`}>
            <p>{translateText('Try searching for what you need or return to the homepage to start fresh.')}</p>
            
            {/* Digital decorations - compass */}
            <div className="position-relative d-inline-block mt-4">
              <div className="rotate-animation d-inline-block">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="30" cy="30" r="29" stroke="#6c757d" strokeWidth="2"/>
                  <path d="M30 5 L30 55" stroke="#6c757d" strokeWidth="2"/>
                  <path d="M5 30 L55 30" stroke="#6c757d" strokeWidth="2"/>
                  <circle cx="30" cy="30" r="5" fill="#fd7e14"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;