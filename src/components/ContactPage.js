import React, { useState } from 'react';
import '../css/components/ContactPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Normally this would send data to a server
        // For demo purposes, just simulate a success response
        setFormStatus('success');
        
        // Reset form after 3 seconds
        setTimeout(() => {
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
            setFormStatus(null);
        }, 3000);
    };

    return (
        <div className="contact-page">
            <div className="container">
                <div className="contact-header">
                    <h1>Contact Us</h1>
                    <p>Get in touch with our team for support, feedback, or inquiries</p>
                </div>

                <div className="contact-content">
                    <div className="contact-info">
                        <div className="info-card">
                            <div className="info-icon">
                                <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <h3>Our Office</h3>
                            <p>123 Language Street<br />Learning City, LC 12345<br />United States</p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <i className="fas fa-phone-alt"></i>
                            </div>
                            <h3>Phone</h3>
                            <p>General: +1 (555) 123-4567<br />Support: +1 (555) 987-6543</p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <i className="fas fa-envelope"></i>
                            </div>
                            <h3>Email</h3>
                            <p>General Inquiries:<br />info@wordwise.com<br /><br />Support:<br />support@wordwise.com</p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <i className="fas fa-clock"></i>
                            </div>
                            <h3>Business Hours</h3>
                            <p>Monday - Friday: 9am - 6pm EST<br />Saturday: 10am - 4pm EST<br />Sunday: Closed</p>
                        </div>

                        <div className="social-connect">
                            <h3>Connect With Us</h3>
                            <div className="social-icons">
                                <a href="https://facebook.com" className="social-icon" aria-label="Facebook">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="https://twitter.com" className="social-icon" aria-label="Twitter">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="https://instagram.com" className="social-icon" aria-label="Instagram">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="https://linkedin.com" className="social-icon" aria-label="LinkedIn">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-container">
                        <h2>Send Us a Message</h2>
                        <p>Fill out the form below and we'll get back to you as soon as possible.</p>

                        {formStatus === 'success' && (
                            <div className="form-success">
                                <i className="fas fa-check-circle"></i>
                                <p>Thank you for your message! We'll get back to you soon.</p>
                            </div>
                        )}

                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Your Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Your Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email address"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject *</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="What is this regarding?"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    placeholder="How can we help you?"
                                    rows="6"
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-button">Send Message</button>
                        </form>
                    </div>
                </div>

                <div className="faq-prompt">
                    <h3>Looking for quick answers?</h3>
                    <p>Check our FAQ section for answers to commonly asked questions.</p>
                    <button className="faq-button">Visit FAQ</button>
                </div>
            </div>
        </div>
    );
};

export default ContactPage; 