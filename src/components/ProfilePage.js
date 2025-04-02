import React, { useState } from 'react';
import '../css/components/Profile.css';

function ProfilePage() {
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        bio: '',
        nativeLanguage: '',
        learningLanguages: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Profile data:', profileData);
    };

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
                    <li className="nav-item">
                        <a href="/discover" className="nav-link">
                            <i className="fas fa-compass"></i>
                            Discover
                        </a>
                    </li>
                    <li className="nav-item active">
                        <a href="/profile" className="nav-link">
                            <i className="fas fa-user"></i>
                            Profile
                        </a>
                    </li>
                </ul>
            </aside>

            <main className="main-content">
                <div className="profile-container">
                    <div className="profile-header">
                        <h1 className="profile-title">Profile Settings</h1>
                        <button className="save-button" onClick={handleSubmit}>
                            <i className="fas fa-save"></i>
                            Save Changes
                        </button>
                    </div>

                    <div className="profile-grid">
                        <div className="profile-card">
                            <div className="avatar-section">
                                <div className="avatar-container">
                                    <img 
                                        src="/images/default-avatar.png" 
                                        alt="Profile" 
                                        className="avatar-image"
                                    />
                                    <button className="change-photo-button">
                                        <i className="fas fa-camera"></i>
                                    </button>
                                </div>
                                <p className="avatar-text">Change Profile Photo</p>
                            </div>
                        </div>

                        <div className="profile-card">
                            <form className="profile-form">
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={profileData.fullName}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={profileData.bio}
                                        onChange={handleChange}
                                        className="form-input form-textarea"
                                        placeholder="Tell us about yourself"
                                        rows="4"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Native Language</label>
                                    <select
                                        name="nativeLanguage"
                                        value={profileData.nativeLanguage}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">Select your native language</option>
                                        <option value="vi">Vietnamese</option>
                                        <option value="en">English</option>
                                        <option value="fr">French</option>
                                        <option value="de">German</option>
                                        <option value="es">Spanish</option>
                                        <option value="zh">Chinese</option>
                                        <option value="ja">Japanese</option>
                                        <option value="ko">Korean</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Learning Languages</label>
                                    <select
                                        name="learningLanguages"
                                        value={profileData.learningLanguages}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">Select language you want to learn</option>
                                        <option value="en">English</option>
                                        <option value="fr">French</option>
                                        <option value="de">German</option>
                                        <option value="es">Spanish</option>
                                        <option value="zh">Chinese</option>
                                        <option value="ja">Japanese</option>
                                        <option value="ko">Korean</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ProfilePage; 