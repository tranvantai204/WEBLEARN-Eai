import React from 'react';
import { Link } from 'react-router-dom';
import '../css/components/ReadingCreate.css';

function CreateReadingPage() {
    return (
        <div className="reading-create-container">
            <div className="reading-create-header">
                <h1>Create New Reading</h1>
                <div className="header-actions">
                    <button className="cancel-button">
                        <span className="icon">✕</span> Cancel
                    </button>
                    <button className="save-button">
                        <span className="icon">🔒</span> Save Reading
                    </button>
                </div>
            </div>
            
            <div className="reading-create-form">
                <div className="form-group">
                    <label htmlFor="readingTitle">Title</label>
                    <input
                        type="text"
                        id="readingTitle"
                        placeholder="Enter reading title"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="readingDescription">Description</label>
                    <textarea
                        id="readingDescription"
                        rows="3"
                        placeholder="Enter reading description"
                    ></textarea>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="language">Language</label>
                        <select id="language">
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="difficulty">Difficulty Level</label>
                        <select id="difficulty">
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select id="category">
                            <option value="news">News</option>
                            <option value="story">Story</option>
                            <option value="article">Article</option>
                            <option value="blog">Blog</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="reading-content-section">
                <h2>Reading Content</h2>
                <div className="form-group">
                    <label>Content</label>
                    <textarea
                        rows="10"
                        placeholder="Enter the reading content"
                    ></textarea>
                </div>

                <div className="vocabulary-section">
                    <h3>Vocabulary List</h3>
                    <div className="vocabulary-list">
                        <div className="vocabulary-item">
                            <input
                                type="text"
                                placeholder="Word"
                            />
                            <input
                                type="text"
                                placeholder="Definition"
                            />
                            <button className="remove-button">
                                <span className="icon">✕</span>
                            </button>
                        </div>
                    </div>
                    <button className="add-button">
                        <span className="icon">+</span> Add Word
                    </button>
                </div>

                <div className="questions-section">
                    <h3>Comprehension Questions</h3>
                    <div className="questions-list">
                        <div className="question-item">
                            <input
                                type="text"
                                placeholder="Question"
                            />
                            <input
                                type="text"
                                placeholder="Answer"
                            />
                            <button className="remove-button">
                                <span className="icon">✕</span>
                            </button>
                        </div>
                    </div>
                    <button className="add-button">
                        <span className="icon">+</span> Add Question
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateReadingPage; 