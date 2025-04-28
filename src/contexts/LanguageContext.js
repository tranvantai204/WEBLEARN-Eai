import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Get stored language from localStorage or default to English
    const initialLanguage = localStorage.getItem('selectedLanguage') || 'en';
    const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);
    
    // Force English language across the app
    useEffect(() => {
        // Set language to English
        setCurrentLanguage('en');
        localStorage.setItem('selectedLanguage', 'en');
    }, []);
    
    // All available languages
    const languages = useMemo(() => [
        { code: 'en', name: 'English' },
        { code: 'vi', name: 'Vietnamese' },
        { code: 'ja', name: '日本語' },
        { code: 'ko', name: '한국어' },
        { code: 'zh', name: '中文' },
        { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' },
        { code: 'es', name: 'Español' },
        { code: 'it', name: 'Italiano' },
        { code: 'ru', name: 'Русский' },
        { code: 'pt', name: 'Português' },
        { code: 'nl', name: 'Nederlands' },
        { code: 'ar', name: 'العربية' },
        { code: 'hi', name: 'हिन्दी' },
        { code: 'th', name: 'ไทย' },
        { code: 'id', name: 'Bahasa Indonesia' }
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
        },
        ko: {
            'Flashcards': '플래시 카드',
            'Readings': '읽기',
            'Writing': '쓰기',
            'Discover': '탐색',
            'Sign In': '로그인',
            'Get Started': '시작하기',
            'Select Language': '언어 선택'
        },
        zh: {
            'Flashcards': '抽认卡',
            'Readings': '阅读',
            'Writing': '写作',
            'Discover': '发现',
            'Sign In': '登录',
            'Get Started': '开始',
            'Select Language': '选择语言'
        },
        fr: {
            'Flashcards': 'Cartes mémoire',
            'Readings': 'Lectures',
            'Writing': 'Écriture',
            'Discover': 'Découvrir',
            'Sign In': 'Connexion',
            'Get Started': 'Commencer',
            'Select Language': 'Choisir la langue'
        },
        de: {
            'Flashcards': 'Karteikarten',
            'Readings': 'Lektüren',
            'Writing': 'Schreiben',
            'Discover': 'Entdecken',
            'Sign In': 'Anmelden',
            'Get Started': 'Loslegen',
            'Select Language': 'Sprache auswählen'
        },
        es: {
            'Flashcards': 'Tarjetas de memoria',
            'Readings': 'Lecturas',
            'Writing': 'Escritura',
            'Discover': 'Descubrir',
            'Sign In': 'Iniciar sesión',
            'Get Started': 'Comenzar',
            'Select Language': 'Seleccionar idioma'
        },
        it: {
            'Flashcards': 'Carte mnemoniche',
            'Readings': 'Letture',
            'Writing': 'Scrittura',
            'Discover': 'Scoprire',
            'Sign In': 'Accedi',
            'Get Started': 'Iniziare',
            'Select Language': 'Seleziona lingua'
        },
        ru: {
            'Flashcards': 'Карточки',
            'Readings': 'Чтение',
            'Writing': 'Письмо',
            'Discover': 'Открыть',
            'Sign In': 'Войти',
            'Get Started': 'Начать',
            'Select Language': 'Выбрать язык'
        },
        pt: {
            'Flashcards': 'Cartões de memória',
            'Readings': 'Leituras',
            'Writing': 'Escrita',
            'Discover': 'Descobrir',
            'Sign In': 'Entrar',
            'Get Started': 'Começar',
            'Select Language': 'Selecionar idioma'
        },
        nl: {
            'Flashcards': 'Flashcards',
            'Readings': 'Leesmateriaal',
            'Writing': 'Schrijven',
            'Discover': 'Ontdekken',
            'Sign In': 'Inloggen',
            'Get Started': 'Aan de slag',
            'Select Language': 'Taal selecteren'
        },
        ar: {
            'Flashcards': 'بطاقات تعليمية',
            'Readings': 'قراءات',
            'Writing': 'كتابة',
            'Discover': 'اكتشاف',
            'Sign In': 'تسجيل الدخول',
            'Get Started': 'البدء',
            'Select Language': 'اختر اللغة'
        },
        hi: {
            'Flashcards': 'फ्लैशकार्ड',
            'Readings': 'पाठ',
            'Writing': 'लेखन',
            'Discover': 'खोजें',
            'Sign In': 'साइन इन करें',
            'Get Started': 'शुरू करें',
            'Select Language': 'भाषा चुनें'
        },
        th: {
            'Flashcards': 'บัตรคำ',
            'Readings': 'การอ่าน',
            'Writing': 'การเขียน',
            'Discover': 'ค้นพบ',
            'Sign In': 'เข้าสู่ระบบ',
            'Get Started': 'เริ่มต้น',
            'Select Language': 'เลือกภาษา'
        },
        id: {
            'Flashcards': 'Kartu Pengingat',
            'Readings': 'Bacaan',
            'Writing': 'Menulis',
            'Discover': 'Jelajahi',
            'Sign In': 'Masuk',
            'Get Started': 'Mulai',
            'Select Language': 'Pilih Bahasa'
        }
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