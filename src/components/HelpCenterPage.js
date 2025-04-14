import React, { useState } from 'react';
import '../css/components/HelpCenterPage.css';

const HelpCenterPage = () => {
    const [activeCategory, setActiveCategory] = useState('getting-started');
    const [searchQuery, setSearchQuery] = useState('');

    const helpCategories = [
        { id: 'getting-started', name: 'Getting Started', icon: 'rocket' },
        { id: 'account', name: 'Account & Profile', icon: 'user-circle' },
        { id: 'flashcards', name: 'Flashcards', icon: 'layer-group' },
        { id: 'readings', name: 'Readings', icon: 'book-open' },
        { id: 'writing', name: 'Writing Practice', icon: 'pen-fancy' },
        { id: 'ai-features', name: 'AI Features', icon: 'robot' },
        { id: 'billing', name: 'Billing & Subscription', icon: 'credit-card' },
        { id: 'troubleshooting', name: 'Troubleshooting', icon: 'tools' }
    ];

    const helpArticles = {
        'getting-started': [
            { id: 1, title: 'How to Create Your WordWise Account', excerpt: 'Learn how to set up your account and get started with language learning.' },
            { id: 2, title: 'Setting Your Language Learning Goals', excerpt: 'Tips for setting achievable goals that will keep you motivated.' },
            { id: 3, title: 'Navigating the Dashboard', excerpt: 'Get familiar with the main features and navigation of your learning dashboard.' },
            { id: 4, title: 'Using the Mobile App', excerpt: 'Learn how to download and use WordWise on your mobile device.' }
        ],
        'account': [
            { id: 5, title: 'How to Update Your Profile Information', excerpt: 'Instructions for updating your personal information and preferences.' },
            { id: 6, title: 'Managing Your Notification Settings', excerpt: 'Control which notifications you receive and how you receive them.' },
            { id: 7, title: 'Changing Your Password', excerpt: 'Steps to change your password and keep your account secure.' },
            { id: 8, title: 'Deleting Your Account', excerpt: 'Information about account deletion and what happens to your data.' }
        ],
        'flashcards': [
            { id: 9, title: 'Creating Custom Flashcard Sets', excerpt: 'Learn how to create your own personalized flashcard sets for effective study.' },
            { id: 10, title: 'Using AI-Generated Flashcards', excerpt: 'How to leverage our AI to create flashcards from any text or content.' },
            { id: 11, title: 'Spaced Repetition Learning System', excerpt: 'Understand how our spaced repetition system optimizes your memory retention.' },
            { id: 12, title: 'Importing and Exporting Flashcards', excerpt: 'How to import or export your flashcard sets from or to other platforms.' }
        ],
        'readings': [
            { id: 13, title: 'Finding Appropriate Reading Material', excerpt: 'Tips for selecting reading content that matches your proficiency level.' },
            { id: 14, title: 'Using the Integrated Dictionary', excerpt: 'How to use the built-in dictionary while reading texts.' },
            { id: 15, title: 'Creating Flashcards from Readings', excerpt: 'Turn vocabulary from your readings into flashcards with one click.' },
            { id: 16, title: 'Reading Progress Tracking', excerpt: 'Understanding how your reading progress is measured and tracked.' }
        ],
        'writing': [
            { id: 17, title: 'Getting Started with Writing Practice', excerpt: 'Learn about different writing exercises available on the platform.' },
            { id: 18, title: 'Using AI Writing Feedback', excerpt: 'How our AI provides helpful feedback on your writing practice.' },
            { id: 19, title: 'Setting Writing Goals', excerpt: 'Tips for establishing regular writing practice in your target language.' },
            { id: 20, title: 'Writing Prompts and Ideas', excerpt: 'Where to find writing prompts to inspire your practice sessions.' }
        ],
        'ai-features': [
            { id: 21, title: 'Understanding AI Language Correction', excerpt: 'How our AI identifies and corrects mistakes in your language usage.' },
            { id: 22, title: 'AI-Powered Study Recommendations', excerpt: 'Learn how our AI creates personalized study plans based on your performance.' },
            { id: 23, title: 'Speaking Practice with AI', excerpt: 'Tips for using the AI conversation partner for speaking practice.' },
            { id: 24, title: 'Data Privacy and AI', excerpt: 'Information about how we handle your data when using AI features.' }
        ],
        'billing': [
            { id: 25, title: 'Subscription Plans and Pricing', excerpt: 'Details about our various subscription options and what each includes.' },
            { id: 26, title: 'Managing Your Subscription', excerpt: 'How to upgrade, downgrade, or cancel your subscription.' },
            { id: 27, title: 'Payment Methods Accepted', excerpt: 'Information about accepted payment methods and billing cycles.' },
            { id: 28, title: 'Requesting a Refund', excerpt: 'Our refund policy and how to request a refund if needed.' }
        ],
        'troubleshooting': [
            { id: 29, title: 'Common Login Issues', excerpt: 'Solutions for problems with logging into your account.' },
            { id: 30, title: 'App Performance Problems', excerpt: 'Troubleshooting steps for when the app is running slowly or crashing.' },
            { id: 31, title: 'Missing Content or Progress', excerpt: 'What to do if your content or progress doesn\'t appear correctly.' },
            { id: 32, title: 'Contacting Technical Support', excerpt: 'How to get in touch with our support team for technical issues.' }
        ]
    };

    const filteredArticles = searchQuery 
        ? Object.values(helpArticles).flat().filter(article => 
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
        : helpArticles[activeCategory];

    return (
        <div className="help-center-page">
            <div className="container">
                <div className="help-header">
                    <h1>WordWise Help Center</h1>
                    <p>Find answers to your questions and learn how to get the most out of WordWise</p>
                    
                    <div className="help-search">
                        <input 
                            type="text" 
                            placeholder="Search for help topics..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button><i className="fas fa-search"></i></button>
                    </div>
                </div>

                <div className="help-content">
                    <div className="help-sidebar">
                        <h3>Categories</h3>
                        <ul className="help-categories">
                            {helpCategories.map(category => (
                                <li 
                                    key={category.id} 
                                    className={activeCategory === category.id && !searchQuery ? 'active' : ''}
                                    onClick={() => {
                                        setActiveCategory(category.id);
                                        setSearchQuery('');
                                    }}
                                >
                                    <i className={`fas fa-${category.icon}`}></i>
                                    {category.name}
                                </li>
                            ))}
                        </ul>

                        <div className="help-contact-card">
                            <h4>Need More Help?</h4>
                            <p>Our support team is here to assist you</p>
                            <button className="contact-support-btn">Contact Support</button>
                        </div>
                    </div>

                    <div className="help-articles">
                        <h2>{searchQuery ? 'Search Results' : helpCategories.find(cat => cat.id === activeCategory).name}</h2>
                        
                        {filteredArticles.length === 0 ? (
                            <div className="no-results">
                                <i className="fas fa-search"></i>
                                <h3>No results found</h3>
                                <p>Try different keywords or browse the help categories</p>
                            </div>
                        ) : (
                            <div className="article-list">
                                {filteredArticles.map(article => (
                                    <div className="article-card" key={article.id}>
                                        <h3>{article.title}</h3>
                                        <p>{article.excerpt}</p>
                                        <button className="read-article-btn">Read Article</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenterPage; 