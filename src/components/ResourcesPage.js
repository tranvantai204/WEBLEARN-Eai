import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/components/ResourcesPage.css';

function ResourcesPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    
    const filterResources = (category) => {
        setActiveCategory(category);
    };
    
    return (
        <div className="resources-container">
            <section className="resources-hero">
                <div className="resources-hero-content">
                    <h1 className="resources-title">Tài nguyên học tập</h1>
                    <p className="resources-subtitle">
                        Khám phá bộ sưu tập các tài liệu, hướng dẫn và công cụ hỗ trợ việc học ngôn ngữ của bạn
                    </p>
                </div>
            </section>

            <section className="resources-main">
                <div className="container">
                    <div className="resources-intro">
                        <h2>Tài nguyên đa dạng cho mọi người học</h2>
                        <p>
                            Tại WordWise, chúng tôi tin rằng học ngôn ngữ không chỉ giới hạn trong các bài học trực tuyến. 
                            Chúng tôi đã tổng hợp một bộ sưu tập phong phú các tài nguyên học tập để hỗ trợ hành trình 
                            ngôn ngữ của bạn, từ tài liệu học thuật đến các công cụ thực hành thú vị.
                        </p>
                        <p>
                            Dù bạn là người mới bắt đầu đang tìm kiếm hướng dẫn cơ bản, hay người học nâng cao muốn 
                            trau dồi kỹ năng chuyên sâu, bộ sưu tập tài nguyên của chúng tôi sẽ giúp bạn tiến xa hơn 
                            trên con đường chinh phục ngôn ngữ mới.
                        </p>
                    </div>

                    <div className="resource-categories">
                        <button 
                            className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`} 
                            onClick={() => filterResources('all')}
                        >
                            Tất cả
                        </button>
                        <button 
                            className={`category-tab ${activeCategory === 'guides' ? 'active' : ''}`} 
                            onClick={() => filterResources('guides')}
                        >
                            Hướng dẫn
                        </button>
                        <button 
                            className={`category-tab ${activeCategory === 'ebooks' ? 'active' : ''}`} 
                            onClick={() => filterResources('ebooks')}
                        >
                            Sách điện tử
                        </button>
                        <button 
                            className={`category-tab ${activeCategory === 'tools' ? 'active' : ''}`} 
                            onClick={() => filterResources('tools')}
                        >
                            Công cụ học tập
                        </button>
                        <button 
                            className={`category-tab ${activeCategory === 'videos' ? 'active' : ''}`} 
                            onClick={() => filterResources('videos')}
                        >
                            Video
                        </button>
                        <button 
                            className={`category-tab ${activeCategory === 'podcasts' ? 'active' : ''}`} 
                            onClick={() => filterResources('podcasts')}
                        >
                            Podcast
                        </button>
                    </div>
                </div>
            </section>

            <section className="featured-resources">
                <div className="container">
                    <h2>Tài nguyên nổi bật</h2>
                    <div className="resources-grid">
                        <div className="resource-card">
                            <div className="resource-image">
                                <img src="/images/resources/spaced-repetition-guide.jpg" alt="Hướng dẫn Spaced Repetition" />
                            </div>
                            <div className="resource-content">
                                <div className="resource-type">Hướng dẫn</div>
                                <h3>Spaced Repetition: Cách học từ vựng hiệu quả nhất</h3>
                                <p>
                                    Khám phá phương pháp khoa học giúp bạn ghi nhớ từ vựng lâu dài và hiệu quả.
                                </p>
                                <div className="resource-meta">
                                    <span>10 phút đọc</span>
                                    <Link to="/resources/spaced-repetition-guide">Xem thêm</Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className="resource-card">
                            <div className="resource-image">
                                <img src="/images/resources/polyglot-ebook.jpg" alt="Ebook Polyglot" />
                            </div>
                            <div className="resource-content">
                                <div className="resource-type">Sách điện tử</div>
                                <h3>Polyglot: Bí quyết để nói nhiều ngôn ngữ</h3>
                                <p>
                                    Cuốn sách điện tử miễn phí chia sẻ phương pháp từ những người thông thạo nhiều ngôn ngữ.
                                </p>
                                <div className="resource-meta">
                                    <span>PDF, 125 trang</span>
                                    <Link to="/resources/polyglot-ebook">Tải xuống</Link>
                                </div>
                            </div>
                        </div>

                        <div className="resource-card">
                            <div className="resource-image">
                                <img src="/images/resources/culture-guides.jpg" alt="Giới thiệu văn hóa" />
                            </div>
                            <div className="resource-content">
                                <div className="resource-type">Video</div>
                                <h3>Giới thiệu văn hóa</h3>
                                <p>
                                    Series video ngắn giới thiệu về văn hóa của các quốc gia.
                                </p>
                                <div className="resource-meta">
                                    <span>20+ video</span>
                                    <Link to="/resources/culture-guides">Xem series</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="featured-resources">
                <div className="container">
                    <h2>Thư viện tài nguyên</h2>
                    <div className="resources-grid">
                        <div className="resource-card">
                            <div className="resource-image">
                                <img src="/images/resources/shadowing-technique.jpg" alt="Phương pháp Shadowing" />
                            </div>
                            <div className="resource-content">
                                <div className="resource-type">Hướng dẫn</div>
                                <h3>Phương pháp Shadowing</h3>
                                <p>
                                    Cải thiện phát âm và độ trôi chảy với kỹ thuật shadowing.
                                </p>
                                <div className="resource-meta">
                                    <span>8 phút đọc</span>
                                    <Link to="/resources/shadowing-technique">Xem thêm</Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className="resource-card">
                            <div className="resource-image">
                                <img src="/images/resources/interactive-ipa.jpg" alt="Bảng IPA tương tác" />
                            </div>
                            <div className="resource-content">
                                <div className="resource-type">Công cụ</div>
                                <h3>Bảng IPA tương tác</h3>
                                <p>
                                    Công cụ tương tác giúp bạn học và luyện tập các âm trong bảng phiên âm quốc tế.
                                </p>
                                <div className="resource-meta">
                                    <span>Công cụ trực tuyến</span>
                                    <Link to="/resources/interactive-ipa">Sử dụng</Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className="resource-card">
                            <div className="resource-image">
                                <img src="/images/resources/essential-grammar.jpg" alt="Ngữ pháp cơ bản" />
                            </div>
                            <div className="resource-content">
                                <div className="resource-type">Sách điện tử</div>
                                <h3>Ngữ pháp cơ bản</h3>
                                <p>
                                    Tổng hợp các quy tắc ngữ pháp cơ bản cho 10 ngôn ngữ phổ biến.
                                </p>
                                <div className="resource-meta">
                                    <span>PDF, 87 trang</span>
                                    <Link to="/resources/essential-grammar">Tải xuống</Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className="resource-card">
                            <div className="resource-image">
                                <img src="/images/resources/polyglot-interviews.jpg" alt="Phỏng vấn với Polyglots" />
                            </div>
                            <div className="resource-content">
                                <div className="resource-type">Video</div>
                                <h3>Phỏng vấn với Polyglots</h3>
                                <p>
                                    Series video phỏng vấn với những người nói nhiều thứ tiếng.
                                </p>
                                <div className="resource-meta">
                                    <span>12 video</span>
                                    <Link to="/resources/polyglot-interviews">Xem series</Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className="resource-card">
                            <div className="resource-image">
                                <img src="/images/resources/wordwise-talks.jpg" alt="WordWise Talks" />
                            </div>
                            <div className="resource-content">
                                <div className="resource-type">Podcast</div>
                                <h3>WordWise Talks</h3>
                                <p>
                                    Podcast hàng tuần về các chủ đề liên quan đến ngôn ngữ và văn hóa.
                                </p>
                                <div className="resource-meta">
                                    <span>24 tập</span>
                                    <Link to="/resources/wordwise-talks">Nghe podcast</Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className="resource-card">
                            <div className="resource-image">
                                <img src="/images/resources/listening-skills.jpg" alt="Luyện nghe hiệu quả" />
                            </div>
                            <div className="resource-content">
                                <div className="resource-type">Hướng dẫn</div>
                                <h3>Luyện nghe hiệu quả</h3>
                                <p>
                                    Phương pháp từng bước để cải thiện kỹ năng nghe cho người học ở mọi trình độ.
                                </p>
                                <div className="resource-meta">
                                    <span>15 phút đọc</span>
                                    <Link to="/resources/listening-skills">Xem thêm</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="language-specific-resources">
                <div className="container">
                    <h2 className="section-title">Tài nguyên theo ngôn ngữ</h2>
                    <div className="language-tabs">
                        <button className="language-tab active">Tiếng Anh</button>
                        <button className="language-tab">Tiếng Pháp</button>
                        <button className="language-tab">Tiếng Đức</button>
                        <button className="language-tab">Tiếng Tây Ban Nha</button>
                        <button className="language-tab">Tiếng Nhật</button>
                        <button className="language-tab">Tiếng Trung</button>
                        <button className="language-tab">Tiếng Hàn</button>
                        <button className="language-tab">Xem tất cả</button>
                    </div>
                    
                    <div className="language-resource-preview">
                        <div className="resource-columns">
                            <div className="resource-column">
                                <h3>Tài liệu phổ biến</h3>
                                <ul className="resource-list">
                                    <li>
                                        <Link to="/resources/english/pronunciation-guide">
                                            Hướng dẫn phát âm tiếng Anh toàn diện
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/resources/english/phrasal-verbs">
                                            500 Phrasal Verbs thông dụng nhất
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/resources/english/idioms">
                                            Thành ngữ tiếng Anh và cách sử dụng
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/resources/english/business-english">
                                            Tiếng Anh thương mại cho người đi làm
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/resources/english/ielts-preparation">
                                            Hướng dẫn ôn thi IELTS hiệu quả
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="resource-column">
                                <h3>Video & Podcast</h3>
                                <ul className="resource-list">
                                    <li>
                                        <Link to="/resources/english/pronunciation-videos">
                                            Series video phát âm chuẩn
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/resources/english/daily-conversation">
                                            Hội thoại hàng ngày cho người mới học
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/resources/english/podcast-beginners">
                                            Podcast cho người mới bắt đầu
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/resources/english/culture-insights">
                                            Hiểu về văn hóa các nước nói tiếng Anh
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="resource-column">
                                <h3>Công cụ & Trò chơi</h3>
                                <ul className="resource-list">
                                    <li>
                                        <Link to="/resources/english/grammar-checker">
                                            Công cụ kiểm tra ngữ pháp
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/resources/english/vocabulary-games">
                                            Trò chơi học từ vựng
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/resources/english/phonetics-tool">
                                            Bảng phiên âm tương tác
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/resources/english/writing-assistant">
                                            Trợ lý viết tiếng Anh
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="language-resource-action">
                            <Link to="/resources/english" className="btn btn-secondary">
                                Xem tất cả tài nguyên tiếng Anh <i className="fas fa-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="resource-request">
                <div className="container">
                    <div className="request-content">
                        <div className="request-text">
                            <h2>Không tìm thấy những gì bạn cần?</h2>
                            <p>
                                Chúng tôi liên tục phát triển các tài nguyên mới dựa trên phản hồi từ cộng đồng người học.
                                Nếu bạn cần một tài nguyên cụ thể hoặc có ý tưởng cho tài liệu mới, hãy cho chúng tôi biết!
                            </p>
                        </div>
                        <div className="request-action">
                            <Link to="/resources/request" className="btn btn-primary">
                                Yêu cầu tài nguyên mới
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-cta">
                <div className="container">
                    <div className="cta-content">
                        <h2>Sẵn sàng nâng cao việc học của bạn?</h2>
                        <p>
                            Kết hợp các tài nguyên này với nền tảng học tập WordWise để đạt được
                            kết quả tốt nhất trong hành trình học ngôn ngữ của bạn.
                        </p>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn btn-primary">
                                Đăng ký miễn phí
                            </Link>
                            <Link to="/about" className="btn btn-secondary">
                                Tìm hiểu thêm về WordWise
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ResourcesPage; 