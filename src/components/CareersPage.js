import React from 'react';
import { Link } from 'react-router-dom';
import '../css/components/About.css'; // Sử dụng chung CSS với AboutPage

function CareersPage() {
    return (
        <div className="about-container">
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1 className="about-title">Cơ hội nghề nghiệp</h1>
                    <p className="about-subtitle">
                        Tham gia đội ngũ thay đổi cách thế giới học ngôn ngữ
                    </p>
                </div>
            </section>

            <section className="careers-intro">
                <div className="container">
                    <div className="intro-content">
                        <div className="intro-text">
                            <h2>Làm việc tại WordWise</h2>
                            <p>
                                Tại WordWise, chúng tôi tin vào sức mạnh của ngôn ngữ để kết nối con người. Đội ngũ của 
                                chúng tôi bao gồm những người đam mê về công nghệ, giáo dục và ngôn ngữ, tất cả đều hướng 
                                tới mục tiêu chung: tạo ra nền tảng học ngôn ngữ tốt nhất trên thế giới.
                            </p>
                            <p>
                                Chúng tôi đang tìm kiếm những người tài năng, sáng tạo và luôn khao khát học hỏi để 
                                cùng xây dựng tương lai của việc học ngôn ngữ. Dù bạn là nhà phát triển phần mềm, 
                                chuyên gia ngôn ngữ học, nhà thiết kế trải nghiệm người dùng hay chuyên gia tiếp thị, 
                                nếu bạn muốn tạo ra tác động tích cực đến hàng triệu người học, chúng tôi muốn gặp bạn.
                            </p>
                        </div>
                        <div className="intro-image">
                            <img src="/images/careers-team.jpg" alt="Đội ngũ WordWise" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="careers-benefits">
                <div className="container">
                    <h2 className="section-title">Vì sao làm việc với chúng tôi</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-globe"></i>
                            </div>
                            <h3>Tác động toàn cầu</h3>
                            <p>
                                Công việc của bạn sẽ giúp hàng triệu người trên toàn thế giới học ngôn ngữ và
                                mở ra cơ hội mới trong cuộc sống của họ.
                            </p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-laptop"></i>
                            </div>
                            <h3>Làm việc linh hoạt</h3>
                            <p>
                                Chúng tôi cung cấp các lựa chọn làm việc từ xa và tại văn phòng, cho phép bạn 
                                cân bằng công việc và cuộc sống cá nhân một cách hiệu quả.
                            </p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <h3>Phát triển sự nghiệp</h3>
                            <p>
                                Chúng tôi đầu tư vào sự phát triển của nhân viên thông qua đào tạo, hội thảo,
                                và cơ hội học tập liên tục.
                            </p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-brain"></i>
                            </div>
                            <h3>Công nghệ tiên tiến</h3>
                            <p>
                                Làm việc với AI, học máy và các công nghệ hàng đầu khác để giải quyết những
                                thách thức phức tạp trong lĩnh vực giáo dục ngôn ngữ.
                            </p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <h3>Văn hóa hòa nhập</h3>
                            <p>
                                Chúng tôi tôn trọng và đề cao sự đa dạng. Đội ngũ đa quốc gia của chúng tôi 
                                là minh chứng cho cam kết về một môi trường làm việc hòa nhập.
                            </p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-heart"></i>
                            </div>
                            <h3>Phúc lợi toàn diện</h3>
                            <p>
                                Chúng tôi cung cấp phúc lợi cạnh tranh, bao gồm bảo hiểm sức khỏe, chương trình
                                cổ phiếu, và nhiều đãi ngộ khác để đảm bảo sự hài lòng của nhân viên.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="company-culture">
                <div className="container">
                    <h2 className="section-title">Văn hóa công ty</h2>
                    <div className="culture-content">
                        <div className="culture-images">
                            <div className="image-grid">
                                <img src="/images/culture-1.jpg" alt="Văn hóa WordWise" />
                                <img src="/images/culture-2.jpg" alt="Văn hóa WordWise" />
                                <img src="/images/culture-3.jpg" alt="Văn hóa WordWise" />
                                <img src="/images/culture-4.jpg" alt="Văn hóa WordWise" />
                            </div>
                        </div>
                        <div className="culture-text">
                            <p>
                                Văn hóa của chúng tôi dựa trên những giá trị cốt lõi: đổi mới, hợp tác, tôn trọng và 
                                đam mê. Chúng tôi tin rằng môi trường làm việc tốt nhất là nơi mọi người cảm thấy được 
                                trao quyền, được đánh giá cao và có thể nói lên ý kiến của mình.
                            </p>
                            <h3>Những giá trị chúng tôi đề cao:</h3>
                            <ul className="value-list">
                                <li><i className="fas fa-check"></i> <strong>Sáng tạo không giới hạn</strong> - Chúng tôi khuyến khích tư duy đột phá</li>
                                <li><i className="fas fa-check"></i> <strong>Học tập liên tục</strong> - Chúng tôi luôn phát triển và thích nghi</li>
                                <li><i className="fas fa-check"></i> <strong>Trách nhiệm cao</strong> - Chúng tôi làm chủ công việc và kết quả</li>
                                <li><i className="fas fa-check"></i> <strong>Làm việc nhóm</strong> - Chúng tôi đạt được nhiều hơn khi làm việc cùng nhau</li>
                                <li><i className="fas fa-check"></i> <strong>Cân bằng công việc-cuộc sống</strong> - Chúng tôi tôn trọng thời gian cá nhân</li>
                            </ul>
                            <p>
                                Chúng tôi tổ chức các sự kiện xây dựng đội ngũ, hackathon, workshop ngôn ngữ và nhiều 
                                hoạt động khác để tạo điều kiện cho sự gắn kết và phát triển liên tục.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="open-positions">
                <div className="container">
                    <h2 className="section-title">Vị trí đang tuyển dụng</h2>
                    
                    <div className="positions-filters">
                        <button className="filter-btn active">Tất cả</button>
                        <button className="filter-btn">Kỹ thuật</button>
                        <button className="filter-btn">Thiết kế</button>
                        <button className="filter-btn">Sản phẩm</button>
                        <button className="filter-btn">Tiếp thị</button>
                        <button className="filter-btn">Giáo dục</button>
                    </div>
                    
                    <div className="positions-list">
                        <div className="position-card">
                            <div className="position-content">
                                <h3>Senior Full-stack Developer</h3>
                                <div className="position-details">
                                    <span className="location"><i className="fas fa-map-marker-alt"></i> Hồ Chí Minh (Remote)</span>
                                    <span className="type"><i className="fas fa-clock"></i> Toàn thời gian</span>
                                    <span className="department"><i className="fas fa-laptop-code"></i> Kỹ thuật</span>
                                </div>
                                <p>
                                    Chúng tôi đang tìm kiếm một Senior Full-stack Developer để dẫn dắt việc phát triển 
                                    các tính năng mới và cải thiện hiệu suất của nền tảng WordWise. Người lý tưởng sẽ có 
                                    kinh nghiệm mạnh mẽ với React, Node.js và các công nghệ hiện đại khác.
                                </p>
                            </div>
                            <div className="position-action">
                                <Link to="/careers/senior-fullstack-developer" className="btn btn-primary">Xem chi tiết</Link>
                            </div>
                        </div>
                        
                        <div className="position-card">
                            <div className="position-content">
                                <h3>UX/UI Designer</h3>
                                <div className="position-details">
                                    <span className="location"><i className="fas fa-map-marker-alt"></i> Hà Nội</span>
                                    <span className="type"><i className="fas fa-clock"></i> Toàn thời gian</span>
                                    <span className="department"><i className="fas fa-paint-brush"></i> Thiết kế</span>
                                </div>
                                <p>
                                    Chúng tôi đang tìm kiếm một UX/UI Designer tài năng để nâng cao trải nghiệm người dùng 
                                    trên nền tảng của chúng tôi. Bạn sẽ làm việc chặt chẽ với đội ngũ sản phẩm và kỹ thuật 
                                    để tạo ra các thiết kế trực quan và thân thiện với người dùng.
                                </p>
                            </div>
                            <div className="position-action">
                                <Link to="/careers/ux-ui-designer" className="btn btn-primary">Xem chi tiết</Link>
                            </div>
                        </div>
                        
                        <div className="position-card">
                            <div className="position-content">
                                <h3>AI Engineer</h3>
                                <div className="position-details">
                                    <span className="location"><i className="fas fa-map-marker-alt"></i> Remote</span>
                                    <span className="type"><i className="fas fa-clock"></i> Toàn thời gian</span>
                                    <span className="department"><i className="fas fa-laptop-code"></i> Kỹ thuật</span>
                                </div>
                                <p>
                                    Chúng tôi đang tìm kiếm một AI Engineer để phát triển và cải thiện các thuật toán 
                                    học máy của chúng tôi. Bạn sẽ làm việc với các mô hình NLP để nâng cao khả năng 
                                    cá nhân hóa và hiệu quả của nền tảng học tập.
                                </p>
                            </div>
                            <div className="position-action">
                                <Link to="/careers/ai-engineer" className="btn btn-primary">Xem chi tiết</Link>
                            </div>
                        </div>
                        
                        <div className="position-card">
                            <div className="position-content">
                                <h3>Content Linguist (Tiếng Anh)</h3>
                                <div className="position-details">
                                    <span className="location"><i className="fas fa-map-marker-alt"></i> Hồ Chí Minh</span>
                                    <span className="type"><i className="fas fa-clock"></i> Bán thời gian</span>
                                    <span className="department"><i className="fas fa-book"></i> Giáo dục</span>
                                </div>
                                <p>
                                    Chúng tôi đang tìm kiếm một chuyên gia ngôn ngữ tiếng Anh để phát triển nội dung 
                                    học tập chất lượng cao. Bạn sẽ tạo ra các bài học, bài tập và tài liệu giảng dạy 
                                    phù hợp với các cấp độ và mục tiêu học tập khác nhau.
                                </p>
                            </div>
                            <div className="position-action">
                                <Link to="/careers/content-linguist-english" className="btn btn-primary">Xem chi tiết</Link>
                            </div>
                        </div>
                    </div>
                    
                    <div className="positions-cta">
                        <Link to="/careers/all-positions" className="btn btn-secondary">
                            Xem tất cả vị trí <i className="fas fa-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="application-process">
                <div className="container">
                    <h2 className="section-title">Quy trình ứng tuyển</h2>
                    <div className="process-steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Nộp đơn ứng tuyển</h3>
                                <p>
                                    Gửi CV và thư xin việc của bạn thông qua cổng tuyển dụng của chúng tôi. 
                                    Hãy chắc chắn rằng bạn nêu bật các kỹ năng và kinh nghiệm liên quan đến vị trí.
                                </p>
                            </div>
                        </div>
                        
                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Sàng lọc hồ sơ</h3>
                                <p>
                                    Đội ngũ tuyển dụng của chúng tôi sẽ xem xét đơn của bạn và liên hệ nếu 
                                    hồ sơ của bạn phù hợp với vị trí. Quá trình này thường mất 1-2 tuần.
                                </p>
                            </div>
                        </div>
                        
                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Phỏng vấn qua điện thoại</h3>
                                <p>
                                    Bước đầu tiên là cuộc phỏng vấn ngắn qua điện thoại hoặc video để tìm hiểu thêm 
                                    về bạn và trả lời bất kỳ câu hỏi nào bạn có về vị trí và công ty.
                                </p>
                            </div>
                        </div>
                        
                        <div className="step">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h3>Bài tập kỹ thuật (nếu có)</h3>
                                <p>
                                    Đối với các vị trí kỹ thuật, chúng tôi có thể yêu cầu bạn hoàn thành một bài tập 
                                    nhỏ để đánh giá kỹ năng của bạn. Chúng tôi tôn trọng thời gian của bạn và giữ 
                                    các bài tập ngắn gọn và thực tế.
                                </p>
                            </div>
                        </div>
                        
                        <div className="step">
                            <div className="step-number">5</div>
                            <div className="step-content">
                                <h3>Phỏng vấn chuyên sâu</h3>
                                <p>
                                    Các ứng viên tiềm năng sẽ được mời tham gia phỏng vấn sâu hơn với người quản lý 
                                    tuyển dụng và các thành viên trong nhóm. Chúng tôi sẽ đánh giá cả kỹ năng chuyên môn 
                                    và sự phù hợp với văn hóa công ty.
                                </p>
                            </div>
                        </div>
                        
                        <div className="step">
                            <div className="step-number">6</div>
                            <div className="step-content">
                                <h3>Đề nghị công việc</h3>
                                <p>
                                    Ứng viên thành công sẽ nhận được đề nghị việc làm. Chúng tôi cung cấp mức lương 
                                    cạnh tranh, phúc lợi hấp dẫn và môi trường làm việc linh hoạt.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="careers-faq">
                <div className="container">
                    <h2 className="section-title">Câu hỏi thường gặp</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h3>Quy trình tuyển dụng mất bao lâu?</h3>
                            <p>
                                Thông thường, quy trình tuyển dụng của chúng tôi mất từ 2-4 tuần, tùy thuộc vào vị trí 
                                và số lượng ứng viên.
                            </p>
                        </div>
                        
                        <div className="faq-item">
                            <h3>WordWise có chấp nhận làm việc từ xa không?</h3>
                            <p>
                                Có! Chúng tôi có các vị trí làm việc từ xa và tại văn phòng. Một số vị trí đòi hỏi sự 
                                hiện diện tại văn phòng ít nhất một phần thời gian, điều này sẽ được nêu rõ trong mô tả công việc.
                            </p>
                        </div>
                        
                        <div className="faq-item">
                            <h3>Tôi có cần biết nhiều ngôn ngữ để làm việc tại WordWise không?</h3>
                            <p>
                                Không nhất thiết. Trong khi chúng tôi đánh giá cao khả năng đa ngôn ngữ, nhiều vị trí chỉ 
                                yêu cầu thành thạo tiếng Anh. Yêu cầu ngôn ngữ cụ thể sẽ được nêu trong mô tả công việc.
                            </p>
                        </div>
                        
                        <div className="faq-item">
                            <h3>WordWise có chương trình thực tập không?</h3>
                            <p>
                                Có! Chúng tôi có chương trình thực tập cho sinh viên và người mới tốt nghiệp. Các cơ hội 
                                thực tập được đăng thường xuyên trên trang Careers của chúng tôi.
                            </p>
                        </div>
                        
                        <div className="faq-item">
                            <h3>Tôi có thể ứng tuyển nhiều vị trí cùng lúc không?</h3>
                            <p>
                                Có, bạn có thể ứng tuyển tối đa 3 vị trí cùng lúc. Tuy nhiên, chúng tôi khuyên bạn nên 
                                tập trung vào các vị trí phù hợp nhất với kỹ năng và kinh nghiệm của bạn.
                            </p>
                        </div>
                        
                        <div className="faq-item">
                            <h3>Các phúc lợi của nhân viên bao gồm những gì?</h3>
                            <p>
                                Chúng tôi cung cấp các phúc lợi cạnh tranh, bao gồm bảo hiểm sức khỏe, nghỉ phép có lương, 
                                chương trình lựa chọn cổ phiếu, trợ cấp học tập và môi trường làm việc linh hoạt.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-cta">
                <div className="container">
                    <div className="cta-content">
                        <h2>Sẵn sàng tạo ra tác động?</h2>
                        <p>
                            Khám phá cơ hội nghề nghiệp tại WordWise và trở thành một phần của đội ngũ
                            đang thay đổi cách thế giới học ngôn ngữ.
                        </p>
                        <div className="cta-buttons">
                            <Link to="/careers/all-positions" className="btn btn-primary">
                                Tìm vị trí phù hợp
                            </Link>
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

export default CareersPage; 