import React from 'react';

function Home() {
  return (
    <div className="home-container">
      <div className="cta-section">
        <h2 className="cta-title">Ready to Start Your Journey?</h2>
        <button className="cta-button">Get Started Now</button>
      </div>

      <div className="bottom-section">
        <h2 className="bottom-title">Join Thousands of Successful Learners</h2>
        <p className="bottom-description">
          Our platform has helped students from around the world achieve their goals 
          and unlock new opportunities. Whether you're a beginner or an experienced developer, 
          we have the resources you need to succeed.
        </p>
        <button className="bottom-button">Explore All Courses</button>
      </div>
    </div>
  );
}

export default Home; 