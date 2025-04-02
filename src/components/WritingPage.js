import React from 'react';
import { Link } from 'react-router-dom';
import '../css/components/Writing.css';

function WritingPage() {
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
                    <li className="nav-item">
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
                    <li className="nav-item active">
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
                <div className="writing-container">
                    <div className="writing-header">
                        <h1 className="writing-title">Writing</h1>
                        <Link to="/writing/create" className="writing-create-btn">
                            <i className="fas fa-plus"></i> New Writing
                        </Link>
                    </div>

                    <div className="writing-categories">
                        <div className="writing-category-card">
                            <h3 className="writing-category-title">Personal thoughts and experiences</h3>
                            <div className="writing-category-actions">
                                <Link to="/writing/category/personal" className="writing-action-btn">
                                    <i className="fas fa-pen"></i>
                                    <span>Write</span>
                                </Link>
                                <Link to="/writing/category/personal/edit" className="writing-action-btn">
                                    <i className="fas fa-edit"></i>
                                    <span>Edit</span>
                                </Link>
                            </div>
                        </div>

                        <div className="writing-category-card">
                            <h3 className="writing-category-title">Creative writing and storytelling</h3>
                            <div className="writing-category-actions">
                                <Link to="/writing/category/creative" className="writing-action-btn">
                                    <i className="fas fa-pen"></i>
                                    <span>Write</span>
                                </Link>
                                <Link to="/writing/category/creative/edit" className="writing-action-btn">
                                    <i className="fas fa-edit"></i>
                                    <span>Edit</span>
                                </Link>
                            </div>
                        </div>

                        <div className="writing-category-card">
                            <h3 className="writing-category-title">Academic and formal writing</h3>
                            <div className="writing-category-actions">
                                <Link to="/writing/category/academic" className="writing-action-btn">
                                    <i className="fas fa-pen"></i>
                                    <span>Write</span>
                                </Link>
                                <Link to="/writing/category/academic/edit" className="writing-action-btn">
                                    <i className="fas fa-edit"></i>
                                    <span>Edit</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="writing-stats-container">
                        <div className="writing-stats">
                            <div className="writing-stat">
                                <div className="writing-stat-value">15</div>
                                <div className="writing-stat-label">Total Entries</div>
                            </div>

                            <div className="writing-stat">
                                <div className="writing-stat-value">5,000</div>
                                <div className="writing-stat-label">Words Written</div>
                            </div>

                            <div className="writing-stat">
                                <div className="writing-stat-value">3 hours</div>
                                <div className="writing-stat-label">Time Spent</div>
                            </div>

                            <div className="writing-stat">
                                <div className="writing-stat-value">8</div>
                                <div className="writing-stat-label">Feedback Received</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default WritingPage; 