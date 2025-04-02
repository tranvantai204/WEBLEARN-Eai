import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function DashboardSidebar({ user }) {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="dashboard-sidebar">
            <div className="sidebar-user">
                <div className="user-avatar">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                    ) : (
                        <div className="avatar-placeholder">
                            {user.name.charAt(0)}
                        </div>
                    )}
                </div>
                <h3 className="user-name">{user.name}</h3>
                <p className="user-email">{user.email}</p>
            </div>

            <nav className="sidebar-nav">
                <div className={`nav-item ${isActive('/flashcards') ? 'active' : ''}`}>
                    <Link 
                        to="/flashcards" 
                        className="nav-link"
                        data-tooltip="Flashcards"
                    >
                        <i className="fas fa-layer-group"></i>
                    </Link>
                </div>

                <Link 
                    to="/dashboard" 
                    className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                    <i className="fas fa-home"></i>
                    Dashboard
                </Link>

                <Link 
                    to="/readings" 
                    className={`sidebar-link ${isActive('/readings') ? 'active' : ''}`}
                >
                    <i className="fas fa-book-reader"></i>
                    Readings
                </Link>

                <Link 
                    to="/writing" 
                    className={`sidebar-link ${isActive('/writing') ? 'active' : ''}`}
                >
                    <i className="fas fa-pen-fancy"></i>
                    Writing
                </Link>

                <Link 
                    to="/discover" 
                    className={`sidebar-link ${isActive('/discover') ? 'active' : ''}`}
                >
                    <i className="fas fa-compass"></i>
                    Discover
                </Link>

                <Link 
                    to="/profile" 
                    className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}
                >
                    <i className="fas fa-user"></i>
                    Profile
                </Link>
            </nav>

            <div className="sidebar-footer">
                <button className="btn btn-outline btn-sm">
                    <i className="fas fa-cog"></i>
                    Settings
                </button>
                <button className="btn btn-outline btn-sm text-danger">
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default DashboardSidebar; 