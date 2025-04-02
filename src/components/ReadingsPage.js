import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, Bounce } from 'react-toastify';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import 'react-toastify/dist/ReactToastify.css';
import '../css/components/Reading.css';

function ReadingsPage() {
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);
    const [showAIOptions, setShowAIOptions] = useState(false);
    const [topic, setTopic] = useState('');
    const { translateText, currentLanguage } = useLanguage();
    
    // State for translated content
    const [translations, setTranslations] = useState({
        pageTitle: 'Readings',
        generateButton: 'AI Generate',
        generatingText: 'Generating...',
        newReading: 'New Reading',
        category1: 'Current events and news articles',
        category2: 'Engaging fiction and non-fiction stories',
        category3: 'Professional and business-related content',
        read: 'Read',
        edit: 'Edit',
        totalReadings: 'Total Readings',
        wordsRead: 'Words Read',
        timeSpent: 'Time Spent',
        comprehension: 'Comprehension',
        topicPlaceholder: 'Enter topic for AI generation...',
        errorEmptyTopic: 'Please enter a topic for AI generation!',
        generatingMsg: '🤖 AI is generating your reading content...',
        successMsg: '✨ Reading content generated successfully!'
    });

    // Translate error/success messages up front to avoid async issues in callbacks
    const [translatedMessages, setTranslatedMessages] = useState({
        errorEmptyTopic: translations.errorEmptyTopic,
        generatingMsg: translations.generatingMsg,
        successMsg: translations.successMsg
    });

    // Update translations when language changes
    useEffect(() => {
        console.log("Language changed to:", currentLanguage);
        const updateTranslations = async () => {
            try {
                const newTranslations = {};
                for (const [key, value] of Object.entries(translations)) {
                    newTranslations[key] = await translateText(value);
                }
                setTranslations(newTranslations);

                // Update the translated messages separately
                setTranslatedMessages({
                    errorEmptyTopic: await translateText(translations.errorEmptyTopic),
                    generatingMsg: await translateText(translations.generatingMsg),
                    successMsg: await translateText(translations.successMsg)
                });
            } catch (error) {
                console.error("Translation error:", error);
            }
        };

        if (currentLanguage !== 'en') {
            updateTranslations();
        }
    }, [currentLanguage, translateText]);

    const handleAIGenerate = () => {
        if (!topic.trim()) {
            toast.error(translatedMessages.errorEmptyTopic);
            return;
        }

        setIsGenerating(true);
        toast.info(translatedMessages.generatingMsg);

        // Simulate AI generation
        setTimeout(() => {
            setIsGenerating(false);
            setShowAIOptions(false);
            setTopic('');
            toast.success(translatedMessages.successMsg);
            navigate('/readings/generated');
        }, 2000);
    };

    return (
        <div className="main-content">
            <div className="readings-container">
                <div className="readings-header">
                    <h1 className="readings-title">{translations.pageTitle}</h1>
                    <div className="readings-actions">
                        <div className="ai-options-container">
                            {!showAIOptions ? (
                                <button 
                                    className="ai-generate-btn"
                                    onClick={() => setShowAIOptions(true)}
                                >
                                    <i className="fas fa-robot"></i>
                                    {translations.generateButton}
                                </button>
                            ) : (
                                <div className="ai-options">
                                    <input
                                        type="text"
                                        placeholder={translations.topicPlaceholder}
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="ai-topic-input"
                                    />
                                    <button 
                                        className={`ai-generate-btn ${isGenerating ? 'generating' : ''}`}
                                        onClick={handleAIGenerate}
                                        disabled={isGenerating}
                                    >
                                        <i className={`fas ${isGenerating ? 'fa-spinner fa-spin' : 'fa-magic'}`}></i>
                                        {isGenerating ? translations.generatingText : translations.generateButton}
                                    </button>
                                    <button 
                                        className="ai-cancel-btn"
                                        onClick={() => {
                                            setShowAIOptions(false);
                                            setTopic('');
                                        }}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                        <Link to="/readings/create" className="readings-create-btn">
                            <i className="fas fa-plus"></i> {translations.newReading}
                        </Link>
                    </div>
                </div>

                <div className="readings-categories">
                    <div className="reading-category-card">
                        <h3 className="reading-category-title">{translations.category1}</h3>
                        <div className="reading-category-actions">
                            <Link to="/readings/category/news" className="reading-action-btn">
                                <i className="fas fa-book-open"></i>
                                <span>{translations.read}</span>
                            </Link>
                            <Link to="/readings/category/news/edit" className="reading-action-btn">
                                <i className="fas fa-edit"></i>
                                <span>{translations.edit}</span>
                            </Link>
                        </div>
                    </div>

                    <div className="reading-category-card">
                        <h3 className="reading-category-title">{translations.category2}</h3>
                        <div className="reading-category-actions">
                            <Link to="/readings/category/fiction" className="reading-action-btn">
                                <i className="fas fa-book-open"></i>
                                <span>{translations.read}</span>
                            </Link>
                            <Link to="/readings/category/fiction/edit" className="reading-action-btn">
                                <i className="fas fa-edit"></i>
                                <span>{translations.edit}</span>
                            </Link>
                        </div>
                    </div>

                    <div className="reading-category-card">
                        <h3 className="reading-category-title">{translations.category3}</h3>
                        <div className="reading-category-actions">
                            <Link to="/readings/category/business" className="reading-action-btn">
                                <i className="fas fa-book-open"></i>
                                <span>{translations.read}</span>
                            </Link>
                            <Link to="/readings/category/business/edit" className="reading-action-btn">
                                <i className="fas fa-edit"></i>
                                <span>{translations.edit}</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="readings-stats-container">
                    <div className="readings-stats">
                        <div className="reading-stat">
                            <div className="reading-stat-value">25</div>
                            <div className="reading-stat-label">{translations.totalReadings}</div>
                        </div>

                        <div className="reading-stat">
                            <div className="reading-stat-value">15,000</div>
                            <div className="reading-stat-label">{translations.wordsRead}</div>
                        </div>

                        <div className="reading-stat">
                            <div className="reading-stat-value">5 hours</div>
                            <div className="reading-stat-label">{translations.timeSpent}</div>
                        </div>

                        <div className="reading-stat">
                            <div className="reading-stat-value">85%</div>
                            <div className="reading-stat-label">{translations.comprehension}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReadingsPage; 