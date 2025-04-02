import React from 'react';
import { Link } from 'react-router-dom';
import '../css/components/Dashboard.css';

function DashboardPage() {
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
                    <li className="nav-item active">
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
                <div className="dashboard-container">
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">Dashboard</h1>
                        <p className="dashboard-subtitle">Welcome back, John Doe!</p>
                    </div>

                    <div className="dashboard-stats">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-layer-group"></i>
                            </div>
                            <div className="stat-info">
                                <h3>Total Flashcards</h3>
                                <p className="stat-number">150</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-book-reader"></i>
                            </div>
                            <div className="stat-info">
                                <h3>Reading Progress</h3>
                                <p className="stat-number">85%</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-pen-fancy"></i>
                            </div>
                            <div className="stat-info">
                                <h3>Writing Score</h3>
                                <p className="stat-number">92/100</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-clock"></i>
                            </div>
                            <div className="stat-info">
                                <h3>Study Time</h3>
                                <p className="stat-number">12.5 hrs</p>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        <div className="dashboard-card">
                            <div className="dashboard-card-header">
                                <h2 className="dashboard-card-title">Recent Activities</h2>
                            </div>
                            <div className="dashboard-card-body">
                                <div className="activity-list">
                                    <div className="activity-item">
                                        <div className="activity-icon">
                                            <i className="fas fa-book"></i>
                                        </div>
                                        <div className="activity-content">
                                            <h4>Completed Reading</h4>
                                            <p>Daily News Article</p>
                                            <span className="activity-time">2 hours ago</span>
                                        </div>
                                    </div>
                                    <div className="activity-item">
                                        <div className="activity-icon">
                                            <i className="fas fa-pen"></i>
                                        </div>
                                        <div className="activity-content">
                                            <h4>Writing Practice</h4>
                                            <p>Essay on Technology</p>
                                            <span className="activity-time">5 hours ago</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-card">
                            <div className="dashboard-card-header">
                                <h2 className="dashboard-card-title">Learning Streak</h2>
                            </div>
                            <div className="dashboard-card-body">
                                <div className="streaks-grid">
                                    <div className="streak-day completed">M</div>
                                    <div className="streak-day completed">T</div>
                                    <div className="streak-day completed">W</div>
                                    <div className="streak-day current">T</div>
                                    <div className="streak-day">F</div>
                                    <div className="streak-day">S</div>
                                    <div className="streak-day">S</div>
                                </div>
                                <div className="streak-info">
                                    <div className="current-streak">
                                        <i className="fas fa-fire"></i>
                                        4 Day Streak
                                    </div>
                                    <div className="best-streak">Best: 7 days</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DashboardPage; 