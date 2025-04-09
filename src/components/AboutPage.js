import React from 'react';
import { Link } from 'react-router-dom';
import '../css/components/About.css';

function AboutPage() {
    return (
        <div className="about-container">
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1 className="about-title">Về WordWise</h1>
                    <p className="about-subtitle">
                        Nền tảng học ngôn ngữ thông minh được thiết kế để giúp mọi người học hiệu quả
                    </p>
                </div>
            </section>

            <section className="about-mission">
                <div className="container">
                    <div className="mission-content">
                        <div className="mission-text">
                            <h2>Sứ mệnh của chúng tôi</h2>
                            <p>
                                WordWise ra đời với sứ mệnh đơn giản nhưng đầy tham vọng: Biến việc học ngôn ngữ trở thành 
                                trải nghiệm hiệu quả, thú vị và dễ tiếp cận cho tất cả mọi người. Chúng tôi tin rằng ngôn ngữ 
                                không chỉ là công cụ giao tiếp mà còn là cầu nối văn hóa, mở ra cơ hội và kết nối con người.
                            </p>
                            <p>
                                Với đội ngũ chuyên gia ngôn ngữ và công nghệ hàng đầu, chúng tôi không ngừng phát triển 
                                những phương pháp học tập hiện đại dựa trên nghiên cứu khoa học về trí nhớ và quá trình 
                                tiếp thu ngôn ngữ.
                            </p>
                        </div>
                        <div className="mission-image">
                            <img src="/images/about-mission.jpg" alt="Sứ mệnh WordWise" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-benefits">
                <div className="container">
                    <h2 className="section-title">Quyền lợi khi học tại WordWise</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-brain"></i>
                            </div>
                            <h3>Học thông minh với AI</h3>
                            <p>
                                Hệ thống AI của chúng tôi phân tích cách học và mức độ tiến bộ của bạn, 
                                tạo ra lộ trình học tập cá nhân hóa giúp bạn tiến bộ nhanh hơn 3 lần so với 
                                phương pháp truyền thống.
                            </p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <h3>Theo dõi tiến độ chi tiết</h3>
                            <p>
                                Biểu đồ phân tích trực quan giúp bạn dễ dàng theo dõi tiến bộ trong từng kỹ năng,
                                từ vựng và ngữ pháp, đồng thời gợi ý những phần cần ôn tập.
                            </p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-lightbulb"></i>
                            </div>
                            <h3>Phương pháp khoa học</h3>
                            <p>
                                Áp dụng kỹ thuật spaced repetition và active recall - hai phương pháp đã được 
                                chứng minh hiệu quả nhất trong việc ghi nhớ lâu dài và hiểu sâu.
                            </p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-medal"></i>
                            </div>
                            <h3>Hệ thống động lực</h3>
                            <p>
                                Gamification thông minh với huy hiệu, bảng xếp hạng và thử thách hàng ngày giúp 
                                duy trì động lực học tập lâu dài.
                            </p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <h3>Cộng đồng học tập</h3>
                            <p>
                                Kết nối với cộng đồng người học toàn cầu, chia sẻ tài nguyên và động viên 
                                lẫn nhau trên hành trình chinh phục ngôn ngữ mới.
                            </p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-globe"></i>
                            </div>
                            <h3>Đa dạng ngôn ngữ</h3>
                            <p>
                                Hỗ trợ hơn 15 ngôn ngữ phổ biến nhất thế giới với nội dung được biên soạn 
                                bởi người bản xứ, đảm bảo tính chính xác và thực tế.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-accessibility">
                <div className="container">
                    <h2 className="section-title">Khả năng tiếp cận</h2>
                    <div className="accessibility-content">
                        <div className="accessibility-image">
                            <img src="/images/accessibility.jpg" alt="Khả năng tiếp cận" />
                        </div>
                        <div className="accessibility-text">
                            <p>
                                Tại WordWise, chúng tôi tin rằng giáo dục ngôn ngữ nên tiếp cận được với tất cả 
                                mọi người, bất kể khả năng, vị trí địa lý hay hoàn cảnh kinh tế.
                            </p>
                            <h3>Thiết kế cho mọi người</h3>
                            <ul className="accessibility-list">
                                <li>
                                    <i className="fas fa-check"></i>
                                    Giao diện thân thiện với trình đọc màn hình và hỗ trợ điều hướng bàn phím
                                </li>
                                <li>
                                    <i className="fas fa-check"></i>
                                    Phụ đề và bản ghi cho tất cả nội dung âm thanh
                                </li>
                                <li>
                                    <i className="fas fa-check"></i>
                                    Tùy chỉnh font chữ, kích thước và độ tương phản màu sắc
                                </li>
                                <li>
                                    <i className="fas fa-check"></i>
                                    Hoạt động trên mọi thiết bị, từ máy tính đến điện thoại di động
                                </li>
                                <li>
                                    <i className="fas fa-check"></i>
                                    Tính năng học offline cho khu vực có kết nối internet hạn chế
                                </li>
                            </ul>
                            <h3>Tiếp cận về mặt tài chính</h3>
                            <p>
                                Mô hình freemium cho phép tất cả người dùng truy cập các tính năng cơ bản miễn phí. 
                                Chúng tôi cũng cung cấp học bổng và giảm giá đặc biệt cho học sinh, sinh viên, 
                                giáo viên và người dùng từ các quốc gia đang phát triển.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-testimonials">
                <div className="container">
                    <h2 className="section-title">Người dùng nói gì về chúng tôi</h2>
                    <div className="testimonials-container">
                        <div className="testimonial">
                            <div className="testimonial-content">
                                <p>
                                    "WordWise đã giúp tôi chinh phục tiếng Anh sau nhiều năm thất bại với các phương pháp khác. 
                                    Cách tiếp cận cá nhân hóa và hệ thống nhắc nhở thông minh là chìa khóa giúp tôi duy trì việc học mỗi ngày."
                                </p>
                            </div>
                            <div className="testimonial-author">
                                <img src="/images/testimonial-1.jpg" alt="Nguyễn Văn A" />
                                <div className="author-info">
                                    <h4>Nguyễn Văn A</h4>
                                    <p>Kỹ sư phần mềm, Đã học 267 ngày liên tục</p>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial">
                            <div className="testimonial-content">
                                <p>
                                    "Là một người học ngôn ngữ bị khiếm thính, tôi rất ấn tượng với các tính năng tiếp cận của WordWise. 
                                    Hỗ trợ trực quan và phương pháp học không phụ thuộc hoàn toàn vào âm thanh giúp tôi học hiệu quả."
                                </p>
                            </div>
                            <div className="testimonial-author">
                                <img src="/images/testimonial-2.jpg" alt="Trần Thị B" />
                                <div className="author-info">
                                    <h4>Trần Thị B</h4>
                                    <p>Sinh viên đại học, Thành thạo 2 ngôn ngữ</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-cta">
                <div className="container">
                    <div className="cta-content">
                        <h2>Bắt đầu hành trình ngôn ngữ của bạn ngay hôm nay</h2>
                        <p>
                            Tham gia cùng hơn 5 triệu người học trên toàn thế giới và khám phá cách 
                            WordWise có thể giúp bạn chinh phục ngôn ngữ mới một cách hiệu quả.
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

export default AboutPage; 