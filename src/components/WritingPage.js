import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, Bounce } from 'react-toastify';
import { useLanguage } from '../contexts/LanguageContext';
import 'react-toastify/dist/ReactToastify.css';
import '../css/components/Writing.css';

function WritingPage() {
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [generationType, setGenerationType] = useState(null);
    const [topic, setTopic] = useState('');
    
    // Translation support
    const { translateText, currentLanguage } = useLanguage();
    const [translations, setTranslations] = useState({
        pageTitle: 'Writing',
        aiAssistant: 'AI Assistant',
        newWriting: 'New Writing',
        generateTopic: 'Generate Writing Topic',
        aiFeedback: 'AI Writing Feedback',
        generating: 'Generating...',
        enterTopic: 'Enter topic area...',
        category1: 'Personal thoughts and experiences',
        category2: 'Creative writing and storytelling',
        category3: 'Academic and formal writing',
        write: 'Write',
        edit: 'Edit',
        totalEntries: 'Total Entries',
        wordsWritten: 'Words Written',
        timeSpent: 'Time Spent',
        feedbackReceived: 'Feedback Received'
    });
    
    // Messages that need to be pre-translated for toast notifications
    const [messages, setMessages] = useState({
        confirmLeave: 'Are you sure you want to cancel? Any unsaved changes will be lost.',
        savingSuccess: 'Writing saved successfully!',
        enterTopicFirst: 'Please enter a topic first!',
        generatingTopic: '🤖 Generating writing topic...',
        analyzingWriting: '🤖 Analyzing your writing...',
        topicGenerated: '✨ Writing topic generated successfully!',
        feedbackProvided: '✨ Writing feedback provided!'
    });
    
    // Update translations when language changes
    useEffect(() => {
        const updateTranslations = async () => {
            try {
                // Update UI translations
                const newTranslations = {};
                for (const [key, value] of Object.entries(translations)) {
                    newTranslations[key] = await translateText(value);
                }
                setTranslations(newTranslations);
                
                // Update message translations separately
                const newMessages = {};
                for (const [key, value] of Object.entries(messages)) {
                    newMessages[key] = await translateText(value);
                }
                setMessages(newMessages);
            } catch (error) {
                console.error("Translation error in WritingPage:", error);
            }
        };
        
        updateTranslations();
    }, [currentLanguage, translateText]);

    const handleCancel = () => {
        const confirmLeave = window.confirm(messages.confirmLeave);
        if (confirmLeave) {
            navigate('/writing');
        }
    };

    const handleSave = () => {
        // Add validation logic here
        toast.success(messages.savingSuccess, {
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
        navigate('/writing');
    };

    const handleAIGenerate = () => {
        if (generationType === 'topic' && !topic) {
            toast.error(messages.enterTopicFirst);
            return;
        }
        setIsGenerating(true);
        const message = generationType === 'topic' 
            ? messages.generatingTopic
            : messages.analyzingWriting;
            
        toast(message, {
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
            setShowOptions(false);
            setTopic('');
            setGenerationType(null);
            const successMessage = generationType === 'topic' 
                ? messages.topicGenerated
                : messages.feedbackProvided;
            toast(successMessage, {
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

    return (
        <div className="main-content">
            <div className="writing-container">
                <div className="writing-header">
                    <h1 className="writing-title">{translations.pageTitle}</h1>
                    <div className="writing-actions">
                        <div className="ai-options-container">
                            {showOptions ? (
                                <div className="ai-options-group">
                                    {generationType === 'topic' ? (
                                        <div className="topic-input-group">
                                            <input
                                                type="text"
                                                placeholder={translations.enterTopic}
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
                                                {isGenerating ? translations.generating : translations.generateTopic}
                                            </button>
                                            <button 
                                                className="cancel-btn"
                                                onClick={() => {
                                                    setShowOptions(false);
                                                    setTopic('');
                                                    setGenerationType(null);
                                                }}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="ai-buttons-group">
                                            <button 
                                                className="ai-option-btn"
                                                onClick={() => setGenerationType('feedback')}
                                            >
                                                <i className="fas fa-comment-dots"></i>
                                                {translations.aiFeedback}
                                            </button>
                                            <button 
                                                className="ai-option-btn"
                                                onClick={() => setGenerationType('topic')}
                                            >
                                                <i className="fas fa-lightbulb"></i>
                                                {translations.generateTopic}
                                            </button>
                                            <button 
                                                className="cancel-btn"
                                                onClick={() => setShowOptions(false)}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button 
                                    className="ai-generate-btn"
                                    onClick={() => setShowOptions(true)}
                                >
                                    <i className="fas fa-robot"></i>
                                    {translations.aiAssistant}
                                </button>
                            )}
                        </div>
                        <Link to="/writing/create" className="writing-create-btn">
                            <i className="fas fa-plus"></i> {translations.newWriting}
                        </Link>
                    </div>
                </div>

                <div className="writing-categories">
                    <div className="writing-category-card">
                        <h3 className="writing-category-title">{translations.category1}</h3>
                        <div className="writing-category-actions">
                            <Link to="/writing/category/personal" className="writing-action-btn">
                                <i className="fas fa-pen"></i>
                                <span>{translations.write}</span>
                            </Link>
                            <Link to="/writing/category/personal/edit" className="writing-action-btn">
                                <i className="fas fa-edit"></i>
                                <span>{translations.edit}</span>
                            </Link>
                        </div>
                    </div>

                    <div className="writing-category-card">
                        <h3 className="writing-category-title">{translations.category2}</h3>
                        <div className="writing-category-actions">
                            <Link to="/writing/category/creative" className="writing-action-btn">
                                <i className="fas fa-pen"></i>
                                <span>{translations.write}</span>
                            </Link>
                            <Link to="/writing/category/creative/edit" className="writing-action-btn">
                                <i className="fas fa-edit"></i>
                                <span>{translations.edit}</span>
                            </Link>
                        </div>
                    </div>

                    <div className="writing-category-card">
                        <h3 className="writing-category-title">{translations.category3}</h3>
                        <div className="writing-category-actions">
                            <Link to="/writing/category/academic" className="writing-action-btn">
                                <i className="fas fa-pen"></i>
                                <span>{translations.write}</span>
                            </Link>
                            <Link to="/writing/category/academic/edit" className="writing-action-btn">
                                <i className="fas fa-edit"></i>
                                <span>{translations.edit}</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="writing-stats-container">
                    <div className="writing-stats">
                        <div className="writing-stat">
                            <div className="writing-stat-value">15</div>
                            <div className="writing-stat-label">{translations.totalEntries}</div>
                        </div>

                        <div className="writing-stat">
                            <div className="writing-stat-value">5,000</div>
                            <div className="writing-stat-label">{translations.wordsWritten}</div>
                        </div>

                        <div className="writing-stat">
                            <div className="writing-stat-value">3 hours</div>
                            <div className="writing-stat-label">{translations.timeSpent}</div>
                        </div>

                        <div className="writing-stat">
                            <div className="writing-stat-value">8</div>
                            <div className="writing-stat-label">{translations.feedbackReceived}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WritingPage; 