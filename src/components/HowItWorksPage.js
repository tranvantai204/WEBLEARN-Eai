import React from 'react';
import { Link } from 'react-router-dom';
import '../css/components/About.css'; // Shared CSS with AboutPage
import '../css/components/HowItWorks.css';
import { useAuth } from '../contexts/AuthContext';

function HowItWorksPage() {
    const { isAuthenticated } = useAuth();
    
    return (
        <div className="about-container">
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1 className="about-title">How It Works</h1>
                    <p className="about-subtitle">
                        Discover how WordWise helps you learn languages more effectively
                    </p>
                </div>
            </section>

            <section className="how-works-intro">
                <div className="container">
                    <div className="intro-content">
                        <div className="intro-text">
                            <h2>Smart Language Learning Method</h2>
                            <p>
                                WordWise combines the most effective learning methods proven by cognitive science 
                                with advanced artificial intelligence technology. Our system continuously analyzes 
                                how you learn and adjusts to optimize your learning progress.
                            </p>
                            <p>
                                Unlike other language learning apps, we don't apply the same method to everyone. 
                                Instead, we create a unique learning path that suits your learning style, goals, 
                                and preferences.
                            </p>
                        </div>
                        <div className="intro-image">
                            <img src="/images/how-it-works-intro.jpg" alt="Smart language learning" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="learning-steps">
                <div className="container">
                    <h2 className="section-title">Learning Process</h2>
                    <div className="steps-container">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Proficiency Assessment</h3>
                                <p>
                                    When you start, you'll take an assessment test to determine your current level,
                                    strengths, and weaknesses. This helps the system build a learning path that's right for you.
                                </p>
                                <div className="step-image">
                                    <img src="/images/step-assessment.jpg" alt="Proficiency assessment" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Building Vocabulary Foundation</h3>
                                <p>
                                    Using the Spaced Repetition method, we help you build a strong vocabulary base 
                                    through smart flashcards. The system will remind you to review words you're likely to forget
                                    at just the right time, optimizing the memorization process.
                                </p>
                                <div className="step-image">
                                    <img src="/images/step-vocabulary.jpg" alt="Building vocabulary" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Practicing Language Skills</h3>
                                <p>
                                    Through interactive exercises, you'll practice all four skills: listening, speaking, reading, and writing.
                                    Our AI analyzes pronunciation, sentence structure, and provides detailed feedback to help
                                    you continuously improve.
                                </p>
                                <div className="step-image">
                                    <img src="/images/step-skills.jpg" alt="Practicing skills" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="step-card">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h3>Learning in Real Context</h3>
                                <p>
                                    Instead of learning words and grammar in isolation, you'll learn language in real contexts 
                                    through readings, videos, and dialogue situations. This helps you understand how 
                                    language is used in practice.
                                </p>
                                <div className="step-image">
                                    <img src="/images/step-context.jpg" alt="Learning in context" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="step-card">
                            <div className="step-number">5</div>
                            <div className="step-content">
                                <h3>Feedback and Adjustment</h3>
                                <p>
                                    The system continuously tracks your progress and adjusts learning content based on your performance.
                                    You receive detailed progress reports and specific advice for improvement.
                                </p>
                                <div className="step-image">
                                    <img src="/images/step-feedback.jpg" alt="Feedback and adjustment" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="technology-section">
                <div className="container">
                    <h2 className="section-title">Technology Behind WordWise</h2>
                    <div className="tech-grid">
                        <div className="tech-card">
                            <div className="tech-icon">
                                <i className="fas fa-brain"></i>
                            </div>
                            <h3>Artificial Intelligence</h3>
                            <p>
                                Machine learning algorithms analyze millions of data points to understand how you learn and 
                                create an optimal learning path. Our AI also evaluates grammar, pronunciation, and 
                                provides detailed feedback.
                            </p>
                        </div>
                        
                        <div className="tech-card">
                            <div className="tech-icon">
                                <i className="fas fa-hourglass-half"></i>
                            </div>
                            <h3>Spaced Repetition System</h3>
                            <p>
                                Advanced SRS calculates exactly when you're about to forget a word or concept 
                                and reminds you to review at the right moment, helping optimize long-term memory retention.
                            </p>
                        </div>
                        
                        <div className="tech-card">
                            <div className="tech-icon">
                                <i className="fas fa-microphone"></i>
                            </div>
                            <h3>Speech Recognition</h3>
                            <p>
                                Voice processing technology helps you practice accurate pronunciation and confidently speak 
                                in the new language. The system analyzes each syllable and provides guidance on how to improve.
                            </p>
                        </div>
                        
                        <div className="tech-card">
                            <div className="tech-icon">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <h3>Learning Analytics</h3>
                            <p>
                                Detailed analytics dashboard helps you track progress, identify strengths and weaknesses, 
                                and provides specific strategies to improve learning effectiveness.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Key Features</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-image">
                                <img src="/images/feature-flashcards.jpg" alt="Smart flashcards" />
                            </div>
                            <h3>Smart Flashcards</h3>
                            <p>
                                Create and study personalized flashcard sets with SRS technology to help you remember longer
                                with less study time.
                            </p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-image">
                                <img src="/images/feature-writing.jpg" alt="Writing practice with feedback" />
                            </div>
                            <h3>Writing Practice with Feedback</h3>
                            <p>
                                Receive detailed feedback on your writing from AI, including grammar suggestions, vocabulary,
                                and text structure.
                            </p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-image">
                                <img src="/images/feature-reading.jpg" alt="Smart reading" />
                            </div>
                            <h3>Smart Reading</h3>
                            <p>
                                Read articles suitable for your level, with the quick-lookup feature, note-taking,
                                and adding new words to flashcards.
                            </p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-image">
                                <img src="/images/feature-speaking.jpg" alt="Speaking practice" />
                            </div>
                            <h3>Speaking Practice</h3>
                            <p>
                                Practice speaking with AI and receive feedback on pronunciation, grammar, and fluency
                                in real-time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="education-science">
                <div className="container">
                    <h2 className="section-title">Educational Science</h2>
                    <div className="science-content">
                        <div className="science-text">
                            <p>
                                WordWise is built on the most effective language learning science research.
                                We combine effective methods:
                            </p>
                            <ul className="science-list">
                                <li>
                                    <strong>Spaced Repetition:</strong> Review words at optimal intervals for long-term retention
                                </li>
                                <li>
                                    <strong>Active Recall:</strong> Actively recall information instead of just re-reading
                                </li>
                                <li>
                                    <strong>Comprehensible Input:</strong> Learn through content you can understand most
                                </li>
                                <li>
                                    <strong>Contextual Learning:</strong> Learn vocabulary and grammar in real contexts
                                </li>
                                <li>
                                    <strong>Gamification:</strong> Use game elements to increase motivation
                                </li>
                            </ul>
                            <p>
                                Each feature on our platform is designed based on these scientific principles to ensure you learn effectively and enjoyably.
                            </p>
                        </div>
                        <div className="science-image">
                            <img src="/images/education-science.jpg" alt="Educational science" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-cta">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Experience New Learning?</h2>
                        <p>
                            Discover WordWise today and experience effective, fun, and personalized language learning.
                        </p>
                        <div className="cta-buttons">
                            {!isAuthenticated && (
                                <Link to="/register" className="btn btn-primary">
                                    Start Free Trial
                                </Link>
                            )}
                            <Link to="/testimonials" className="btn btn-secondary">
                                Read Student Testimonials
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HowItWorksPage; 