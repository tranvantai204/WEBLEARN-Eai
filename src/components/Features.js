import React from 'react';
import { Link } from 'react-router-dom';

function Features() {
    const features = [
        {
            icon: 'fa-brain',
            title: 'AI-Powered Learning',
            description: 'Our advanced AI technology personalizes your learning experience and adapts to your progress.',
            color: 'primary'
        },
        {
            icon: 'fa-layer-group',
            title: 'Smart Flashcards',
            description: 'Create and study flashcards with spaced repetition to maximize retention and learning efficiency.',
            color: 'secondary'
        },
        {
            icon: 'fa-book-reader',
            title: 'Interactive Readings',
            description: 'Practice with authentic texts and get instant translations and explanations for difficult words.',
            color: 'accent'
        },
        {
            icon: 'fa-pen-fancy',
            title: 'Writing Practice',
            description: 'Improve your writing skills with AI-powered feedback and corrections in real-time.',
            color: 'primary'
        },
        {
            icon: 'fa-chart-line',
            title: 'Progress Tracking',
            description: 'Monitor your learning journey with detailed analytics and personalized insights.',
            color: 'secondary'
        },
        {
            icon: 'fa-users',
            title: 'Community Learning',
            description: 'Connect with other learners, share resources, and practice together.',
            color: 'accent'
        }
    ];

    return (
        <section className="features py-16 bg-white">
            <div className="container">
                <div className="text-center mb-12 animate-slide-up">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                        Why Choose <span className="text-primary">WordWise</span>?
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Our platform combines cutting-edge technology with proven learning methods to help you master languages faster and more effectively.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            className="card-hover bg-white p-6 rounded-2xl shadow-md animate-pop" 
                            style={{animationDelay: `${index * 0.1}s`}}
                        >
                            <div className={`feature-icon bg-${feature.color}-50 text-${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4`}>
                                <i className={`fas ${feature.icon} text-2xl`}></i>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                            <p className="text-gray-600 mb-4">{feature.description}</p>
                            <Link to="/discover" className={`text-${feature.color} font-medium flex items-center hover-lift`}>
                                Learn more
                                <i className="fas fa-arrow-right ml-2"></i>
                            </Link>
                        </div>
                    ))}
                </div>
                
                <div className="features-cta bg-primary-50 rounded-3xl p-10 text-center animate-fade-in">
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold mb-3 text-gray-900">Ready to Start Learning?</h3>
                        <p className="text-gray-700 mb-6">Join thousands of successful language learners on WordWise and see the difference yourself.</p>
                        <Link to="/register" className="btn btn-primary animate-pulse">
                            <i className="fas fa-rocket"></i>
                            Start Your Journey
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Features;