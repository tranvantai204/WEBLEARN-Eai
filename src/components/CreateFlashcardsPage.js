import React from 'react';
import { Link } from 'react-router-dom';

function CreateFlashcardsPage() {
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
                    <h1 className="page-title">Create New Flashcard Set</h1>
                    <div className="page-actions">
                        <button className="btn btn-outline mr-2">
                            <i className="fas fa-times"></i> Cancel
                        </button>
                        <button className="btn btn-primary">
                            <i className="fas fa-save"></i> Save Set
                        </button>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="setTitle">Set Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="setTitle"
                                    placeholder="Enter set title"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="setDescription">Description</label>
                                <textarea
                                    className="form-control"
                                    id="setDescription"
                                    rows="3"
                                    placeholder="Enter set description"
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="language">Language</label>
                                <select className="form-control" id="language">
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="difficulty">Difficulty Level</label>
                                <select className="form-control" id="difficulty">
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="card mt-4">
                    <div className="card-header">
                        <h3 className="card-title">Add Flashcards</h3>
                        <button className="btn btn-sm btn-primary">
                            <i className="fas fa-plus"></i> Add Card
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="flashcard-editor">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Front</label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            placeholder="Enter the front of the card"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Back</label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            placeholder="Enter the back of the card"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Example Sentence</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter an example sentence"
                                />
                            </div>
                            <div className="form-group">
                                <label>Tags</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Add tags (comma-separated)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CreateFlashcardsPage; 