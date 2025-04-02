import React, { useState } from 'react';
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/components/Flashcards.css';

function FlashcardsPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeSet, setActiveSet] = useState(null);
    const [showTopicInput, setShowTopicInput] = useState(false);
    const [topic, setTopic] = useState('');

    const handleAIGenerate = () => {
        if (!topic) {
            toast.error('Please enter a topic first!');
            return;
        }
        setIsGenerating(true);
        toast('🤖 Generating flashcards for topic: ' + topic, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
        
        // Simulate AI generation
        setTimeout(() => {
            setIsGenerating(false);
            setShowTopicInput(false);
            setTopic('');
            toast('✨ Flashcards generated successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }, 2000);
    };

    const handleStudyClick = (setTitle) => {
        toast('📚 Starting study session: ' + setTitle, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    };

    const handleEditClick = (setTitle) => {
        toast('✏️ Editing set: ' + setTitle, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    };

    return (
        <div className="main-content">
            <div className="flashcards-container">
                <div className="flashcards-header">
                    <h1 className="flashcards-title">Flashcards</h1>
                    <div className="flashcards-actions">
                        <div className="ai-generate-container">
                            {showTopicInput ? (
                                <div className="topic-input-group">
                                    <input
                                        type="text"
                                        placeholder="Enter topic for flashcards..."
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="topic-input"
                                    />
                                    <button 
                                        className={`ai-generate-btn ${isGenerating ? 'generating' : ''}`}
                                        onClick={handleAIGenerate}
                                        disabled={isGenerating || !topic}
                                    >
                                        <i className={`fas ${isGenerating ? 'fa-spinner fa-spin' : 'fa-robot'}`}></i>
                                        {isGenerating ? 'Generating...' : 'Generate'}
                                    </button>
                                    <button 
                                        className="cancel-btn"
                                        onClick={() => {
                                            setShowTopicInput(false);
                                            setTopic('');
                                        }}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    className="ai-generate-btn"
                                    onClick={() => setShowTopicInput(true)}
                                >
                                    <i className="fas fa-robot"></i>
                                    Generate with AI
                                </button>
                            )}
                        </div>
                        <button className="create-set-btn">
                            <i className="fas fa-plus"></i>
                            Create New Set
                        </button>
                    </div>
                </div>

                <div className="flashcards-grid">
                    {['Basic Vocabulary', 'Business Terms', 'Travel Phrases'].map((title, index) => (
                        <div 
                            key={index}
                            className={`flashcard-set ${activeSet === index ? 'active' : ''}`}
                            onMouseEnter={() => setActiveSet(index)}
                            onMouseLeave={() => setActiveSet(null)}
                        >
                            <h3 className="set-title">{title}</h3>
                            <p className="set-description">
                                {index === 0 && 'Essential words for everyday conversation'}
                                {index === 1 && 'Professional vocabulary for the workplace'}
                                {index === 2 && 'Common expressions for travelers'}
                            </p>
                            <div className="set-actions">
                                <button 
                                    className="set-btn study-btn"
                                    onClick={() => handleStudyClick(title)}
                                >
                                    <i className="fas fa-play"></i>
                                    Study
                                </button>
                                <button 
                                    className="set-btn edit-btn"
                                    onClick={() => handleEditClick(title)}
                                >
                                    <i className="fas fa-edit"></i>
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FlashcardsPage; 