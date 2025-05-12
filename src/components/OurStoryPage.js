import React from 'react';
import { Link } from 'react-router-dom';
import '../css/components/About.css'; // Sử dụng chung CSS với AboutPage
import { useAuth } from '../contexts/AuthContext';
import Dai from '../assets/PDai.jpg'
import Dat from '../assets/TDat.jpg'
import Tai from '../assets/VTai.jpg'

function OurStoryPage() {
    const { isAuthenticated } = useAuth();
    
    return (
        <div className="about-container">
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1 className="about-title">Câu chuyện của chúng tôi</h1>
                    <p className="about-subtitle">
                        Hành trình từ ý tưởng đến nền tảng học ngôn ngữ hàng đầu
                    </p>
                </div>
            </section>

            <section className="about-mission">
                <div className="container">
                    <div className="mission-content">
                        <div className="mission-text">
                            <h2>Khởi đầu</h2>
                            <p>
                                WordWise bắt đầu vào năm 2024, khi nhóm sáng lập của chúng tôi - những người đam mê công nghệ 
                                và ngôn ngữ - nhận ra vấn đề cốt lõi trong việc học ngoại ngữ hiện đại: thiếu sự cá nhân hóa 
                                và phương pháp khoa học.
                            </p>
                            <p>
                                Sau nhiều năm nghiên cứu và phát triển, chúng tôi đã xây dựng nền tảng WordWise với phương châm 
                                đơn giản: Kết hợp trí tuệ nhân tạo với phương pháp học tập hiệu quả nhất để tạo ra trải nghiệm 
                                học ngôn ngữ tối ưu cho mỗi cá nhân.
                            </p>
                        </div>
                        <div className="mission-image">
                            <img src="/images/our-story-beginning.jpg" alt="Khởi đầu của WordWise" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="story-timeline">
                <div className="container">
                    <h2 className="section-title">Hành trình phát triển</h2>
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-date">Tháng 1, 2024</div>
                            <div className="timeline-content">
                                <h3>Những bước đi đầu tiên</h3>
                                <p>
                                    Ý tưởng về WordWise được hình thành và đội ngũ sáng lập bắt đầu nghiên cứu 
                                    các phương pháp học ngôn ngữ hiệu quả nhất. Phiên bản beta đầu tiên được phát triển 
                                    với chỉ 2 ngôn ngữ: Anh và Việt.
                                </p>
                            </div>
                        </div>
                        
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-date">Tháng 2, 2024</div>
                            <div className="timeline-content">
                                <h3>Nhận vốn đầu tư và mở rộng</h3>
                                <p>
                                    WordWise nhận được vòng đầu tư hạt giống $1.2 triệu từ các nhà đầu tư thiên thần 
                                    và quỹ đầu tư mạo hiểm. Đội ngũ mở rộng lên 15 thành viên và thêm 5 ngôn ngữ mới 
                                    vào nền tảng.
                                </p>
                            </div>
                        </div>
                        
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-date"> Tháng 3, 2024</div>
                            <div className="timeline-content">
                                <h3>Cải tiến AI và tích hợp công nghệ</h3>
                                <p>
                                    Ra mắt hệ thống AI phân tích nhận dạng giọng nói và đánh giá phát âm. 
                                    Cộng đồng người dùng vượt mốc 1 triệu và tỷ lệ giữ chân người dùng đạt 78%.
                                </p>
                            </div>
                        </div>
                        
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-date">Tháng 8, 2024</div>
                            <div className="timeline-content">
                                <h3>Toàn cầu hóa và hợp tác</h3>
                                <p>
                                    WordWise bắt đầu hợp tác với các trường đại học và tổ chức giáo dục, 
                                    mở rộng sang thị trường châu Âu và châu Á. Số lượng ngôn ngữ được hỗ trợ 
                                    tăng lên 15 với nội dung được biên soạn bởi người bản xứ.
                                </p>
                            </div>
                        </div>
                        
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-date">2025</div>
                            <div className="timeline-content">
                                <h3>Hiện tại và tương lai</h3>
                                <p>
                                    Hiện nay, WordWise phục vụ hơn 5 triệu người dùng trên toàn thế giới với 
                                    đội ngũ 50 nhân viên tại 5 quốc gia. Chúng tôi tiếp tục sứ mệnh tạo ra nền tảng 
                                    học ngôn ngữ tốt nhất, kết hợp công nghệ tiên tiến với các phương pháp học tập 
                                    dựa trên nghiên cứu khoa học.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="founders-section mt-5">
                <div className="container">
                    <h2 className="section-title">Đội ngũ sáng lập</h2>
                    <div className="founders-grid">
                        <div className="founder-card">
                            <div className="founder-image">
                                <img src={Dai} alt="Nguyễn Phúc Đại" />
                            </div>
                            <h3>Nguyễn Phúc Đại</h3>
                            <p className="founder-title">Đồng sáng lập & CEO</p>
                            <p className="founder-bio">
                                Với nền tảng về Khoa học Máy tính từ Đại học Stanford và 10 năm kinh nghiệm 
                                tại các công ty công nghệ hàng đầu, Đại đã dẫn dắt WordWise từ ý tưởng ban đầu 
                                đến nền tảng toàn cầu.
                            </p>
                        </div>
                        
                        <div className="founder-card">
                            <div className="founder-image">
                                <img src={Tai} alt="Trần Văn Tài" />
                            </div>
                            <h3>Trần Văn Tài</h3>
                            <p className="founder-title">Đồng sáng lập & CTO</p>
                            <p className="founder-bio">
                                Tiến sĩ Ngôn ngữ học Ứng dụng với chuyên môn về học máy và xử lý ngôn ngữ tự nhiên. 
                                Tài là người đứng sau các thuật toán học tập cá nhân hóa của WordWise.
                            </p>
                        </div>
                        
                        <div className="founder-card">
                            <div className="founder-image">
                                <img src={Dat} alt="Nguyễn Cao Thành Đạt" />
                            </div>
                            <h3>Nguyễn Cao Thành Đạt</h3>
                            <p className="founder-title">Đồng sáng lập & CPO</p>
                            <p className="founder-bio">
                                Với hơn 15 năm kinh nghiệm trong thiết kế UX/UI và phát triển sản phẩm, 
                                Đạt chịu trách nhiệm đảm bảo WordWise không chỉ hiệu quả mà còn thú vị 
                                và dễ sử dụng cho người dùng toàn cầu.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="values-section">
                <div className="container">
                    <h2 className="section-title">Giá trị cốt lõi</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">
                                <i className="fas fa-star"></i>
                            </div>
                            <h3>Chất lượng</h3>
                            <p>
                                Chúng tôi cam kết cung cấp nội dung học tập chất lượng cao, được nghiên cứu kỹ lưỡng 
                                và liên tục cập nhật. Mọi tính năng đều được kiểm thử cẩn thận trước khi ra mắt.
                            </p>
                        </div>
                        
                        <div className="value-card">
                            <div className="value-icon">
                                <i className="fas fa-user-friends"></i>
                            </div>
                            <h3>Cá nhân hóa</h3>
                            <p>
                                Mỗi người học là duy nhất. Hệ thống của chúng tôi tôn trọng và thích ứng với 
                                cách học, tốc độ và sở thích của từng cá nhân.
                            </p>
                        </div>
                        
                        <div className="value-card">
                            <div className="value-icon">
                                <i className="fas fa-universal-access"></i>
                            </div>
                            <h3>Khả năng tiếp cận</h3>
                            <p>
                                Chúng tôi tin rằng việc học ngôn ngữ nên dành cho tất cả mọi người. 
                                WordWise được thiết kế để dễ sử dụng bất kể nền tảng, khả năng hay hoàn cảnh.
                            </p>
                        </div>
                        
                        <div className="value-card">
                            <div className="value-icon">
                                <i className="fas fa-flask"></i>
                            </div>
                            <h3>Đổi mới</h3>
                            <p>
                                Chúng tôi không ngừng thử nghiệm, nghiên cứu và phát triển để tạo ra 
                                những trải nghiệm học tập tốt hơn. Sự đổi mới là một phần DNA của chúng tôi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-cta">
                <div className="container">
                    <div className="cta-content">
                        <h2>Trở thành một phần trong câu chuyện của chúng tôi</h2>
                        <p>
                            Câu chuyện của WordWise vẫn đang tiếp tục được viết mỗi ngày với sự đóng góp 
                            của từng người dùng. Chúng tôi mời bạn tham gia cộng đồng và cùng xây dựng tương lai 
                            của việc học ngôn ngữ.
                        </p>
                        <div className="cta-buttons">
                            {!isAuthenticated && (
                                <Link to="/register" className="btn btn-primary">
                                    Đăng ký miễn phí
                                </Link>
                            )}
                            <Link to="/contact" className="btn btn-secondary">
                                Liên hệ với chúng tôi
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default OurStoryPage; 