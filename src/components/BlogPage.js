import React from 'react';
import '../css/components/BlogPage.css';

const BlogPage = () => {
    const blogPosts = [
        {
            id: 1,
            title: "5 Essential Tips for Language Learning Success",
            date: "May 15, 2023",
            author: "Sarah Johnson",
            excerpt: "Discover the most effective strategies to accelerate your language learning journey and maintain motivation throughout the process.",
            image: "/images/blog/language-learning-tips.jpg",
            category: "Learning Strategies"
        },
        {
            id: 2,
            title: "The Science Behind Language Acquisition",
            date: "April 28, 2023",
            author: "Dr. Michael Chen",
            excerpt: "Explore the fascinating neuroscience of how our brains process and retain new languages, and what it means for your learning approach.",
            image: "/images/blog/language-science.jpg",
            category: "Research"
        },
        {
            id: 3,
            title: "How AI Is Revolutionizing Language Education",
            date: "April 10, 2023",
            author: "Emma Rodriguez",
            excerpt: "Learn how artificial intelligence and machine learning are creating personalized learning experiences and breaking down barriers in language education.",
            image: "/images/blog/ai-education.jpg",
            category: "Technology"
        },
        {
            id: 4,
            title: "Cultural Context: Why It Matters When Learning Languages",
            date: "March 22, 2023",
            author: "James Wilson",
            excerpt: "Understanding the cultural nuances behind languages can dramatically improve your comprehension and communication skills.",
            image: "/images/blog/cultural-context.jpg",
            category: "Culture"
        },
        {
            id: 5,
            title: "Success Stories: How WordWise Transformed My Learning Experience",
            date: "March 5, 2023",
            author: "Various Students",
            excerpt: "Read inspiring testimonials from students who achieved their language goals through consistent practice with WordWise.",
            image: "/images/blog/success-stories.jpg",
            category: "Success Stories"
        }
    ];

    return (
        <div className="blog-page">
            <div className="container">
                <div className="blog-header">
                    <h1>WordWise Blog</h1>
                    <p className="blog-subtitle">Insights, tips, and resources to enhance your language learning journey</p>
                </div>

                <div className="blog-categories">
                    <button className="category-button active">All</button>
                    <button className="category-button">Learning Strategies</button>
                    <button className="category-button">Technology</button>
                    <button className="category-button">Research</button>
                    <button className="category-button">Culture</button>
                    <button className="category-button">Success Stories</button>
                </div>

                <div className="blog-search">
                    <input type="text" placeholder="Search articles..." />
                    <button><i className="fas fa-search"></i></button>
                </div>

                <div className="blog-posts">
                    {blogPosts.map(post => (
                        <div className="blog-card" key={post.id}>
                            <div className="blog-image">
                                <div className="blog-category">{post.category}</div>
                                <img src={post.image || "/images/blog/placeholder.jpg"} alt={post.title} />
                            </div>
                            <div className="blog-content">
                                <h2 className="blog-title">{post.title}</h2>
                                <div className="blog-meta">
                                    <span className="blog-date"><i className="far fa-calendar"></i> {post.date}</span>
                                    <span className="blog-author"><i className="far fa-user"></i> {post.author}</span>
                                </div>
                                <p className="blog-excerpt">{post.excerpt}</p>
                                <button className="blog-read-more">Read More</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="blog-pagination">
                    <button className="pagination-button active">1</button>
                    <button className="pagination-button">2</button>
                    <button className="pagination-button">3</button>
                    <button className="pagination-button"><i className="fas fa-chevron-right"></i></button>
                </div>

                <div className="blog-newsletter">
                    <h3>Subscribe to Our Newsletter</h3>
                    <p>Get the latest articles and language learning tips delivered to your inbox</p>
                    <div className="newsletter-form">
                        <input type="email" placeholder="Your email address" />
                        <button>Subscribe</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPage; 