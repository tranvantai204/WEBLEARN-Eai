import React, { useEffect } from 'react';
import '../css/components/WelcomeAnimation.css';

const WelcomeAnimation = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            const animation = document.querySelector('.welcome-animation');
            animation.classList.add('fade-out');
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 500);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="welcome-animation">
            <div className="mascot-container">
                <svg width="350" height="350" viewBox="0 0 350 350" fill="none" xmlns="http://www.w3.org/2000/svg" className="mascot-svg">
                    {/* Main Body */}
                    <ellipse cx="175" cy="175" rx="100" ry="110" fill="#FF5B35"/>
                    
                    {/* Belly/Face */}
                    <ellipse cx="175" cy="180" rx="70" ry="75" fill="#FFEBCC"/>
                    
                    {/* Tail */}
                    <path d="M95 140C75 120 65 150 60 180C55 210 75 230 95 210C115 190 125 160 115 150C105 140 85 130 95 140Z" fill="#FF5B35"/>
                    
                    {/* Ears */}
                    <path d="M130 80C120 60 105 70 105 85C105 100 115 110 130 105C145 100 140 85 130 80Z" fill="#FF5B35"/>
                    <path d="M220 80C230 60 245 70 245 85C245 100 235 110 220 105C205 100 210 85 220 80Z" fill="#FF5B35"/>
                    
                    {/* Inner Ears */}
                    <path d="M123 85C117 70 110 75 110 85C110 95 117 100 123 97C129 94 128 87 123 85Z" fill="#B73A1E"/>
                    <path d="M227 85C233 70 240 75 240 85C240 95 233 100 227 97C221 94 222 87 227 85Z" fill="#B73A1E"/>
                    
                    {/* Eyes - glasses outer */}
                    <ellipse cx="150" cy="160" rx="30" ry="30" fill="#FFEBCC" stroke="#000000" strokeWidth="6"/>
                    <ellipse cx="200" cy="160" rx="30" ry="30" fill="#FFEBCC" stroke="#000000" strokeWidth="6"/>
                    
                    {/* Glasses bridge */}
                    <line x1="180" y1="160" x2="170" y2="160" stroke="#000000" strokeWidth="6"/>
                    
                    {/* Glasses arms */}
                    <line x1="120" y1="160" x2="100" y2="155" stroke="#000000" strokeWidth="4"/>
                    <line x1="230" y1="160" x2="250" y2="155" stroke="#000000" strokeWidth="4"/>
                    
                    {/* Eyes - inner */}
                    <circle cx="150" cy="160" r="20" fill="#000000"/>
                    <circle cx="200" cy="160" r="20" fill="#000000"/>
                    
                    {/* Eye highlights */}
                    <circle cx="145" cy="155" r="5" fill="#FFFFFF"/>
                    <circle cx="195" cy="155" r="5" fill="#FFFFFF"/>
                    
                    {/* Nose */}
                    <ellipse cx="175" cy="190" rx="5" ry="5" fill="#FF9E45"/>
                    
                    {/* Arms and book - with waving arm */}
                    <g className="waving-arm">
                        <ellipse cx="115" cy="240" rx="40" ry="20" fill="#FFEBCC" transform="rotate(-15 115 240)"/>
                    </g>
                    <ellipse cx="235" cy="240" rx="40" ry="20" fill="#FFEBCC"/>
                    <rect x="155" y="230" width="40" height="30" rx="3" fill="#7AC943"/>
                    <rect x="154" y="229" width="42" height="7" rx="2" fill="#5A9D30"/>
                </svg>
                <div className="welcome-text">
                    <h1>Welcome to WordWise!</h1>
                    <p>Your journey to language mastery begins here</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeAnimation; 