import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { FlashcardProvider } from './contexts/FlashcardContext';

// Import components
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import HomePage from './components/HomePage.js';
import LoginPage from './components/LoginPage.js';
import RegisterPage from './components/RegisterPage.js';
import DashboardPage from './components/DashboardPage.js';
import FlashcardsPage from './components/FlashcardsPage.js';
import CreateFlashcardsPage from './components/CreateFlashcardsPage.js';
import CreateAIFlashcardsPage from './components/CreateAIFlashcardsPage.js';
import FlashcardSetDetailsPage from './components/FlashcardSetDetailsPage.js';
import StudyFlashcardsPage from './components/StudyFlashcardsPage.js';
import FlashcardLearningPage from './components/FlashcardLearningPage.js';
import ReadingsPage from './components/ReadingsPage.js';
import CreateReadingPage from './components/CreateReadingPage.js';
import WritingPage from './components/WritingPage.js';
import CreateWritingPage from './components/CreateWritingPage.js';
import DiscoverPage from './components/DiscoverPage.js';
import ProfilePage from './components/ProfilePage.js';
import UserProgressPage from './components/UserProgressPage.js';
import ResourcesPage from './components/ResourcesPage.js';

// Layout wrapper component
const AppLayout = () => {
    const location = useLocation();
    
    // Don't show header and footer on auth pages
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    
    return (
        <div className="app">
            {!isAuthPage && <Header />}
            <main className={`main-content ${isAuthPage ? 'auth-page' : ''}`}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/flashcards" element={<FlashcardsPage />} />
                    <Route path="/flashcards/create" element={<CreateFlashcardsPage />} />
                    <Route path="/flashcards/create-ai" element={<CreateAIFlashcardsPage />} />
                    <Route path="/flashcard-set/:flashcardSetId" element={<FlashcardSetDetailsPage />} />
                    <Route path="/flashcards/study" element={<StudyFlashcardsPage />} />
                    <Route path="/learn-flashcards/:flashcardSetId" element={<FlashcardLearningPage />} />
                    <Route path="/readings" element={<ReadingsPage />} />
                    <Route path="/readings/create" element={<CreateReadingPage />} />
                    <Route path="/writing" element={<WritingPage />} />
                    <Route path="/writing/create" element={<CreateWritingPage />} />
                    <Route path="/discover" element={<DiscoverPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/progress" element={<UserProgressPage />} />
                    <Route path="/resources" element={<ResourcesPage />} />
                </Routes>
            </main>
            {!isAuthPage && <Footer />}
        </div>
    );
};

function App() {
    return (
        <LanguageProvider>
            <AuthProvider>
                <FlashcardProvider>
                    <Router>
                        <AppLayout />
                    </Router>
                </FlashcardProvider>
            </AuthProvider>
        </LanguageProvider>
    );
}

export default App; 