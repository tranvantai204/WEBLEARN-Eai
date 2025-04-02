import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WelcomeAnimation from './WelcomeAnimation';
import '../css/components/Home.css';

function HomePage() {
    const [showAnimation, setShowAnimation] = useState(true);

    return (
        <div className="home-container">
            {showAnimation && (
                <WelcomeAnimation onComplete={() => setShowAnimation(false)} />
            )}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <i className="fas fa-star"></i>
                        <span>Học ngoại ngữ thông minh</span>
                    </div>
                    
                    <h1 className="hero-title">
                        Học Ngoại Ngữ Hiệu Quả<br />
                        với <span>Công Nghệ AI</span>
                    </h1>
                    
                    <p className="hero-subtitle">
                        Tối ưu hóa việc học của bạn với công nghệ AI tiên tiến. 
                        Tạo flashcards thông minh, luyện tập hiệu quả và theo dõi tiến độ dễ dàng.
                    </p>
                    
                    <div className="hero-cta">
                        <Link to="/register" className="btn-primary">
                            Bắt đầu miễn phí
                        </Link>
                        <Link to="/how-it-works" className="btn-secondary">
                            Tìm hiểu thêm
                        </Link>
                    </div>
                    
                    <div className="hero-image">
                        <img src="/images/dashboard-preview.png" alt="WordWise Dashboard" />
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="section-header">
                    <h2 className="section-title">Tính năng nổi bật</h2>
                    <p className="section-subtitle">
                        Khám phá các công cụ mạnh mẽ giúp việc học ngoại ngữ trở nên dễ dàng và hiệu quả hơn
                    </p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="fas fa-brain"></i>
                        </div>
                        <h3 className="feature-title">AI Thông Minh</h3>
                        <p className="feature-description">
                            Tự động tạo flashcards và bài tập phù hợp với trình độ của bạn
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <h3 className="feature-title">Theo Dõi Tiến Độ</h3>
                        <p className="feature-description">
                            Phân tích chi tiết quá trình học tập và đề xuất cải thiện
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="fas fa-sync"></i>
                        </div>
                        <h3 className="feature-title">Ôn Tập Thông Minh</h3>
                        <p className="feature-description">
                            Hệ thống ôn tập ngắt quãng giúp ghi nhớ từ vựng lâu hơn
                        </p>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <h2 className="cta-title">Sẵn sàng bắt đầu?</h2>
                <p className="cta-subtitle">
                    Tham gia cùng hàng triệu người học đang sử dụng WordWise
                </p>
                <Link to="/register" className="btn-primary">
                    Đăng ký miễn phí
                </Link>
            </section>
        </div>
    );
}

export default HomePage; 