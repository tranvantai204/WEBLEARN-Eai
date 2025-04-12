import React from 'react';
import { Link } from 'react-router-dom';
import '../css/components/About.css'; // Sử dụng chung CSS với AboutPage

function HowItWorksPage() {
    return (
        <div className="about-container">
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1 className="about-title">Cách hoạt động</h1>
                    <p className="about-subtitle">
                        Khám phá cách WordWise giúp bạn học ngôn ngữ hiệu quả hơn
                    </p>
                </div>
            </section>

            <section className="how-works-intro">
                <div className="container">
                    <div className="intro-content">
                        <div className="intro-text">
                            <h2>Phương pháp học ngôn ngữ thông minh</h2>
                            <p>
                                WordWise kết hợp các phương pháp học tập hiệu quả nhất được chứng minh bởi khoa học 
                                nhận thức với công nghệ trí tuệ nhân tạo tiên tiến. Hệ thống của chúng tôi liên tục 
                                phân tích cách học của bạn và điều chỉnh để tối ưu hóa tiến trình học tập.
                            </p>
                            <p>
                                Không giống như các ứng dụng học ngôn ngữ khác, chúng tôi không áp dụng cùng một 
                                phương pháp cho tất cả mọi người. Thay vào đó, chúng tôi tạo ra một lộ trình học tập 
                                riêng biệt phù hợp với cách học, mục tiêu và sở thích của bạn.
                            </p>
                        </div>
                        <div className="intro-image">
                            <img src="/images/how-it-works-intro.jpg" alt="Học ngôn ngữ thông minh" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="learning-steps">
                <div className="container">
                    <h2 className="section-title">Quy trình học tập</h2>
                    <div className="steps-container">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Đánh giá trình độ</h3>
                                <p>
                                    Khi bắt đầu, bạn sẽ thực hiện bài kiểm tra đánh giá để xác định trình độ hiện tại,
                                    điểm mạnh và điểm yếu. Điều này giúp hệ thống xây dựng lộ trình học tập phù hợp với bạn.
                                </p>
                                <div className="step-image">
                                    <img src="/images/step-assessment.jpg" alt="Đánh giá trình độ" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Xây dựng nền tảng từ vựng</h3>
                                <p>
                                    Sử dụng phương pháp Spaced Repetition, chúng tôi giúp bạn xây dựng vốn từ vựng mạnh mẽ 
                                    thông qua các bộ thẻ ghi nhớ thông minh. Hệ thống sẽ nhắc bạn ôn tập những từ bạn dễ quên
                                    đúng thời điểm, tối ưu hóa quá trình ghi nhớ.
                                </p>
                                <div className="step-image">
                                    <img src="/images/step-vocabulary.jpg" alt="Xây dựng từ vựng" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Luyện tập kỹ năng ngôn ngữ</h3>
                                <p>
                                    Thông qua các bài tập tương tác, bạn sẽ luyện tập cả bốn kỹ năng: nghe, nói, đọc, viết.
                                    AI của chúng tôi phân tích phát âm, cấu trúc câu và cung cấp phản hồi chi tiết để giúp
                                    bạn cải thiện liên tục.
                                </p>
                                <div className="step-image">
                                    <img src="/images/step-skills.jpg" alt="Luyện tập kỹ năng" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="step-card">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h3>Học trong ngữ cảnh thực tế</h3>
                                <p>
                                    Thay vì học từ và ngữ pháp riêng lẻ, bạn sẽ học ngôn ngữ trong các ngữ cảnh thực tế 
                                    thông qua các bài đọc, video và tình huống đối thoại. Điều này giúp bạn hiểu cách 
                                    ngôn ngữ được sử dụng trong thực tế.
                                </p>
                                <div className="step-image">
                                    <img src="/images/step-context.jpg" alt="Học trong ngữ cảnh" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="step-card">
                            <div className="step-number">5</div>
                            <div className="step-content">
                                <h3>Phản hồi và điều chỉnh</h3>
                                <p>
                                    Hệ thống liên tục theo dõi tiến độ và điều chỉnh nội dung học tập dựa trên hiệu suất của bạn.
                                    Bạn nhận được báo cáo chi tiết về tiến bộ và lời khuyên cụ thể để cải thiện.
                                </p>
                                <div className="step-image">
                                    <img src="/images/step-feedback.jpg" alt="Phản hồi và điều chỉnh" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="technology-section">
                <div className="container">
                    <h2 className="section-title">Công nghệ đằng sau WordWise</h2>
                    <div className="tech-grid">
                        <div className="tech-card">
                            <div className="tech-icon">
                                <i className="fas fa-brain"></i>
                            </div>
                            <h3>Trí tuệ nhân tạo</h3>
                            <p>
                                Các thuật toán học máy phân tích hàng triệu điểm dữ liệu để hiểu cách bạn học và 
                                tạo ra lộ trình học tập tối ưu. AI của chúng tôi cũng đánh giá ngữ pháp, phát âm và 
                                cung cấp phản hồi chi tiết.
                            </p>
                        </div>
                        
                        <div className="tech-card">
                            <div className="tech-icon">
                                <i className="fas fa-hourglass-half"></i>
                            </div>
                            <h3>Spaced Repetition System</h3>
                            <p>
                                Hệ thống SRS tiên tiến tính toán chính xác thời điểm bạn sắp quên một từ hoặc khái niệm 
                                và nhắc bạn ôn tập đúng lúc, giúp tối ưu hóa quá trình ghi nhớ dài hạn.
                            </p>
                        </div>
                        
                        <div className="tech-card">
                            <div className="tech-icon">
                                <i className="fas fa-microphone"></i>
                            </div>
                            <h3>Nhận dạng giọng nói</h3>
                            <p>
                                Công nghệ xử lý giọng nói giúp bạn luyện phát âm chính xác và tự tin nói chuyện 
                                bằng ngôn ngữ mới. Hệ thống phân tích từng âm tiết và cung cấp hướng dẫn cách cải thiện.
                            </p>
                        </div>
                        
                        <div className="tech-card">
                            <div className="tech-icon">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <h3>Phân tích học tập</h3>
                            <p>
                                Dashboard phân tích chi tiết giúp bạn theo dõi tiến bộ, xác định điểm mạnh và điểm yếu, 
                                đồng thời cung cấp các chiến lược cụ thể để cải thiện hiệu quả học tập.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Tính năng nổi bật</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-image">
                                <img src="/images/feature-flashcards.jpg" alt="Thẻ ghi nhớ thông minh" />
                            </div>
                            <h3>Thẻ ghi nhớ thông minh</h3>
                            <p>
                                Tạo và học các bộ thẻ ghi nhớ được cá nhân hóa với công nghệ SRS giúp bạn nhớ lâu hơn
                                với thời gian học ít hơn.
                            </p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-image">
                                <img src="/images/feature-writing.jpg" alt="Luyện viết có phản hồi" />
                            </div>
                            <h3>Luyện viết có phản hồi</h3>
                            <p>
                                Nhận phản hồi chi tiết về bài viết của bạn từ AI, bao gồm gợi ý ngữ pháp, từ vựng
                                và cấu trúc văn bản.
                            </p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-image">
                                <img src="/images/feature-reading.jpg" alt="Đọc thông minh" />
                            </div>
                            <h3>Đọc thông minh</h3>
                            <p>
                                Đọc các bài viết phù hợp với trình độ của bạn, với tính năng tra từ nhanh, ghi chú và
                                lưu từ vựng mới vào thẻ ghi nhớ.
                            </p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-image">
                                <img src="/images/feature-speaking.jpg" alt="Luyện nói tương tác" />
                            </div>
                            <h3>Luyện nói tương tác</h3>
                            <p>
                                Thực hành đối thoại với AI và nhận phản hồi về phát âm, ngữ điệu và độ lưu loát
                                của bạn trong thời gian thực.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="education-science">
                <div className="container">
                    <h2 className="section-title">Khoa học giáo dục</h2>
                    <div className="science-content">
                        <div className="science-text">
                            <p>
                                WordWise được xây dựng dựa trên các nghiên cứu khoa học về cách não bộ học ngôn ngữ hiệu quả nhất.
                                Chúng tôi kết hợp các phương pháp đã được chứng minh là hiệu quả:
                            </p>
                            <ul className="science-list">
                                <li>
                                    <strong>Spaced Repetition:</strong> Ôn tập theo khoảng thời gian tối ưu để ghi nhớ lâu dài
                                </li>
                                <li>
                                    <strong>Active Recall:</strong> Chủ động nhớ lại thông tin thay vì chỉ đọc lại
                                </li>
                                <li>
                                    <strong>Comprehensible Input:</strong> Học thông qua nội dung bạn có thể hiểu được phần lớn
                                </li>
                                <li>
                                    <strong>Contextual Learning:</strong> Học từ vựng và ngữ pháp trong bối cảnh thực tế
                                </li>
                                <li>
                                    <strong>Gamification:</strong> Sử dụng các yếu tố trò chơi để tăng động lực học tập
                                </li>
                            </ul>
                            <p>
                                Mỗi tính năng trên nền tảng của chúng tôi đều được thiết kế dựa trên các nguyên tắc khoa học 
                                này để đảm bảo bạn học hiệu quả và thú vị nhất có thể.
                            </p>
                        </div>
                        <div className="science-image">
                            <img src="/images/education-science.jpg" alt="Khoa học giáo dục" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-cta">
                <div className="container">
                    <div className="cta-content">
                        <h2>Sẵn sàng trải nghiệm cách học mới?</h2>
                        <p>
                            Khám phá WordWise ngay hôm nay và trải nghiệm cách học ngôn ngữ hiệu quả, thú vị và 
                            được cá nhân hóa hoàn toàn.
                        </p>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn btn-primary">
                                Bắt đầu miễn phí
                            </Link>
                            <Link to="/testimonials" className="btn btn-secondary">
                                Xem đánh giá từ người học
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HowItWorksPage; 