import React from 'react';
import '../css/components/Flashcards.css';

function FlashcardsPage() {
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
                    <li className="nav-item">
                        <a href="/dashboard" className="nav-link">
                            <i className="fas fa-home"></i>
                            Dashboard
                        </a>
                    </li>
                    <li className="nav-item active">
                        <a href="/flashcards" className="nav-link">
                            <i className="fas fa-layer-group"></i>
                            Flashcards
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/readings" className="nav-link">
                            <i className="fas fa-book"></i>
                            Readings
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/writing" className="nav-link">
                            <i className="fas fa-pen"></i>
                            Writing
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/discover" className="nav-link">
                            <i className="fas fa-compass"></i>
                            Discover
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/profile" className="nav-link">
                            <i className="fas fa-user"></i>
                            Profile
                        </a>
                    </li>
                </ul>
            </aside>

            <main className="main-content">
                <div className="flashcards-container">
                    <div className="flashcards-header">
                        <h1 className="flashcards-title">Flashcards</h1>
                        <button className="create-set-btn">
                            <i className="fas fa-plus"></i>
                            Create New Set
                        </button>
                    </div>

                    <div className="flashcards-grid">
                        <div className="flashcard-set">
                            <h3 className="set-title">Basic Vocabulary</h3>
                            <p className="set-description">Essential words for everyday conversation</p>
                            <div className="set-actions">
                                <button className="set-btn study-btn">
                                    <i className="fas fa-play"></i>
                                    Study
                                </button>
                                <button className="set-btn edit-btn">
                                    <i className="fas fa-edit"></i>
                                    Edit
                                </button>
                            </div>
                        </div>

                        <div className="flashcard-set">
                            <h3 className="set-title">Business Terms</h3>
                            <p className="set-description">Professional vocabulary for the workplace</p>
                            <div className="set-actions">
                                <button className="set-btn study-btn">
                                    <i className="fas fa-play"></i>
                                    Study
                                </button>
                                <button className="set-btn edit-btn">
                                    <i className="fas fa-edit"></i>
                                    Edit
                                </button>
                            </div>
                        </div>

                        <div className="flashcard-set">
                            <h3 className="set-title">Travel Phrases</h3>
                            <p className="set-description">Common expressions for travelers</p>
                            <div className="set-actions">
                                <button className="set-btn study-btn">
                                    <i className="fas fa-play"></i>
                                    Study
                                </button>
                                <button className="set-btn edit-btn">
                                    <i className="fas fa-edit"></i>
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default FlashcardsPage; 