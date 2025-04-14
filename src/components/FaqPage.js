import React, { useState } from 'react';
import '../css/components/FAQPage.css';

const FaqPage = () => {
    const [activeCategory, setActiveCategory] = useState('general');
    const [expandedQuestions, setExpandedQuestions] = useState({});

    const categories = [
        { id: 'general', name: 'General Questions' },
        { id: 'account', name: 'Account & Subscription' },
        { id: 'features', name: 'Platform Features' },
        { id: 'payments', name: 'Payments & Billing' },
        { id: 'technical', name: 'Technical Support' }
    ];

    const faqs = {
        general: [
            {
                id: 'g1',
                question: 'What is WordWise?',
                answer: 'WordWise is an innovative language learning platform that uses artificial intelligence to help you master new languages more efficiently. Our platform offers flashcards, reading exercises, writing practice, and personalized learning paths tailored to your goals and progress.'
            },
            {
                id: 'g2',
                question: 'Which languages does WordWise support?',
                answer: 'WordWise currently supports learning English, Spanish, French, German, Italian, Portuguese, Chinese (Mandarin), Japanese, Korean, and Russian. We are constantly working on adding more languages to our platform.'
            },
            {
                id: 'g3',
                question: 'Is WordWise suitable for beginners?',
                answer: 'Absolutely! WordWise is designed for language learners at all levels, from complete beginners to advanced students. Our system adapts to your current proficiency level and provides appropriate content and challenges.'
            },
            {
                id: 'g4',
                question: 'How is WordWise different from other language learning apps?',
                answer: 'WordWise stands out with our advanced AI technology that creates a truly personalized learning experience. We focus on comprehensive language acquisition through varied exercises, adaptive learning algorithms, and detailed progress tracking that helps you learn more efficiently.'
            },
            {
                id: 'g5',
                question: 'How much time should I spend on WordWise each day?',
                answer: 'We recommend at least 15-20 minutes of daily practice for optimal results. Consistency is more important than duration. Regular short sessions are more effective than occasional long ones.'
            }
        ],
        account: [
            {
                id: 'a1',
                question: 'How do I create an account?',
                answer: 'You can create an account by clicking the "Register" button on our homepage. You\'ll need to provide your email address and create a password. You can also sign up using your Google or Facebook account for quicker registration.'
            },
            {
                id: 'a2',
                question: 'Can I use WordWise on multiple devices?',
                answer: 'Yes, you can access your WordWise account on any device with a web browser. Your progress will sync automatically across all your devices. We also offer mobile apps for iOS and Android.'
            },
            {
                id: 'a3',
                question: 'What\'s included in the free account?',
                answer: 'Free accounts include access to basic flashcard creation, limited practice exercises, and progress tracking for one language. Free users can create up to 5 flashcard sets with a maximum of 100 cards total.'
            },
            {
                id: 'a4',
                question: 'What additional features do premium subscribers get?',
                answer: 'Premium subscribers enjoy unlimited flashcard creation, access to all AI-powered features, advanced progress analytics, offline access, priority support, and learning materials for unlimited languages.'
            },
            {
                id: 'a5',
                question: 'How do I cancel my subscription?',
                answer: 'You can cancel your subscription at any time from your account settings page. Click on "Subscription", then "Cancel Subscription". Your premium access will continue until the end of your current billing period.'
            }
        ],
        features: [
            {
                id: 'f1',
                question: 'How does the AI flashcard creation work?',
                answer: 'Our AI flashcard feature allows you to paste any text in your target language, and our system will automatically generate useful flashcards with vocabulary, phrases, and grammar concepts from that text. The AI prioritizes words based on frequency and relevance to your learning level.'
            },
            {
                id: 'f2',
                question: 'Can I import my existing flashcards from other apps?',
                answer: 'Yes, WordWise supports importing flashcards from CSV files and other popular flashcard platforms like Anki and Quizlet. Go to the Flashcards section, click "Import", and follow the instructions.'
            },
            {
                id: 'f3',
                question: 'How does the spaced repetition system work?',
                answer: 'Our spaced repetition system schedules review sessions at optimal intervals to maximize long-term retention. Cards you find difficult will appear more frequently, while those you know well will appear less often, optimizing your study time.'
            },
            {
                id: 'f4',
                question: 'Can I track my progress over time?',
                answer: 'Yes, WordWise provides detailed analytics of your learning journey, including vocabulary mastery, study streaks, time spent learning, and proficiency improvements over time. These insights are available from your dashboard.'
            },
            {
                id: 'f5',
                question: 'Is there a way to practice pronunciation?',
                answer: 'Yes, our speaking practice feature uses advanced speech recognition to evaluate your pronunciation. The system provides feedback and suggestions for improvement, helping you develop authentic pronunciation in your target language.'
            }
        ],
        payments: [
            {
                id: 'p1',
                question: 'What payment methods do you accept?',
                answer: 'WordWise accepts all major credit and debit cards (Visa, MasterCard, American Express, Discover), PayPal, and Apple Pay for iOS app users. In select countries, we also offer local payment options.'
            },
            {
                id: 'p2',
                question: 'How much does a premium subscription cost?',
                answer: 'Our premium subscription is available for $9.99/month or $89.99/year (saving over 25%). We also offer special discounts for students and educators. Check our pricing page for current promotions.'
            },
            {
                id: 'p3',
                question: 'Do you offer refunds?',
                answer: 'We offer a 7-day money-back guarantee for new premium subscribers. If you\'re not satisfied with our service, you can request a full refund within 7 days of your initial purchase by contacting our support team.'
            },
            {
                id: 'p4',
                question: 'Is there a family or group plan available?',
                answer: 'Yes, our family plan allows up to 6 family members to have premium access under one subscription at a discounted rate. We also offer special plans for educational institutions and businesses.'
            },
            {
                id: 'p5',
                question: 'Will my subscription automatically renew?',
                answer: 'Yes, all subscriptions automatically renew at the end of the billing period to ensure uninterrupted service. You can turn off auto-renewal at any time from your account settings.'
            }
        ],
        technical: [
            {
                id: 't1',
                question: 'The app is running slowly. What can I do?',
                answer: 'Try clearing your browser cache and cookies, or reinstalling the mobile app. Make sure you\'re using the latest version of your browser or operating system. If problems persist, please contact our support team.'
            },
            {
                id: 't2',
                question: 'I forgot my password. How can I reset it?',
                answer: 'Click on the "Forgot Password" link on the login page, enter the email address associated with your account, and we\'ll send you instructions to reset your password.'
            },
            {
                id: 't3',
                question: 'Can I use WordWise offline?',
                answer: 'Premium users can download lessons and flashcard sets for offline use in our mobile apps. Your progress will sync when you reconnect to the internet.'
            },
            {
                id: 't4',
                question: 'How do I contact customer support?',
                answer: 'You can reach our support team by clicking the "Contact Us" link in the footer, or by emailing support@wordwise.com. Premium users get priority support with faster response times.'
            },
            {
                id: 't5',
                question: 'Is my data secure?',
                answer: 'Yes, we take data security very seriously. We use industry-standard encryption for all personal data and don\'t share your information with third parties. You can review our full privacy policy for more details.'
            }
        ]
    };

    const toggleQuestion = (questionId) => {
        setExpandedQuestions(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    return (
        <div className="faq-page">
            <div className="container">
                <div className="faq-header">
                    <h1>Frequently Asked Questions</h1>
                    <p>Find answers to the most common questions about WordWise</p>
                    
                    <div className="faq-search">
                        <input type="text" placeholder="Search for questions..." />
                        <button><i className="fas fa-search"></i></button>
                    </div>
                </div>

                <div className="faq-categories">
                    {categories.map(category => (
                        <button 
                            key={category.id}
                            className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                <div className="faq-content">
                    <h2>{categories.find(cat => cat.id === activeCategory).name}</h2>

                    <div className="faq-list">
                        {faqs[activeCategory].map(faq => (
                            <div className="faq-item" key={faq.id}>
                                <div 
                                    className="faq-question"
                                    onClick={() => toggleQuestion(faq.id)}
                                >
                                    <h3>{faq.question}</h3>
                                    <span className={`faq-toggle ${expandedQuestions[faq.id] ? 'open' : ''}`}>
                                        <i className={`fas fa-chevron-${expandedQuestions[faq.id] ? 'up' : 'down'}`}></i>
                                    </span>
                                </div>
                                {expandedQuestions[faq.id] && (
                                    <div className="faq-answer">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="faq-contact">
                    <h3>Still have questions?</h3>
                    <p>If you couldn't find the answer to your question, our support team is here to help.</p>
                    <button className="contact-support-btn">Contact Support</button>
                </div>
            </div>
        </div>
    );
};

export default FaqPage; 