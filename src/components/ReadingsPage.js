import React from 'react';
import { Link } from 'react-router-dom';
import '../css/components/Reading.css';

function ReadingsPage() {
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
                    <li className="nav-item active">
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
                <div className="readings-container">
                    <div className="readings-header">
                        <h1 className="readings-title">Readings</h1>
                        <Link to="/readings/create" className="readings-create-btn">
                            <i className="fas fa-plus"></i> Create New Reading
                        </Link>
                    </div>

                    <div className="readings-categories">
                        <div className="reading-category-card">
                            <h3 className="reading-category-title">Current events and news articles</h3>
                            <div className="reading-category-actions">
                                <Link to="/readings/category/news" className="reading-action-btn">
                                    <i className="fas fa-book-open"></i>
                                    <span>Read</span>
                                </Link>
                                <Link to="/readings/category/news/edit" className="reading-action-btn">
                                    <i className="fas fa-edit"></i>
                                    <span>Edit</span>
                                </Link>
                            </div>
                        </div>

                        <div className="reading-category-card">
                            <h3 className="reading-category-title">Engaging fiction and non-fiction stories</h3>
                            <div className="reading-category-actions">
                                <Link to="/readings/category/fiction" className="reading-action-btn">
                                    <i className="fas fa-book-open"></i>
                                    <span>Read</span>
                                </Link>
                                <Link to="/readings/category/fiction/edit" className="reading-action-btn">
                                    <i className="fas fa-edit"></i>
                                    <span>Edit</span>
                                </Link>
                            </div>
                        </div>

                        <div className="reading-category-card">
                            <h3 className="reading-category-title">Professional and business-related content</h3>
                            <div className="reading-category-actions">
                                <Link to="/readings/category/business" className="reading-action-btn">
                                    <i className="fas fa-book-open"></i>
                                    <span>Read</span>
                                </Link>
                                <Link to="/readings/category/business/edit" className="reading-action-btn">
                                    <i className="fas fa-edit"></i>
                                    <span>Edit</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="readings-stats-container">
                        <div className="readings-stats">
                            <div className="reading-stat">
                                <div className="reading-stat-value">25</div>
                                <div className="reading-stat-label">Total Readings</div>
                            </div>

                            <div className="reading-stat">
                                <div className="reading-stat-value">15,000</div>
                                <div className="reading-stat-label">Words Read</div>
                            </div>

                            <div className="reading-stat">
                                <div className="reading-stat-value">5 hours</div>
                                <div className="reading-stat-label">Time Spent</div>
                            </div>

                            <div className="reading-stat">
                                <div className="reading-stat-value">85%</div>
                                <div className="reading-stat-label">Comprehension</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ReadingsPage; 