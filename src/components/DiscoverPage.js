import React from 'react';
import '../css/components/Discover.css';

function DiscoverPage() {
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
                    <li className="nav-item">
                        <a href="/writing" className="nav-link">
                            <i className="fas fa-pen"></i>
                            Writing
                        </a>
                    </li>
                    <li className="nav-item active">
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
                <div className="discover-container">
                    <div className="discover-header">
                        <h1 className="discover-title">Discover</h1>
                        <div className="search-section">
                            <div className="search-form">
                                <div className="search-bar">
                                    <i className="fas fa-search search-icon"></i>
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="Search content..."
                                    />
                                </div>
                                <div className="filter-section">
                                    <button className="filter-button">
                                        <i className="fas fa-filter"></i>
                                        Filter
                                    </button>
                                    <button className="filter-button">
                                        <i className="fas fa-sort"></i>
                                        Sort
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="content-grid">
                        <div className="content-card">
                            <img
                                src="/images/content1.jpg"
                                alt="Basic Grammar"
                                className="card-image"
                            />
                            <div className="card-content">
                                <h3 className="card-title">Basic Grammar</h3>
                                <p className="card-description">Learn fundamental grammar rules and structures for better communication.</p>
                                <div className="card-meta">
                                    <span className="difficulty-badge">Beginner</span>
                                    <div className="card-stats">
                                        <span className="stat-item">
                                            <i className="fas fa-book"></i>
                                            12 Lessons
                                        </span>
                                        <span className="stat-item">
                                            <i className="fas fa-users"></i>
                                            1.2k Students
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="content-card">
                            <img
                                src="/images/content2.jpg"
                                alt="Business Vocabulary"
                                className="card-image"
                            />
                            <div className="card-content">
                                <h3 className="card-title">Business Vocabulary</h3>
                                <p className="card-description">Master essential business terms and professional language.</p>
                                <div className="card-meta">
                                    <span className="difficulty-badge">Intermediate</span>
                                    <div className="card-stats">
                                        <span className="stat-item">
                                            <i className="fas fa-book"></i>
                                            15 Lessons
                                        </span>
                                        <span className="stat-item">
                                            <i className="fas fa-users"></i>
                                            850 Students
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="content-card">
                            <img
                                src="/images/content3.jpg"
                                alt="Conversation Practice"
                                className="card-image"
                            />
                            <div className="card-content">
                                <h3 className="card-title">Conversation Practice</h3>
                                <p className="card-description">Improve your speaking skills with real-world scenarios.</p>
                                <div className="card-meta">
                                    <span className="difficulty-badge">Advanced</span>
                                    <div className="card-stats">
                                        <span className="stat-item">
                                            <i className="fas fa-book"></i>
                                            20 Lessons
                                        </span>
                                        <span className="stat-item">
                                            <i className="fas fa-users"></i>
                                            2k Students
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pagination">
                        <button className="page-button">
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button className="page-button active">1</button>
                        <button className="page-button">2</button>
                        <button className="page-button">3</button>
                        <button className="page-button">
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DiscoverPage; 