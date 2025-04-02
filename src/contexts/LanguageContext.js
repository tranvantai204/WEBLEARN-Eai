import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Get stored language from localStorage or default to English
    const initialLanguage = localStorage.getItem('selectedLanguage') || 'en';
    const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);
    
    // All available languages
    const languages = useMemo(() => [
        { code: 'en', name: 'English' },
        { code: 'vi', name: 'Tiếng Việt' },
        { code: 'ja', name: '日本語' },
        { code: 'ko', name: '한국어' },
        { code: 'zh', name: '中文' },
        { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' },
        { code: 'es', name: 'Español' }
    ], []);

    // Static translations for common UI elements
    const staticTranslations = useMemo(() => ({
        en: {
            'Flashcards': 'Flashcards',
            'Readings': 'Readings',
            'Writing': 'Writing',
            'Discover': 'Discover',
            'Sign In': 'Sign In',
            'Get Started': 'Get Started',
            'Select Language': 'Select Language'
        },
        vi: {
            'Flashcards': 'Thẻ ghi nhớ',
            'Readings': 'Bài đọc',
            'Writing': 'Viết',
            'Discover': 'Khám phá',
            'Sign In': 'Đăng nhập',
            'Get Started': 'Bắt đầu ngay',
            'Select Language': 'Chọn ngôn ngữ'
        },
        ja: {
            'Flashcards': 'フラッシュカード',
            'Readings': '読書',
            'Writing': '作文',
            'Discover': '発見',
            'Sign In': 'ログイン',
            'Get Started': '始めましょう',
            'Select Language': '言語を選択'
        }
        // Add more languages as needed
    }), []);

    // Simple translation function - returns static translation if available
    const translateText = useCallback((text) => {
        if (!text) return '';
        
        // If not English and we have a translation, use it
        if (currentLanguage !== 'en' && 
            staticTranslations[currentLanguage] && 
            staticTranslations[currentLanguage][text]) {
            return staticTranslations[currentLanguage][text];
        }
        
        // Otherwise return original text
        return text;
    }, [currentLanguage, staticTranslations]);

    // Change language and save to localStorage
    const changeLanguage = useCallback((langCode) => {
        if (langCode && languages.some(lang => lang.code === langCode)) {
            setCurrentLanguage(langCode);
            localStorage.setItem('selectedLanguage', langCode);
        }
    }, [languages]);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        currentLanguage,
        languages,
        translateText,
        changeLanguage
    }), [currentLanguage, languages, translateText, changeLanguage]);

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export default LanguageContext; 