import React from 'react';
import { Link } from 'react-router-dom';
import '../css/components/Features.css';

function Features({ title, subtitle, features }) {
    return (
        <section className="features-section">
            <div className="section-header">
                <h2 className="section-title">{title}</h2>
                <p className="section-subtitle">{subtitle}</p>
            </div>

            <div className="feature-cards-container">
                {features.map((feature, index) => (
                    <div className="feature-card" key={index}>
                        <div className="feature-icon-wrapper">
                            <div className="feature-icon">
                                <i className={feature.icon || "fas fa-brain"}></i>
                            </div>
                        </div>
                        <h3 className="feature-title">{feature.title}</h3>
                        <p className="feature-description">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Features;