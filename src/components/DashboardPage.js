import React from 'react';
import { Link } from 'react-router-dom';
import '../css/components/Dashboard.css';

function DashboardPage() {
    return (
        <div className="main-content">
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
                
                {/* Quick Navigation Buttons */}
                <div className="quick-nav-section">
                    <h2 className="quick-nav-title">Quick Access</h2>
                    <div className="quick-nav-grid">
                        <Link to="/flashcards" className="quick-nav-card">
                            <div className="quick-nav-icon">
                                <i className="fas fa-layer-group"></i>
                            </div>
                            <h3>Flashcards</h3>
                            <p>Practice vocabulary</p>
                        </Link>
                        <Link to="/readings" className="quick-nav-card">
                            <div className="quick-nav-icon">
                                <i className="fas fa-book"></i>
                            </div>
                            <h3>Readings</h3>
                            <p>Improve comprehension</p>
                        </Link>
                        <Link to="/writing" className="quick-nav-card">
                            <div className="quick-nav-icon">
                                <i className="fas fa-pen"></i>
                            </div>
                            <h3>Writing</h3>
                            <p>Express yourself</p>
                        </Link>
                        <Link to="/discover" className="quick-nav-card">
                            <div className="quick-nav-icon">
                                <i className="fas fa-compass"></i>
                            </div>
                            <h3>Discover</h3>
                            <p>Find new content</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage; 