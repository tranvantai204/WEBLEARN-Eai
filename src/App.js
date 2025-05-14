import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { FlashcardProvider } from './contexts/FlashcardContext';
import { WritingExerciseProvider } from './contexts/WritingExerciseContext';
import { MultipleChoiceTestProvider } from './contexts/MultipleChoiceTestContext';

// Import language utilities
import './scripts/forceEnglishLanguage';
import { forceEnglishLanguage } from './utils/forceEnglishLanguage';

// Import route protection components
import ProtectedRoute from './components/ProtectedRoute';
import UnprotectedRoute from './components/UnprotectedRoute';

// Import components
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import ScrollToTop from './components/ScrollToTop.js';
import HomePage from './components/HomePage.js';
import LoginPage from './components/LoginPage.js';
import RegisterPage from './components/RegisterPage.js';
import ForgotPasswordPage from './components/ForgotPasswordPage.js';
import ResetPasswordPage from './components/ResetPasswordPage.js';
import DashboardPage from './components/DashboardPage.js';
import FlashcardsPage from './components/FlashcardsPage.js';
import ExploreFlashcardsPage from './components/ExploreFlashcardsPage.js';
import ExploreMultipleChoiceTestsPage from './components/ExploreMultipleChoiceTestsPage.js';
import ExploreWritingPage from './components/ExploreWritingPage.js';
import CreateFlashcardsPage from './components/CreateFlashcardsPage.js';
import CreateAIFlashcardsPage from './components/CreateAIFlashcardsPage.js';
import FlashcardSetDetailsPage from './components/FlashcardSetDetailsPage.js';
import StudyFlashcardsPage from './components/StudyFlashcardsPage.js';
import FlashcardLearningPage from './components/FlashcardLearningPage.js';
import ReadingsPage from './components/ReadingsPage.js';
import CreateReadingPage from './components/CreateReadingPage.js';
import CreateMultipleChoiceTestPage from './components/CreateMultipleChoiceTestPage.js';
import EditMultipleChoiceTestPage from './components/EditMultipleChoiceTestPage.js';
import MultipleChoiceTestsPage from './components/MultipleChoiceTestsPage.js';
import MultipleChoiceTestDetailPage from './components/MultipleChoiceTestDetailPage.js';
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
import './css/mobile-utils.css'; // Import mobile utilities

// Import Admin components
import AdminApp from './admin/AdminApp';
import NotFoundPage from './components/NotFoundPage.js';

// Layout wrapper component
const AppLayout = () => {
    const location = useLocation();
    
    // Don't show header and footer on auth pages or admin pages
    const isAuthPage = location.pathname === '/login' || 
                      location.pathname === '/register' || 
                      location.pathname === '/forgot-password' || 
                      location.pathname.startsWith('/reset-password');
    
    const isAdminPage = location.pathname.startsWith('/admin');
    
    if (isAdminPage) {
        return <AdminApp />;
    }
    
    return (
        <div className="app">
            {!isAuthPage && <Header />}
            <main className={`main-content ${isAuthPage ? 'auth-page' : ''}`}>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/flashcards/explore" element={<ExploreFlashcardsPage />} />
                    <Route path="/readings/tests/explore" element={<ExploreMultipleChoiceTestsPage />} />
                    <Route path="/writing/explore" element={<ExploreWritingPage />} />
                    <Route path="/flashcard-set/:flashcardSetId" element={<FlashcardSetDetailsPage />} />
                    <Route path="/public-learn/:flashcardSetId" element={<FlashcardLearningPage />} />
                    <Route path="/public-test/:testId" element={<MultipleChoiceTestDetailPage />} />
                    <Route path="/public-writing/:exerciseId" element={<WritingExerciseDetailPageSimple />} />
                    <Route path='*' element={<NotFoundPage/>}></Route>
                    {/* Unprotected routes (only accessible when not logged in) */}
                    <Route path="/login" element={
                        <UnprotectedRoute>
                            <LoginPage />
                        </UnprotectedRoute>
                    } />
                    <Route path="/register" element={
                        <UnprotectedRoute>
                            <RegisterPage />
                        </UnprotectedRoute>
                    } />
                    <Route path="/forgot-password" element={
                        <UnprotectedRoute>
                            <ForgotPasswordPage />
                        </UnprotectedRoute>
                    } />
                    <Route path="/reset-password" element={
                        <UnprotectedRoute>
                            <ResetPasswordPage />
                        </UnprotectedRoute>
                    } />
                    
                    {/* Protected routes (require authentication) */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/flashcards" element={
                        <ProtectedRoute>
                            <FlashcardsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/flashcards/create" element={
                        <ProtectedRoute>
                            <CreateFlashcardsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/flashcards/create-ai" element={
                        <ProtectedRoute>
                            <CreateAIFlashcardsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/flashcards/study" element={
                        <ProtectedRoute>
                            <StudyFlashcardsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/learn-flashcards/:flashcardSetId" element={
                        <ProtectedRoute>
                            <FlashcardLearningPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/readings" element={
                        <ProtectedRoute>
                            <ReadingsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/readings/create" element={
                        <ProtectedRoute>
                            <CreateReadingPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/readings/multiple-choice/create" element={
                        <ProtectedRoute>
                            <CreateMultipleChoiceTestPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/readings/multiple-choice/edit/:id" element={
                        <ProtectedRoute>
                            <EditMultipleChoiceTestPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/readings/multiple-choice/tests" element={
                        <ProtectedRoute>
                            <MultipleChoiceTestsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/readings/test/:id" element={
                        <ProtectedRoute>
                            <MultipleChoiceTestDetailPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/readings/tests" element={
                        <ProtectedRoute>
                            <ReadingsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/readings/practice" element={
                        <ProtectedRoute>
                            <ReadingsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/readings/custom" element={
                        <ProtectedRoute>
                            <ReadingsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/writing" element={
                        <ProtectedRoute>
                            <WritingPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/writing/exercise/:exerciseId" element={
                        <ProtectedRoute>
                            <WritingExerciseDetailPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/writing/exercise-simple/:exerciseId" element={
                        <ProtectedRoute>
                            <WritingExerciseDetailPageSimple />
                        </ProtectedRoute>
                    } />
                    <Route path="/discover" element={
                        <ProtectedRoute>
                            <DiscoverPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/progress" element={
                        <ProtectedRoute>
                            <UserProgressPage />
                        </ProtectedRoute>
                    } />
                    
                    {/* Public info pages */}
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
                        <MultipleChoiceTestProvider>
                            <Router>
                                <ScrollToTop />
                                <AppLayout />
                            </Router>
                        </MultipleChoiceTestProvider>
                    </WritingExerciseProvider>
                </FlashcardProvider>
            </AuthProvider>
        </LanguageProvider>
    );
}

export default App; 