import React from 'react';
import { Link } from 'react-router-dom';

function StudyFlashcardsPage() {
    return (
        <div className="dashboard">
            <aside className="sidebar">
                <div className="sidebar-user">
                    <img
                        src="/images/avatar.png"
                        alt="User Avatar"
                        className="user-avatar"
                    />
                    <h3 className="user-name">John Doe</h3>
                    <p className="user-email">john@example.com</p>
                </div>
                <ul className="sidebar-nav">
                    <li className="sidebar-item">
                        <a href="/dashboard" className="sidebar-link">
                            <i className="fas fa-home sidebar-icon"></i>
                            Dashboard
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a href="/flashcards" className="sidebar-link active">
                            <i className="fas fa-cards sidebar-icon"></i>
                            Flashcards
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a href="/readings" className="sidebar-link">
                            <i className="fas fa-book sidebar-icon"></i>
                            Readings
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a href="/writing" className="sidebar-link">
                            <i className="fas fa-pen sidebar-icon"></i>
                            Writing
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a href="/discover" className="sidebar-link">
                            <i className="fas fa-compass sidebar-icon"></i>
                            Discover
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a href="/profile" className="sidebar-link">
                            <i className="fas fa-user sidebar-icon"></i>
                            Profile
                        </a>
                    </li>
                </ul>
            </aside>
            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">Study Flashcards</h1>
                    <div className="page-actions">
                        <button className="btn btn-outline">
                            <i className="fas fa-times"></i> End Session
                        </button>
                    </div>
                </div>
                <div className="study-container">
                    <div className="progress-bar mb-4">
                        <div className="progress" style={{ width: '60%' }}>
                            <span className="progress-text">12/20 cards</span>
                        </div>
                    </div>
                    <div className="flashcard-container">
                        <div className="flashcard">
                            <div className="flashcard-inner">
                                <div className="flashcard-front">
                                    <h2>Front of the card</h2>
                                    <p>This is the question or term to learn</p>
                                </div>
                                <div className="flashcard-back">
                                    <h2>Back of the card</h2>
                                    <p>This is the answer or definition</p>
                                    <div className="example-sentence">
                                        <p className="text-muted">Example: This is an example sentence using the term.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="study-controls mt-4">
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-danger mr-2">
                                <i className="fas fa-times"></i> Again
                            </button>
                            <button className="btn btn-warning mr-2">
                                <i className="fas fa-clock"></i> Hard
                            </button>
                            <button className="btn btn-success mr-2">
                                <i className="fas fa-check"></i> Good
                            </button>
                            <button className="btn btn-primary">
                                <i className="fas fa-star"></i> Easy
                            </button>
                        </div>
                    </div>
                    <div className="study-stats mt-4">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="stat-card">
                                    <h4>Time</h4>
                                    <p>5:30</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="stat-card">
                                    <h4>Cards</h4>
                                    <p>12/20</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="stat-card">
                                    <h4>Correct</h4>
                                    <p>8</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="stat-card">
                                    <h4>Accuracy</h4>
                                    <p>67%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default StudyFlashcardsPage; 