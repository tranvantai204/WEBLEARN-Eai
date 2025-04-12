import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, Bounce } from 'react-toastify';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { useFlashcard } from '../contexts/FlashcardContext';
import ApiKeyForm from './ApiKeyForm';
import 'react-toastify/dist/ReactToastify.css';
import '../css/components/Reading.css';

function ReadingsPage() {
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);
    const [showAIOptions, setShowAIOptions] = useState(false);
    const [topic, setTopic] = useState('');
    const [showApiKeyForm, setShowApiKeyForm] = useState(false);
    const { translateText, currentLanguage } = useLanguage();
    const { getUserApiKey } = useFlashcard();
    
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

    // Handle API key form success
    const handleApiKeySuccess = () => {
        setShowApiKeyForm(false);
        toast.success('API key saved successfully!');
        
        // Continue with AI generation if that was the original action
        if (topic.trim()) {
            generateWithAI();
        }
    };
    
    // Skip API key for now
    const handleSkipApiKey = () => {
        setShowApiKeyForm(false);
        toast.info('You can add your API key later in settings. AI features will not work without an API key.');
    };
    
    // Actual AI generation function - called after API key check
    const generateWithAI = () => {
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

    const handleAIGenerate = async () => {
        if (!topic.trim()) {
            toast.error(translatedMessages.errorEmptyTopic);
            return;
        }

        // Kiểm tra API key trong localStorage trước
        const localApiKey = localStorage.getItem('gemini_api_key');
        const timestamp = localStorage.getItem('gemini_api_key_timestamp');
        
        if (localApiKey && timestamp) {
            // Kiểm tra xem API key có còn hiệu lực không (2 giờ)
            const now = Date.now();
            const saved = parseInt(timestamp, 10);
            const twoHoursMs = 2 * 60 * 60 * 1000;
            
            if (now - saved <= twoHoursMs) {
                console.log('Sử dụng API key từ localStorage');
                // Bỏ qua hiển thị form API key
                generateWithAI();
                return;
            } else {
                // API key đã hết hạn, xóa khỏi localStorage
                console.log('API key trong localStorage đã hết hạn');
                localStorage.removeItem('gemini_api_key');
                localStorage.removeItem('gemini_api_key_timestamp');
            }
        }

        // Check if API key is set
        try {
            const key = await getUserApiKey();
            if (!key) {
                setShowApiKeyForm(true);
                toast.warn('AI features require an API key');
                return;
            }
            
            // If we have an API key, proceed with generation
            generateWithAI();
        } catch (error) {
            console.error('Error checking API key:', error);
            // In case of error checking API key, try to generate anyway
            generateWithAI();
        }
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
            
            {/* Show API Key form as a popup overlay when needed */}
            {showApiKeyForm && (
                <ApiKeyForm onSuccess={handleApiKeySuccess} onSkip={handleSkipApiKey} />
            )}
        </div>
    );
}

export default ReadingsPage; 