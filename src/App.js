import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { FlashcardProvider } from './contexts/FlashcardContext';
import { WritingExerciseProvider } from './contexts/WritingExerciseContext';

// Import components
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import ScrollToTop from './components/ScrollToTop.js';
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
import WritingExerciseDetailPage from './components/WritingExerciseDetailPage.js';
import WritingExerciseDetailPageSimple from './components/WritingExerciseDetailPageSimple.js';
import DiscoverPage from './components/DiscoverPage.js';
import ProfilePage from './components/ProfilePage.js';
import UserProgressPage from './components/UserProgressPage.js';
import ResourcesPage from './components/ResourcesPage.js';
import OurStoryPage from './components/OurStoryPage.js';
import HowItWorksPage from './components/HowItWorksPage.js';
import TestimonialsPage from './components/TestimonialsPage.js';
import CareersPage from './components/CareersPage.js';
import BlogPage from './components/BlogPage.js';
import HelpCenterPage from './components/HelpCenterPage.js';
import FaqPage from './components/FaqPage.js';
import ContactPage from './components/ContactPage.js';
import PrivacyPolicyPage from './components/PrivacyPolicyPage.js';
import TermsOfServicePage from './components/TermsOfServicePage.js';
import CookiesPage from './components/CookiesPage.js';


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
                    <Route path="/writing/exercise/:exerciseId" element={<WritingExerciseDetailPage />} />
                    <Route path="/writing/exercise-simple/:exerciseId" element={<WritingExerciseDetailPageSimple />} />
                    <Route path="/discover" element={<DiscoverPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/progress" element={<UserProgressPage />} />
                    <Route path="/resources" element={<ResourcesPage />} />
                    <Route path="/our-story" element={<OurStoryPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/testimonials" element={<TestimonialsPage />} />
                    <Route path="/careers" element={<CareersPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/help-center" element={<HelpCenterPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                    <Route path="/cookies" element={<CookiesPage />} />
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
                    <WritingExerciseProvider>
                        <Router>
                            <ScrollToTop />
                            <AppLayout />
                        </Router>
                    </WritingExerciseProvider>
                </FlashcardProvider>
            </AuthProvider>
        </LanguageProvider>
    );
}

export default App; 