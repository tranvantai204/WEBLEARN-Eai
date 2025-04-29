import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../css/components/TestimonialsPage.css';

function TestimonialsPage() {
  return (
    <div className="testimonials-page">
      <Helmet>
        <title>Testimonials | WordWise</title>
      </Helmet>
      
      <div className="testimonials-header">
        <h1 className="about-title">Reviews from Learners</h1>
        <p className="about-subtitle">
          Discover how WordWise has helped learners worldwide
        </p>
      </div>
      
      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">2M+</div>
            <div className="stat-label">Learners</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">16</div>
            <div className="stat-label">Languages</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">87%</div>
            <div className="stat-label">Achieved Learning Goals</div>
          </div>
        </div>
      </div>
      
      <div className="testimonials-section">
        <h2 className="section-title">What Our Learners Say</h2>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-text">
                WordWise completely changed how I learn Japanese. After 6 months of using this platform,
                I could confidently communicate during my trip to Japan. The personalized lessons helped me
                progress much faster than traditional courses I had tried before.
              </p>
            </div>
            <div className="testimonial-author">
              <img src="/images/testimonials/user1.jpg" alt="User avatar" className="author-avatar" />
              <p>Michael T.</p>
              <p>Software Engineer, Learning Japanese</p>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-text">
                As a language teacher, I've recommended WordWise to all my students.
                The intelligent learning algorithms really work! My students have made remarkable
                progress when combining traditional classroom learning with this app. In particular, 
                the pronunciation analysis feature has been incredibly helpful.
              </p>
            </div>
            <div className="testimonial-author">
              <img src="/images/testimonials/user2.jpg" alt="User avatar" className="author-avatar" />
              <p>Sarah L.</p>
              <p>English Teacher, Chu Van An High School</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="success-stories-section">
        <h2 className="section-title">Success Stories</h2>
        
        <div className="story-card">
          <div className="story-image">
            <img src="/images/testimonials/success1.jpg" alt="Success story" />
          </div>
          <div className="story-content">
            <h3>From Zero to B2 in 12 Months</h3>
            <p>
              Le Thanh used WordWise to learn German from scratch and reached B2 level after
              just 1 year. His story is proof of the effectiveness of our learning method
              and consistent practice approach.
            </p>
            <div className="story-author">
              <img src="/images/testimonials/user3.jpg" alt="User avatar" className="author-avatar" />
              <div>
                <p className="author-name">Le Thanh</p>
                <p>University Student</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="testimonial-card standalone">
          <div className="testimonial-content">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              WordWise has been the perfect companion for my English learning journey. The writing practice
              feature with AI feedback has significantly improved my essay writing skills. I achieved 7.5 in IELTS after
              6 months of practice!
            </p>
          </div>
          <div className="testimonial-author">
            <img src="/images/testimonials/user4.jpg" alt="User avatar" className="author-avatar" />
            <p>Tran M.</p>
            <p>Graduate Student</p>
          </div>
        </div>
        
        <div className="testimonial-card standalone">
          <div className="testimonial-content">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              My busy job made it difficult to find time to learn Korean. WordWise helped me learn anytime, anywhere,
              with just 15-20 minutes a day. The lessons are short but effective, perfect for my busy schedule.
            </p>
          </div>
          <div className="testimonial-author">
            <img src="/images/testimonials/user5.jpg" alt="User avatar" className="author-avatar" />
            <p>Nguyen H.</p>
            <p>Elementary School Teacher</p>
          </div>
        </div>
        
        <div className="testimonial-card standalone">
          <div className="testimonial-content">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              I've tried many language learning apps, but WordWise stands out thanks to its comprehensive approach.
              You don't just learn vocabulary, you develop all language skills. After 3 months, I was able to
              read simple French stories!
            </p>
          </div>
          <div className="testimonial-author">
            <img src="/images/testimonials/user6.jpg" alt="User avatar" className="author-avatar" />
            <p>Pham L.</p>
            <p>Marketing Specialist</p>
          </div>
        </div>
        
        <div className="testimonial-card standalone">
          <div className="testimonial-content">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              The spaced repetition system really works! I used to forget vocabulary quickly, but now
              the system reminds me at just the right time. My German vocabulary has increased significantly in just a few weeks.
            </p>
          </div>
          <div className="testimonial-author">
            <img src="/images/testimonials/user7.jpg" alt="User avatar" className="author-avatar" />
            <p>Hoang T.</p>
            <p>Engineer</p>
          </div>
        </div>
        
        <div className="testimonial-card standalone">
          <div className="testimonial-content">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              WordWise helped me confidently communicate in English with international patients. The dialogue scenarios in the app
              are very practical and closely related to real-life situations.
            </p>
          </div>
          <div className="testimonial-author">
            <img src="/images/testimonials/user8.jpg" alt="User avatar" className="author-avatar" />
            <p>Dr. Linh</p>
            <p>Medical Doctor</p>
          </div>
        </div>
        
        <div className="testimonial-card standalone">
          <div className="testimonial-content">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              WordWise makes learning English as fun as playing a game. The reward system and daily challenges
              help me stay motivated. My English grade improved from 7 to 9 in just one semester!
            </p>
          </div>
          <div className="testimonial-author">
            <img src="/images/testimonials/user9.jpg" alt="User avatar" className="author-avatar" />
            <p>Minh</p>
            <p>High School Student</p>
          </div>
        </div>
      </div>
      
      <div className="case-studies-section">
        <h2 className="section-title">Featured Case Studies</h2>
        
        <div className="case-study">
          <h3>From Afraid of Speaking English to Successful Interview at Multinational Company</h3>
          <div className="case-content">
            <div className="case-image">
              <img src="/images/testimonials/case1.jpg" alt="Case study" />
            </div>
            <div className="case-text">
              <p>
                "I always felt anxious when I had to speak English in meetings. After 6 months of using
                WordWise, I was confident enough to present in English and successfully interview for a position
                at a multinational company that required high English proficiency."
              </p>
              <p className="case-author">— Thanh Nguyen, Business Analyst</p>
            </div>
          </div>
        </div>
        
        <div className="case-study">
          <h3>Successful Study Abroad in Germany Thanks to Daily Practice</h3>
          <div className="case-content">
            <div className="case-image">
              <img src="/images/testimonials/case2.jpg" alt="Case study" />
            </div>
            <div className="case-text">
              <p>
                "I only had 8 months to prepare for the German B2 exam before applying to study abroad.
                Thanks to WordWise and consistent daily practice, I scored 87/100 and received a full scholarship
                to my dream university in Berlin."
              </p>
              <p className="case-author">— Van Anh, Computer Science Student</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="testimonial-cta">
        <div className="cta-container">
          <h2>Share Your Story</h2>
          <p>
            Had a great experience with WordWise? We'd love to hear your story!
            Share how WordWise has helped you on your language learning journey.
          </p>
          <a href="/contact" className="cta-button">
            Share Your Experience
          </a>
        </div>
      </div>
      
      <div className="join-section">
        <div className="join-content">
          <h2>Ready to Start Your Own Journey?</h2>
          <p>
            Join millions who have improved their language skills with WordWise.
          </p>
          <div className="join-buttons">
            <Link to="/register" className="join-button primary">
              Sign Up Free
            </Link>
            <Link to="/how-it-works" className="join-button secondary">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialsPage; 