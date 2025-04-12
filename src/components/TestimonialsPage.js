import React from 'react';
import { Link } from 'react-router-dom';
import '../css/components/About.css'; // Sử dụng chung CSS với AboutPage

function TestimonialsPage() {
    return (
        <div className="about-container">
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1 className="about-title">Đánh giá từ người học</h1>
                    <p className="about-subtitle">
                        Khám phá cách WordWise đã giúp cộng đồng người học trên toàn thế giới
                    </p>
                </div>
            </section>

            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">5M+</div>
                            <div className="stat-label">Người học</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">4.8/5</div>
                            <div className="stat-label">Đánh giá trung bình</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">92%</div>
                            <div className="stat-label">Đạt mục tiêu học tập</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">120+</div>
                            <div className="stat-label">Quốc gia</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="featured-testimonials">
                <div className="container">
                    <h2 className="section-title">Người học nói gì về chúng tôi</h2>
                    <div className="featured-grid">
                        <div className="featured-testimonial">
                            <div className="testimonial-image">
                                <img src="/images/testimonial-featured-1.jpg" alt="Nguyễn Thị Minh" />
                            </div>
                            <div className="testimonial-content">
                                <div className="testimonial-quote">
                                    <i className="fas fa-quote-left"></i>
                                    <p>
                                        WordWise đã hoàn toàn thay đổi cách tôi học tiếng Nhật. Sau 6 tháng sử dụng nền tảng này, 
                                        tôi có thể giao tiếp tự tin khi đi du lịch Nhật Bản. Các bài học được cá nhân hóa giúp tôi 
                                        tiến bộ nhanh hơn nhiều so với các khóa học truyền thống trước đây.
                                    </p>
                                </div>
                                <div className="testimonial-author">
                                    <h3>Nguyễn Thị Minh</h3>
                                    <p>Kỹ sư phần mềm, Học tiếng Nhật</p>
                                    <div className="rating">
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="featured-testimonial">
                            <div className="testimonial-content">
                                <div className="testimonial-quote">
                                    <i className="fas fa-quote-left"></i>
                                    <p>
                                        Là một giáo viên ngôn ngữ, tôi đã giới thiệu WordWise cho tất cả học sinh của mình. 
                                        Các thuật toán học tập thông minh thực sự hiệu quả! Học sinh của tôi đạt được tiến bộ 
                                        vượt bậc khi kết hợp lớp học truyền thống với ứng dụng này. Đặc biệt, tính năng phân tích 
                                        lỗi phát âm giúp họ cải thiện rõ rệt.
                                    </p>
                                </div>
                                <div className="testimonial-author">
                                    <h3>Trần Văn Huy</h3>
                                    <p>Giáo viên tiếng Anh, Trường THPT Chu Văn An</p>
                                    <div className="rating">
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial-image">
                                <img src="/images/testimonial-featured-2.jpg" alt="Trần Văn Huy" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="video-testimonial">
                <div className="container">
                    <h2 className="section-title">Câu chuyện nổi bật</h2>
                    <div className="video-container">
                        <div className="video-wrapper">
                            <img src="/images/video-testimonial-thumbnail.jpg" alt="Video đánh giá" />
                            <div className="play-button">
                                <i className="fas fa-play"></i>
                            </div>
                        </div>
                        <div className="video-text">
                            <h3>Từ mất gốc đến thành thạo trong 1 năm</h3>
                            <p>
                                Lê Thành đã sử dụng WordWise để học tiếng Đức từ con số 0 và đạt trình độ B2 chỉ sau 
                                1 năm. Câu chuyện của anh ấy là minh chứng cho hiệu quả của phương pháp học tập 
                                được cá nhân hóa trên nền tảng của chúng tôi.
                            </p>
                            <a href="#" className="btn btn-secondary">Xem video đầy đủ</a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="testimonials-grid-section">
                <div className="container">
                    <h2 className="section-title">Đánh giá từ cộng đồng</h2>
                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="testimonial-header">
                                <img src="/images/testimonial-user-1.jpg" alt="Phạm Hồng Ngọc" />
                                <div>
                                    <h3>Phạm Hồng Ngọc</h3>
                                    <p>Sinh viên đại học</p>
                                </div>
                            </div>
                            <div className="rating">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star-half-alt"></i>
                            </div>
                            <p className="testimonial-text">
                                WordWise là người bạn đồng hành hoàn hảo cho việc học tiếng Anh của tôi. Tính năng luyện viết 
                                với phản hồi AI đã giúp tôi cải thiện kỹ năng viết luận rất nhiều. Tôi đã đạt 7.5 IELTS sau 
                                6 tháng học tập!
                            </p>
                        </div>

                        <div className="testimonial-card">
                            <div className="testimonial-header">
                                <img src="/images/testimonial-user-2.jpg" alt="Lê Minh Đức" />
                                <div>
                                    <h3>Lê Minh Đức</h3>
                                    <p>Doanh nhân</p>
                                </div>
                            </div>
                            <div className="rating">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                            </div>
                            <p className="testimonial-text">
                                Công việc bận rộn khiến tôi khó sắp xếp thời gian học tiếng Hàn. WordWise giúp tôi học mọi lúc mọi nơi, 
                                chỉ với 15-20 phút mỗi ngày. Các bài học ngắn nhưng hiệu quả, phù hợp với lịch trình bận rộn của tôi.
                            </p>
                        </div>

                        <div className="testimonial-card">
                            <div className="testimonial-header">
                                <img src="/images/testimonial-user-3.jpg" alt="Võ Thanh Hà" />
                                <div>
                                    <h3>Võ Thanh Hà</h3>
                                    <p>Giáo viên tiểu học</p>
                                </div>
                            </div>
                            <div className="rating">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                            </div>
                            <p className="testimonial-text">
                                Tôi đã thử nhiều ứng dụng học ngôn ngữ, nhưng WordWise vượt trội nhờ cách tiếp cận toàn diện. 
                                Không chỉ học từ vựng, bạn còn phát triển tất cả các kỹ năng ngôn ngữ. Sau 3 tháng, tôi có thể 
                                đọc truyện tiếng Pháp đơn giản!
                            </p>
                        </div>

                        <div className="testimonial-card">
                            <div className="testimonial-header">
                                <img src="/images/testimonial-user-4.jpg" alt="Nguyễn Hoàng Nam" />
                                <div>
                                    <h3>Nguyễn Hoàng Nam</h3>
                                    <p>Kỹ sư cơ khí</p>
                                </div>
                            </div>
                            <div className="rating">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                            </div>
                            <p className="testimonial-text">
                                Hệ thống flashcard thông minh là điểm mạnh nhất của WordWise. Tôi không cần phải nhớ khi nào ôn tập từ nào, 
                                hệ thống tự động nhắc tôi đúng lúc. Từ vựng tiếng Đức của tôi tăng lên đáng kể chỉ sau vài tuần.
                            </p>
                        </div>

                        <div className="testimonial-card">
                            <div className="testimonial-header">
                                <img src="/images/testimonial-user-5.jpg" alt="Trần Thanh Mai" />
                                <div>
                                    <h3>Trần Thanh Mai</h3>
                                    <p>Y tá</p>
                                </div>
                            </div>
                            <div className="rating">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="far fa-star"></i>
                            </div>
                            <p className="testimonial-text">
                                WordWise giúp tôi tự tin giao tiếp tiếng Anh với bệnh nhân quốc tế. Các tình huống đối thoại trong ứng dụng 
                                rất thực tế và liên quan đến ngành y. Tôi đặc biệt thích tính năng phát âm với phản hồi chi tiết.
                            </p>
                        </div>

                        <div className="testimonial-card">
                            <div className="testimonial-header">
                                <img src="/images/testimonial-user-6.jpg" alt="Lê Hoàng Anh" />
                                <div>
                                    <h3>Lê Hoàng Anh</h3>
                                    <p>Học sinh THPT</p>
                                </div>
                            </div>
                            <div className="rating">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star-half-alt"></i>
                            </div>
                            <p className="testimonial-text">
                                WordWise khiến việc học tiếng Anh trở nên thú vị như chơi game. Hệ thống phần thưởng và thử thách 
                                hàng ngày giúp tôi duy trì động lực. Điểm số môn tiếng Anh của tôi đã tăng từ 7 lên 9 sau một học kỳ!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="success-stories">
                <div className="container">
                    <h2 className="section-title">Câu chuyện thành công</h2>
                    <div className="stories-slider">
                        <div className="story-card">
                            <div className="story-image">
                                <img src="/images/success-story-1.jpg" alt="Nguyễn Văn Tuấn" />
                            </div>
                            <div className="story-content">
                                <h3>Từ sợ nói tiếng Anh đến phỏng vấn thành công tại công ty đa quốc gia</h3>
                                <p>
                                    Nguyễn Văn Tuấn - 28 tuổi, Kỹ sư phần mềm
                                </p>
                                <p>
                                    "Tôi luôn cảm thấy lo lắng khi phải nói tiếng Anh trong các cuộc họp. Sau 6 tháng sử dụng 
                                    WordWise, tôi đã tự tin thuyết trình bằng tiếng Anh và thành công phỏng vấn vào vị trí 
                                    mơ ước tại một công ty công nghệ hàng đầu."
                                </p>
                                <Link to="/success-stories/nguyen-van-tuan" className="read-more">Đọc tiếp <i className="fas fa-arrow-right"></i></Link>
                            </div>
                        </div>

                        <div className="story-card">
                            <div className="story-image">
                                <img src="/images/success-story-2.jpg" alt="Phạm Thị Hương" />
                            </div>
                            <div className="story-content">
                                <h3>Du học Đức thành công nhờ luyện tập mỗi ngày</h3>
                                <p>
                                    Phạm Thị Hương - 23 tuổi, Sinh viên
                                </p>
                                <p>
                                    "Tôi chỉ có 8 tháng để chuẩn bị cho kỳ thi tiếng Đức B2 trước khi nộp hồ sơ du học. 
                                    Nhờ WordWise và sự kiên trì học tập mỗi ngày, tôi đã đạt 87/100 điểm và nhận được học bổng 
                                    toàn phần tại trường đại học mơ ước ở Berlin."
                                </p>
                                <Link to="/success-stories/pham-thi-huong" className="read-more">Đọc tiếp <i className="fas fa-arrow-right"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="review-platforms">
                <div className="container">
                    <h2 className="section-title">Được công nhận rộng rãi</h2>
                    <div className="platforms-grid">
                        <div className="platform-card">
                            <img src="/images/app-store-logo.png" alt="App Store" />
                            <div className="platform-rating">
                                <div className="stars">
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star-half-alt"></i>
                                </div>
                                <p>4.8/5 (10,245 đánh giá)</p>
                            </div>
                        </div>
                        
                        <div className="platform-card">
                            <img src="/images/google-play-logo.png" alt="Google Play" />
                            <div className="platform-rating">
                                <div className="stars">
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                </div>
                                <p>4.9/5 (15,782 đánh giá)</p>
                            </div>
                        </div>
                        
                        <div className="platform-card">
                            <img src="/images/trustpilot-logo.png" alt="Trustpilot" />
                            <div className="platform-rating">
                                <div className="stars">
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star-half-alt"></i>
                                </div>
                                <p>4.7/5 (3,567 đánh giá)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="submit-testimonial">
                <div className="container">
                    <div className="submit-content">
                        <h2>Chia sẻ câu chuyện của bạn</h2>
                        <p>
                            Bạn đã có trải nghiệm tuyệt vời với WordWise? Chúng tôi rất muốn lắng nghe câu chuyện của bạn!
                            Chia sẻ cách WordWise đã giúp bạn trên hành trình học ngôn ngữ.
                        </p>
                        <Link to="/submit-testimonial" className="btn btn-primary">
                            Gửi đánh giá
                        </Link>
                    </div>
                </div>
            </section>

            <section className="about-cta">
                <div className="container">
                    <div className="cta-content">
                        <h2>Sẵn sàng bắt đầu hành trình của riêng bạn?</h2>
                        <p>
                            Tham gia cùng hàng triệu người đã cải thiện kỹ năng ngôn ngữ với WordWise.
                            Đăng ký miễn phí và trải nghiệm sự khác biệt ngay hôm nay.
                        </p>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn btn-primary">
                                Đăng ký miễn phí
                            </Link>
                            <Link to="/how-it-works" className="btn btn-secondary">
                                Tìm hiểu thêm
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default TestimonialsPage; 