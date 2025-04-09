import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/components/UserProgress.css';

function UserProgressPage() {
    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Giả lập việc gọi API lấy dữ liệu
    useEffect(() => {
        // Giả định response từ API
        const apiResponse = {
            userId: "6b4e9a72-bd15-4033-bc95-b83d5d2882ac",
            currentStreak: 1,
            longestStreak: 1,
            totalLearningMinutes: 5.15,
            lastLearningDate: "2025-04-05T00:00:00",
            sessionStartTime: null,
            sessionEndTime: "2025-04-05T13:33:23.7931195",
            user: null
        };

        // Xử lý dữ liệu
        setTimeout(() => {
            setProgressData(apiResponse);
            setLoading(false);
        }, 1000); // Giả lập thời gian loading
    }, []);

    // Format thời gian học thành giờ:phút
    const formatLearningTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = Math.round((minutes - hours * 60) * 100) / 100;
        
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins} phút`;
    };

    // Format ngày học cuối cùng
    const formatLastLearningDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    return (
        <div className="main-content">
            <div className="user-progress-container">
                <div className="user-progress-header">
                    <h1 className="user-progress-title">Tiến Độ Học Tập</h1>
                    <p className="user-progress-subtitle">Theo dõi sự phát triển của bạn</p>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <div className="user-progress-content">
                        <div className="progress-stats-grid">
                            <div className="progress-stat-card current-streak">
                                <div className="stat-icon">
                                    <i className="fas fa-fire"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>Streak Hiện Tại</h3>
                                    <p className="stat-value">{progressData.currentStreak} ngày</p>
                                    <p className="stat-description">Giữ vững động lực học mỗi ngày!</p>
                                </div>
                            </div>

                            <div className="progress-stat-card longest-streak">
                                <div className="stat-icon">
                                    <i className="fas fa-trophy"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>Streak Dài Nhất</h3>
                                    <p className="stat-value">{progressData.longestStreak} ngày</p>
                                    <p className="stat-description">Kỷ lục của bạn cho đến nay!</p>
                                </div>
                            </div>

                            <div className="progress-stat-card learning-time">
                                <div className="stat-icon">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>Tổng Thời Gian Học</h3>
                                    <p className="stat-value">{formatLearningTime(progressData.totalLearningMinutes)}</p>
                                    <p className="stat-description">Thời gian đầu tư cho việc học của bạn</p>
                                </div>
                            </div>

                            <div className="progress-stat-card last-session">
                                <div className="stat-icon">
                                    <i className="fas fa-calendar-check"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>Buổi Học Gần Đây</h3>
                                    <p className="stat-value">{formatLastLearningDate(progressData.lastLearningDate)}</p>
                                    <p className="stat-description">Tiếp tục duy trì thói quen học tập!</p>
                                </div>
                            </div>
                        </div>

                        <div className="streak-calendar">
                            <h2 className="section-title">Lịch Học 7 Ngày Gần Đây</h2>
                            <div className="calendar-grid">
                                {/* Giả lập dữ liệu lịch học 7 ngày gần đây */}
                                <div className="calendar-day completed">
                                    <span className="day-label">CN</span>
                                    <div className="day-indicator"></div>
                                </div>
                                <div className="calendar-day">
                                    <span className="day-label">T2</span>
                                    <div className="day-indicator"></div>
                                </div>
                                <div className="calendar-day">
                                    <span className="day-label">T3</span>
                                    <div className="day-indicator"></div>
                                </div>
                                <div className="calendar-day">
                                    <span className="day-label">T4</span>
                                    <div className="day-indicator"></div>
                                </div>
                                <div className="calendar-day">
                                    <span className="day-label">T5</span>
                                    <div className="day-indicator"></div>
                                </div>
                                <div className="calendar-day">
                                    <span className="day-label">T6</span>
                                    <div className="day-indicator"></div>
                                </div>
                                <div className="calendar-day current">
                                    <span className="day-label">T7</span>
                                    <div className="day-indicator"></div>
                                </div>
                            </div>
                        </div>

                        <div className="progress-actions">
                            <button 
                                className="action-button primary-button"
                                onClick={() => navigate('/flashcards')}
                            >
                                <i className="fas fa-layer-group"></i>
                                Học Thẻ Ghi Nhớ
                            </button>
                            <button 
                                className="action-button secondary-button"
                                onClick={() => navigate('/readings')}
                            >
                                <i className="fas fa-book"></i>
                                Đọc Bài Mới
                            </button>
                        </div>

                        <div className="achievement-section">
                            <h2 className="section-title">Thành Tựu Của Bạn</h2>
                            <div className="achievements-grid">
                                <div className="achievement-card locked">
                                    <div className="achievement-icon">
                                        <i className="fas fa-award"></i>
                                    </div>
                                    <h3>Học Liên Tục 3 Ngày</h3>
                                    <p>Học mỗi ngày trong 3 ngày liên tiếp</p>
                                    <div className="achievement-progress">
                                        <div className="progress-bar" style={{ width: `${(progressData.currentStreak / 3) * 100}%` }}></div>
                                        <span className="progress-text">{progressData.currentStreak}/3</span>
                                    </div>
                                </div>
                                
                                <div className="achievement-card locked">
                                    <div className="achievement-icon">
                                        <i className="fas fa-stopwatch"></i>
                                    </div>
                                    <h3>10 Phút Học Tập</h3>
                                    <p>Học tổng cộng 10 phút</p>
                                    <div className="achievement-progress">
                                        <div className="progress-bar" style={{ width: `${(progressData.totalLearningMinutes / 10) * 100}%` }}></div>
                                        <span className="progress-text">{progressData.totalLearningMinutes.toFixed(2)}/10</span>
                                    </div>
                                </div>
                                
                                <div className="achievement-card locked">
                                    <div className="achievement-icon">
                                        <i className="fas fa-fire-alt"></i>
                                    </div>
                                    <h3>Học Liên Tục 7 Ngày</h3>
                                    <p>Học mỗi ngày trong 7 ngày liên tiếp</p>
                                    <div className="achievement-progress">
                                        <div className="progress-bar" style={{ width: `${(progressData.currentStreak / 7) * 100}%` }}></div>
                                        <span className="progress-text">{progressData.currentStreak}/7</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserProgressPage; 