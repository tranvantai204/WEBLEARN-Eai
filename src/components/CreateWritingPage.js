import React from 'react';
import { Link } from 'react-router-dom';
import '../css/components/WritingCreate.css';

function CreateWritingPage() {
    return (
        <div className="writing-create-container">
            <div className="writing-create-header">
                <h1>Create New Writing</h1>
                <div className="header-actions">
                    <button className="cancel-button">
                        <span className="icon">✕</span> Cancel
                    </button>
                    <button className="save-button">
                        <span className="icon">🔒</span> Save Writing
                    </button>
                </div>
            </div>
            
            <div className="writing-create-form">
                <div className="form-group">
                    <label htmlFor="writingTitle">Title</label>
                    <input
                        type="text"
                        id="writingTitle"
                        placeholder="Enter writing title"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="writingType">Type</label>
                        <select id="writingType">
                            <option value="journal">Daily Journal</option>
                            <option value="story">Story</option>
                            <option value="essay">Essay</option>
                            <option value="letter">Letter</option>
                        </select>
                    </div>

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
                </div>

                <div className="form-group">
                    <label htmlFor="prompt">Writing Prompt</label>
                    <textarea
                        id="prompt"
                        rows="3"
                        placeholder="Enter writing prompt or topic"
                    ></textarea>
                </div>
            </div>

            <div className="writing-content-section">
                <h2>Writing Content</h2>
                <div className="form-group">
                    <label>Content</label>
                    <textarea
                        rows="15"
                        placeholder="Start writing your content here..."
                    ></textarea>
                </div>

                <div className="vocabulary-section">
                    <h3>Vocabulary Notes</h3>
                    <div className="vocabulary-list">
                        <div className="vocabulary-item">
                            <input
                                type="text"
                                placeholder="Word"
                            />
                            <input
                                type="text"
                                placeholder="Notes"
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

                <div className="grammar-section">
                    <h3>Grammar Notes</h3>
                    <textarea
                        rows="3"
                        placeholder="Add any grammar notes or corrections here..."
                    ></textarea>
                </div>
            </div>
        </div>
    );
}

export default CreateWritingPage; 