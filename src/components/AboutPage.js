import React from 'react';
import { Link } from 'react-router-dom';
import '../css/components/About.css';
import { useLanguage } from '../contexts/LanguageContext';

function AboutPage() {
    const { translateText } = useLanguage();
    
    return (
        <div className="about-container">
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1 className="about-title">{translateText('About WordWise')}</h1>
                    <p className="about-subtitle">
                        {translateText('Smart language learning platform designed to help everyone learn effectively')}
                    </p>
                </div>
            </section>

            <section className="about-mission">
                <div className="container">
                    <div className="mission-content">
                        <div className="mission-text">
                            <h2>{translateText('Our Mission')}</h2>
                            <p>
                                {translateText('WordWise was created with a simple but ambitious mission: To make language learning an effective, enjoyable, and accessible experience for everyone. We believe that language is not just a communication tool but also a bridge between cultures, opening opportunities and connecting people.')}
                            </p>
                            <p>
                                {translateText('With a team of leading language experts and technologists, we continuously develop modern learning methods based on scientific research on memory and language acquisition.')}
                            </p>
                        </div>
                        <div className="mission-image">
                            <img src="/images/about-mission.jpg" alt={translateText('WordWise Mission')} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-benefits">
                <div className="container">
                    <h2 className="section-title">{translateText('Benefits of Learning with WordWise')}</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-brain"></i>
                            </div>
                            <h3>{translateText('Smart Learning with AI')}</h3>
                            <p>
                                {translateText('Our AI system analyzes your learning style and progress, creating a personalized learning path that helps you progress 3 times faster than traditional methods.')}
                            </p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <h3>{translateText('Detailed Progress Tracking')}</h3>
                            <p>
                                {translateText('Visual analytics charts help you easily track progress in each skill, vocabulary and grammar, while suggesting areas for review.')}
                            </p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-lightbulb"></i>
                            </div>
                            <h3>{translateText('Scientific Methods')}</h3>
                            <p>
                                {translateText('Applying spaced repetition and active recall techniques - two methods proven to be most effective for long-term retention and deep understanding.')}
                            </p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-medal"></i>
                            </div>
                            <h3>{translateText('Motivation System')}</h3>
                            <p>
                                {translateText('Smart gamification with badges, leaderboards, and daily challenges helps maintain long-term learning motivation.')}
                            </p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <h3>{translateText('Learning Community')}</h3>
                            <p>
                                {translateText('Connect with a global community of learners, share resources and encourage each other on the journey to conquer a new language.')}
                            </p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-globe"></i>
                            </div>
                            <h3>{translateText('Language Diversity')}</h3>
                            <p>
                                {translateText('Support for over 15 of the world\'s most popular languages with content curated by native speakers, ensuring accuracy and practicality.')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-accessibility">
                <div className="container">
                    <h2 className="section-title">{translateText('Accessibility')}</h2>
                    <div className="accessibility-content">
                        <div className="accessibility-image">
                            <img src="/images/accessibility.jpg" alt={translateText('Accessibility')} />
                        </div>
                        <div className="accessibility-text">
                            <p>
                                {translateText('At WordWise, we believe that language education should be accessible to everyone, regardless of ability, geographic location, or economic circumstances.')}
                            </p>
                            <h3>{translateText('Designed for Everyone')}</h3>
                            <ul className="accessibility-list">
                                <li>
                                    <i className="fas fa-check"></i>
                                    {translateText('Screen reader-friendly interface and keyboard navigation support')}
                                </li>
                                <li>
                                    <i className="fas fa-check"></i>
                                    {translateText('Subtitles and transcripts for all audio content')}
                                </li>
                                <li>
                                    <i className="fas fa-check"></i>
                                    {translateText('Customizable fonts, sizes, and color contrast')}
                                </li>
                                <li>
                                    <i className="fas fa-check"></i>
                                    {translateText('Works on all devices, from computers to mobile phones')}
                                </li>
                                <li>
                                    <i className="fas fa-check"></i>
                                    {translateText('Offline learning features for areas with limited internet connection')}
                                </li>
                            </ul>
                            <h3>{translateText('Financial Accessibility')}</h3>
                            <p>
                                {translateText('Our freemium model allows all users to access basic features for free. We also offer scholarships and special discounts for students, teachers, and users from developing countries.')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-testimonials">
                <div className="container">
                    <h2 className="section-title">{translateText('What Our Users Say')}</h2>
                    <div className="testimonials-container">
                        <div className="testimonial">
                            <div className="testimonial-content">
                                <p>
                                    {translateText('"WordWise helped me master English after years of failure with other methods. The personalized approach and smart reminder system are the keys to helping me maintain daily learning."')}
                                </p>
                            </div>
                            <div className="testimonial-author">
                                <img src="/images/testimonial-1.jpg" alt="John Smith" />
                                <div className="author-info">
                                    <h4>John Smith</h4>
                                    <p>{translateText('Software Engineer, 267 consecutive learning days')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial">
                            <div className="testimonial-content">
                                <p>
                                    {translateText('"As a hearing-impaired language learner, I\'m very impressed with WordWise\'s accessibility features. Visual support and learning methods that don\'t rely entirely on sound help me learn effectively."')}
                                </p>
                            </div>
                            <div className="testimonial-author">
                                <img src="/images/testimonial-2.jpg" alt="Sarah Johnson" />
                                <div className="author-info">
                                    <h4>Sarah Johnson</h4>
                                    <p>{translateText('University Student, Fluent in 2 languages')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-cta">
                <div className="container">
                    <div className="cta-content">
                        <h2>{translateText('Start Your Language Journey Today')}</h2>
                        <p>
                            {translateText('Join more than 5 million learners worldwide and discover how WordWise can help you conquer a new language effectively.')}
                        </p>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn btn-primary">
                                {translateText('Register for Free')}
                            </Link>
                            <Link to="/how-it-works" className="btn btn-secondary">
                                {translateText('Learn More')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AboutPage; 