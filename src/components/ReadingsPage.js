import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLanguage } from '../contexts/LanguageContext';
import { useMultipleChoiceTest } from '../contexts/MultipleChoiceTestContext';
import { useFlashcard } from '../contexts/FlashcardContext';
import { ExploreSection } from './common';
import 'react-toastify/dist/ReactToastify.css';
import '../css/components/Reading.css';
import ApiKeyForm from './ApiKeyForm';
import { makeAuthenticatedRequest } from '../utils/apiUtils';
const bookIcon = '/images/book-icon.svg';

function ReadingsPage() {
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);
    const [showApiKeyForm, setShowApiKeyForm] = useState(false);
    const [aiParams, setAiParams] = useState({
        title: '',
        learningLanguage: 'ENG',
        nativeLanguage: 'VIE',
        level: 3
    });
    const { translateText, currentLanguage } = useLanguage();
    const { getUserApiKey } = useFlashcard();
    const { 
        multipleChoiceTests, 
        loading, 
        error,
        getAllMultipleChoiceTests,
        generateMultipleChoiceTestWithAI,
        totalPages,
        currentPage
    } = useMultipleChoiceTest();
    const [selectedLanguage, setSelectedLanguage] = useState('all');
    
    // State for translated content
    const [translations, setTranslations] = useState({
        pageTitle: 'My Reading Tests',
        createButton: 'Create New Test',
        generateButton: 'Generate with AI',
        filterByLanguage: 'Filter by Language:',
        allLanguages: 'All languages',
        noTestsFound: 'No reading tests found.',
        createFirstTest: 'Create your first test',
        generatingText: 'Generating...',
        topicPlaceholder: 'Enter a topic (optional) or leave blank for AI to choose a topic...',
        errorEmptyTopic: 'Please enter a topic for AI generation!',
        generatingMsg: '🤖 AI is generating your test content...',
        successMsg: '✨ Test content generated successfully!',
        takeTest: 'Take Test',
        edit: 'Edit',
        generateTestsWithAI: 'Generate Tests with AI',
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
        lessons: 'Lessons',
        students: 'Students',
        aiDescription: 'Enter a topic (optional) or leave blank for AI to choose one. Select options below to customize your reading test. AI will automatically generate a reading passage and multiple-choice questions. Example topics: "Climate Change", "Space Exploration", "Vietnamese Culture"...',
        aiHelperText: 'AI test generation requires a Google Gemini API key. If you don\'t have one yet, the system will guide you to add it.',
        learningLanguage: 'Learning Language',
        nativeLanguage: 'Native Language',
        levelDifficulty: 'Difficulty Level'
    });

    // Update translations when language changes
    useEffect(() => {
        if (currentLanguage === 'vi') {
            setTranslations({
                pageTitle: 'Bài Kiểm Tra Đọc Của Tôi',
                createButton: 'Tạo Bài Kiểm Tra Mới',
                generateButton: 'Tạo Bằng AI',
                filterByLanguage: 'Lọc Theo Ngôn Ngữ:',
                allLanguages: 'Tất cả ngôn ngữ',
                noTestsFound: 'Không tìm thấy bài kiểm tra đọc nào.',
                createFirstTest: 'Tạo bài kiểm tra đầu tiên của bạn',
                generatingText: 'Đang tạo...',
                topicPlaceholder: 'Nhập chủ đề (tùy chọn) hoặc để trống để AI chọn chủ đề...',
                errorEmptyTopic: 'Vui lòng nhập chủ đề để AI tạo!',
                generatingMsg: '🤖 AI đang tạo nội dung bài kiểm tra của bạn...',
                successMsg: '✨ Nội dung bài kiểm tra đã được tạo thành công!',
                takeTest: 'Làm Bài Kiểm Tra',
                edit: 'Chỉnh Sửa',
                generateTestsWithAI: 'Tạo Bài Kiểm Tra với AI',
                beginner: 'Sơ Cấp',
                intermediate: 'Trung Cấp',
                advanced: 'Cao Cấp',
                lessons: 'Bài Học',
                students: 'Học Viên',
                aiDescription: 'Nhập chủ đề (tùy chọn) hoặc để trống để AI chọn một chủ đề. Chọn các tùy chọn bên dưới để tùy chỉnh bài kiểm tra đọc của bạn. AI sẽ tự động tạo đoạn văn và câu hỏi trắc nghiệm. Ví dụ chủ đề: "Biến Đổi Khí Hậu", "Khám Phá Không Gian", "Văn Hóa Việt Nam"...',
                aiHelperText: 'Tạo bài kiểm tra bằng AI yêu cầu khóa API Google Gemini. Nếu bạn chưa có, hệ thống sẽ hướng dẫn bạn thêm vào.',
                learningLanguage: 'Ngôn Ngữ Học',
                nativeLanguage: 'Ngôn Ngữ Bản Địa',
                levelDifficulty: 'Cấp Độ Khó'
            });
        } else {
            setTranslations({
                pageTitle: 'My Reading Tests',
                createButton: 'Create New Test',
                generateButton: 'Generate with AI',
                filterByLanguage: 'Filter by Language:',
                allLanguages: 'All languages',
                noTestsFound: 'No reading tests found.',
                createFirstTest: 'Create your first test',
                generatingText: 'Generating...',
                topicPlaceholder: 'Enter a topic (optional) or leave blank for AI to choose a topic...',
                errorEmptyTopic: 'Please enter a topic for AI generation!',
                generatingMsg: '🤖 AI is generating your test content...',
                successMsg: '✨ Test content generated successfully!',
                takeTest: 'Take Test',
                edit: 'Edit',
                generateTestsWithAI: 'Generate Tests with AI',
                beginner: 'Beginner',
                intermediate: 'Intermediate',
                advanced: 'Advanced',
                lessons: 'Lessons',
                students: 'Students',
                aiDescription: 'Enter a topic (optional) or leave blank for AI to choose one. Select options below to customize your reading test. AI will automatically generate a reading passage and multiple-choice questions. Example topics: "Climate Change", "Space Exploration", "Vietnamese Culture"...',
                aiHelperText: 'AI test generation requires a Google Gemini API key. If you don\'t have one yet, the system will guide you to add it.',
                learningLanguage: 'Learning Language',
                nativeLanguage: 'Native Language',
                levelDifficulty: 'Difficulty Level'
            });
        }
    }, [currentLanguage]);

    const levelOptions = [
        { value: 1, label: 'Level 1 - Beginner' },
        { value: 2, label: 'Level 2 - Elementary' },
        { value: 3, label: 'Level 3 - Pre-Intermediate' },
        { value: 4, label: 'Level 4 - Intermediate' },
        { value: 5, label: 'Level 5 - Upper Intermediate' },
        { value: 6, label: 'Level 6 - Advanced' }
    ];

    const getLevelLabel = (levelValue) => {
        const option = levelOptions.find(opt => opt.value === levelValue);
        return option ? option.label : null; // Trả về null hoặc một giá trị mặc định nếu không tìm thấy
    };

    // Translate error/success messages up front to avoid async issues in callbacks
    const [translatedMessages, setTranslatedMessages] = useState({
        errorEmptyTopic: translations.errorEmptyTopic,
        generatingMsg: translations.generatingMsg,
        successMsg: translations.successMsg
    });

    // Fetch tests when component mounts using context
    useEffect(() => {
        console.log('ReadingsPage: Fetching tests from context');
        const fetchTests = async () => {
            try {
                // Get userId from localStorage
                let userId = null;
                try {
                    // First try to get directly from userId key
                    const directUserId = localStorage.getItem('userId');
                    if (directUserId) {
                        userId = directUserId;
                        console.log('Using userId directly from localStorage:', userId);
                    }
                    // If not found, try from userData object
                    else {
                        const userDataString = localStorage.getItem('userData');
                        if (userDataString) {
                            const userData = JSON.parse(userDataString);
                            userId = userData.userId;
                            console.log('Using userId from userData in localStorage:', userId);
                        }
                    }
                } catch (parseError) {
                    console.error('Error accessing/parsing userData from localStorage:', parseError);
                }
                
                if (!userId) {
                    console.warn('No userId available in localStorage, cannot fetch multiple choice tests');
                    return;
                }

                // Use context function to get tests, with pagination
                await getAllMultipleChoiceTests(userId, 1, 10);
                console.log('Tests fetched successfully via context:', multipleChoiceTests?.length || 0);
            } catch (err) {
                console.error('Error fetching tests:', err);
            }
        };

        fetchTests();
    }, [getAllMultipleChoiceTests]);

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

    const handleApiKeySuccess = () => {
        setShowApiKeyForm(false);
        toast.success('API key saved successfully!');
        
        // Luôn gọi generateWithAI vì title là tùy chọn
        generateWithAI();
    };
    
    const handleSkipApiKey = () => {
        setShowApiKeyForm(false);
        toast.info('You can add your API key later in settings.');
    };
    
    const generateWithAI = async () => {
        setIsGenerating(true);
        toast.info(translatedMessages.generatingMsg);

        try {
            // Use the MultipleChoiceTestContext function
            const result = await generateMultipleChoiceTestWithAI(aiParams);
            
            if (result) {
                toast.success(translatedMessages.successMsg);
                // Navigate to the new test
                navigate(`/readings/multiple-choice/edit/${result.multipleChoiceTestId}`);
            }
        } catch (error) {
            console.error('Error generating test with AI:', error);
            toast.error(error.message || 'Failed to generate test content');
        } finally {
            setIsGenerating(false);
            setAiParams({
                title: '',
                learningLanguage: 'ENG',
                nativeLanguage: 'VIE',
                level: 3
            });
        }
    };

    const handleAIGenerate = async () => {
        // Title là tùy chọn, không cần kiểm tra

        const localApiKey = localStorage.getItem('gemini_api_key');
        const timestamp = localStorage.getItem('gemini_api_key_timestamp');
        
        if (localApiKey && timestamp) {
            const now = Date.now();
            const saved = parseInt(timestamp, 10);
            const twoHoursMs = 2 * 60 * 60 * 1000;
            
            if (now - saved <= twoHoursMs) {
                generateWithAI();
                return;
            } else {
                localStorage.removeItem('gemini_api_key');
                localStorage.removeItem('gemini_api_key_timestamp');
            }
        }

        try {
            const key = await getUserApiKey();
            if (!key) {
                setShowApiKeyForm(true);
                toast.warn('AI features require an API key');
                return;
            }
            
            generateWithAI();
        } catch (error) {
            console.error('Error checking API key:', error);
            generateWithAI();
        }
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (error) {
            return 'Invalid date';
        }
    };

    // Helper to get random counts for demo purposes
    const getRandomCount = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Get level badge class based on test level
    const getLevelBadgeClass = (level) => {
        if (!level) return '';
        if (typeof level !== 'string') return '';
        level = level.toLowerCase();
        if (level.includes('inter')) return 'intermediate-badge';
        if (level.includes('adv')) return 'advanced-badge';
        return ''; // beginner is default
    };

    // Filter tests by language if a language is selected
    const filteredTests = selectedLanguage === 'all' 
        ? multipleChoiceTests 
        : multipleChoiceTests?.filter(test => test.learningLanguage === selectedLanguage);
    
    // Get unique languages for the dropdown
    const languages = [...new Set((multipleChoiceTests || []).map(test => test.learningLanguage))].filter(Boolean);

    // Add at the top of the component function where the other variables are defined
    const getFlagIcon = (langCode) => {
        switch(langCode) {
            case 'ENG':
                return <span className="flag-icon">🇬🇧</span>;
            case 'VIE':
                return <span className="flag-icon">🇻🇳</span>;
            case 'FRA':
                return <span className="flag-icon">🇫🇷</span>;
            case 'DEU':
                return <span className="flag-icon">🇩🇪</span>;
            case 'ESP':
                return <span className="flag-icon">🇪🇸</span>;
            case 'JPN':
                return <span className="flag-icon">🇯🇵</span>;
            case 'KOR':
                return <span className="flag-icon">🇰🇷</span>;
            case 'CHN':
                return <span className="flag-icon">🇨🇳</span>;
            case 'AR':
                return <span className="flag-icon">🇸🇦</span>;
            case 'RUS':
                return <span className="flag-icon">🇷🇺</span>;
            case 'POR':
                return <span className="flag-icon">🇵🇹</span>;
            case 'THA':
                return <span className="flag-icon">🇹🇭</span>;
            default:
                return <span className="flag-icon">🌐</span>;
        }
    };

    if (loading) {
        return (
            <div className="main-content">
                <div className="readings-wrapper">
                    <div className="custom-loading-spinner">
                        <div className="spinner-circle"></div>
                        <div className="spinner-text">{translateText('Loading...')}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-content">
            <div className="readings-wrapper">
                <div className="ai-section">
                    <h2 className="ai-section-title">{translateText('Tạo bài kiểm tra bằng AI')}</h2>
                    <p className="ai-description">
                        {translateText('Enter a topic (optional) or leave blank for AI to choose one. Select options below to customize your reading test. AI will automatically generate a reading passage and multiple-choice questions. Example topics: "Climate Change", "Space Exploration", "Vietnamese Culture"...')}
                    </p>
                    <div className="ai-input-container">
                        <input
                            type="text"
                            placeholder={translateText('Enter a topic (optional) or leave blank for AI to choose a topic...')}
                            value={aiParams.title}
                            onChange={(e) => setAiParams({ ...aiParams, title: e.target.value })}
                            className="ai-input"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') handleAIGenerate();
                            }}
                        />
                        <button 
                            className={`ai-btn ${isGenerating ? 'generating' : ''}`}
                            onClick={handleAIGenerate}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <div className="button-progress-bar"></div> {translateText('Generating...')}
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-robot"></i> {translateText('Generate with AI')}
                                </>
                            )}
                        </button>
                    </div>
                    
                    <div className="ai-options-container">
                        <div className="ai-option-row">
                            <div className="ai-option-group">
                                <label htmlFor="learningLanguage">{translateText('Learning Language')}:</label>
                                <select
                                    id="learningLanguage"
                                    value={aiParams.learningLanguage}
                                    onChange={(e) => setAiParams({ ...aiParams, learningLanguage: e.target.value })}
                                    className="ai-select"
                                >
                                    <option value="ENG">{translateText('English')}</option>
                                    <option value="ESP">{translateText('Spanish')}</option>
                                    <option value="FRA">{translateText('French')}</option>
                                    <option value="DEU">{translateText('German')}</option>
                                    <option value="JPN">{translateText('Japanese')}</option>
                                    <option value="KOR">{translateText('Korean')}</option>
                                    <option value="CHN">{translateText('Chinese')}</option>
                                    <option value="VIE">{translateText('Vietnamese')}</option>
                                </select>
                            </div>
                            
                            <div className="ai-option-group">
                                <label htmlFor="nativeLanguage">{translateText('Native Language')}:</label>
                                <select
                                    id="nativeLanguage"
                                    value={aiParams.nativeLanguage}
                                    onChange={(e) => setAiParams({ ...aiParams, nativeLanguage: e.target.value })}
                                    className="ai-select"
                                >
                                    <option value="VIE">{translateText('Vietnamese')}</option>
                                    <option value="ENG">{translateText('English')}</option>
                                    <option value="ESP">{translateText('Spanish')}</option>
                                    <option value="FRA">{translateText('French')}</option>
                                    <option value="DEU">{translateText('German')}</option>
                                    <option value="JPN">{translateText('Japanese')}</option>
                                    <option value="KOR">{translateText('Korean')}</option>
                                    <option value="CHN">{translateText('Chinese')}</option>
                                </select>
                            </div>
                            
                            <div className="ai-option-group">
                                <label htmlFor="level">{translateText('Difficulty Level')}:</label>
                                <select
                                    id="level"
                                    value={aiParams.level}
                                    onChange={(e) => setAiParams({ ...aiParams, level: parseInt(e.target.value) })}
                                    className="ai-select"
                                >
                                    <option value={1}>{translateText('Level 1 - Beginner')}</option>
                                    <option value={2}>{translateText('Level 2 - Elementary')}</option>
                                    <option value={3}>{translateText('Level 3 - Intermediate')}</option>
                                    <option value={4}>{translateText('Level 4 - Upper Intermediate')}</option>
                                    <option value={5}>{translateText('Level 5 - Advanced')}</option>
                                    <option value={6}>{translateText('Level 6 - Proficient')}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="ai-helper-text">
                        <i className="fas fa-info-circle"></i> {translateText('AI test generation requires a Google Gemini API key. If you don\'t have one yet, the system will guide you to add it.')}
                    </div>
                </div>

                <div className="tests-section">
                    <div className="tests-header">
                        <h1 className="tests-title">{translations.pageTitle}</h1>
                        <div className="tests-actions">
                            <Link to="/readings/multiple-choice/tests" className="view-tests-btn">
                                <i className="fas fa-list"></i> {translateText('My Multiple Choice Tests')}
                            </Link>
                            <Link to="/readings/multiple-choice/create" className="create-new-test-btn">
                                <i className="fas fa-plus"></i> {translations.createButton}
                            </Link>
                        </div>
                    </div>

                    <div className="language-filter">
                        <span>{translations.filterByLanguage}</span>
                        <select 
                            value={selectedLanguage} 
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="language-select"
                        >
                            <option value="all">{translations.allLanguages}</option>
                            {languages.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>

                    {error && <div className="api-error-message">{error}</div>}

                    {!error && filteredTests && filteredTests.length > 0 ? (
                        <div className="tests-grid">
                            {filteredTests.map(test => (
                                <div key={test.multipleChoiceTestId} className="test-item">
                                    <div className="test-image">
                                        <img src={bookIcon} alt="Reading test" />
                                    </div>
                                    <div className="test-item-content">
                                        <h3 className="test-item-title">{test.title}</h3>
                                        <p className="test-item-description">
                                            {test.description || `Practice your ${test.learningLanguage || 'language'} skills with this multiple choice test.`}
                                        </p>
                                        
                                        <div className="test-info">
                                            <span className={`level-badge ${getLevelBadgeClass(test.level)}`}>
                                            {getLevelLabel(test.level) || test.level || translations.beginner}
                                            </span>
                                            <div className="language-info">
                                                {getFlagIcon(test.learningLanguage)} {test.learningLanguage || 'ENG'}
                                            </div>
                                            <div className="students-count">
                                                <i className="fas fa-user-graduate"></i> {test.learnerCount} {translations.students}
                                            </div>
                                            
                                            <div className="lessons-count">
                                                <i className="fas fa-book"></i> {getRandomCount(5, 15)} {translations.lessons}
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className="test-item-actions">
                                        <Link 
                                            to={`/readings/test/${test.multipleChoiceTestId}`}
                                            className="test-action-btn take-btn"
                                        >
                                            <i className="fas fa-book-open"></i> {translations.takeTest}
                                        </Link>
                                        <Link 
                                            to={`/readings/multiple-choice/edit/${test.multipleChoiceTestId}`}
                                            className="test-action-btn edit-btn"
                                        >
                                            {translations.edit}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !error && (
                            <div className="empty-tests-container">
                                <p className="empty-tests-message">{translations.noTestsFound}</p>
                                <Link to="/readings/multiple-choice/create" className="create-first-test-btn">
                                    {translations.createFirstTest}
                                </Link>
                            </div>
                        )
                    )}
                </div>

                <ExploreSection type="readings" />
            </div>
            
            {showApiKeyForm && (
                <ApiKeyForm onSuccess={handleApiKeySuccess} onSkip={handleSkipApiKey} />
            )}
        </div>
    );
}

export default ReadingsPage; 