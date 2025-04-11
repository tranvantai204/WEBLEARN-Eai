import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/components/UserProgress.css';
import { useAuth } from '../contexts/AuthContext';

function UserProgressPage() {
    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { accessToken, isAuthenticated } = useAuth();

    // API URL
    const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
    // Remove trailing /api if it exists to avoid duplicate /api in endpoints
    const API_URL = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;

    // Fetch user learning stats from API
    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                if (!isAuthenticated || !accessToken) {
                    toast.error('Vui lòng đăng nhập để xem tiến độ');
                    navigate('/login');
                    return;
                }

                setLoading(true);

                // Call API to get learning stats
                const response = await fetch(`${API_URL}/api/UserLearningStats/GetReport`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to load progress data: ${response.status}`);
                }

                const data = await response.json();
                console.log('Learning statistics data:', data);
                setProgressData(data);
            } catch (err) {
                console.error('Error fetching user progress:', err);
                toast.error('Không thể tải dữ liệu tiến độ. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserStats();
    }, [API_URL, accessToken, isAuthenticated, navigate]);

    // Update streak when component mounts (on login/page load)
    useEffect(() => {
        const updateUserStreak = async () => {
            try {
                if (!isAuthenticated || !accessToken) {
                    return;
                }

                // Call API to update streak
                const response = await fetch(`${API_URL}/api/UserLearningStats/UpdateStreak`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    console.error(`Failed to update streak: ${response.status}`);
                    return;
                }

                console.log('Streak updated successfully');
            } catch (err) {
                console.error('Error updating streak:', err);
            }
        };

        updateUserStreak();
    }, [API_URL, accessToken, isAuthenticated]);

    // Format thời gian học thành giờ:phút
    const formatLearningTime = (minutes) => {
        if (!minutes) return '0 phút';
        
        const hours = Math.floor(minutes / 60);
        const mins = Math.round((minutes - hours * 60) * 100) / 100;
        
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins} phút`;
    };

    // Format ngày học cuối cùng
    const formatLastLearningDate = (dateString) => {
        if (!dateString) return 'Chưa có dữ liệu';
        
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    return (
        <div className="main-content">
            <ToastContainer position="top-right" autoClose={3000} />
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
                ) : progressData ? (
                    <div className="user-progress-content">
                        <div className="progress-stats-grid">
                            <div className="progress-stat-card current-streak">
                                <div className="stat-icon">
                                    <i className="fas fa-fire"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>Streak Hiện Tại</h3>
                                    <p className="stat-value">{progressData.currentStreak || 0} ngày</p>
                                    <p className="stat-description">Giữ vững động lực học mỗi ngày!</p>
                                </div>
                            </div>

                            <div className="progress-stat-card longest-streak">
                                <div className="stat-icon">
                                    <i className="fas fa-trophy"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>Streak Dài Nhất</h3>
                                    <p className="stat-value">{progressData.longestStreak || 0} ngày</p>
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
                                {/* Giả lập dữ liệu lịch học 7 ngày gần đây - Sẽ cập nhật sau khi API cung cấp dữ liệu lịch học */}
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
                                <div className={`achievement-card ${progressData.currentStreak >= 3 ? 'unlocked' : 'locked'}`}>
                                    <div className="achievement-icon">
                                        <i className="fas fa-award"></i>
                                    </div>
                                    <h3>Học Liên Tục 3 Ngày</h3>
                                    <p>Học mỗi ngày trong 3 ngày liên tiếp</p>
                                    <div className="achievement-progress">
                                        <div className="progress-bar" style={{ width: `${Math.min(100, ((progressData.currentStreak || 0) / 3) * 100)}%` }}></div>
                                        <span className="progress-text">{progressData.currentStreak || 0}/3</span>
                                    </div>
                                </div>
                                
                                <div className={`achievement-card ${(progressData.totalLearningMinutes || 0) >= 10 ? 'unlocked' : 'locked'}`}>
                                    <div className="achievement-icon">
                                        <i className="fas fa-stopwatch"></i>
                                    </div>
                                    <h3>10 Phút Học Tập</h3>
                                    <p>Học tổng cộng 10 phút</p>
                                    <div className="achievement-progress">
                                        <div className="progress-bar" style={{ width: `${Math.min(100, ((progressData.totalLearningMinutes || 0) / 10) * 100)}%` }}></div>
                                        <span className="progress-text">{(progressData.totalLearningMinutes || 0).toFixed(2)}/10</span>
                                    </div>
                                </div>
                                
                                <div className={`achievement-card ${progressData.currentStreak >= 7 ? 'unlocked' : 'locked'}`}>
                                    <div className="achievement-icon">
                                        <i className="fas fa-fire-alt"></i>
                                    </div>
                                    <h3>Học Liên Tục 7 Ngày</h3>
                                    <p>Học mỗi ngày trong 7 ngày liên tiếp</p>
                                    <div className="achievement-progress">
                                        <div className="progress-bar" style={{ width: `${Math.min(100, ((progressData.currentStreak || 0) / 7) * 100)}%` }}></div>
                                        <span className="progress-text">{progressData.currentStreak || 0}/7</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="no-data-message">
                        <i className="fas fa-exclamation-circle"></i>
                        <h2>Không tìm thấy dữ liệu</h2>
                        <p>Bạn chưa có dữ liệu học tập. Hãy bắt đầu học để theo dõi tiến độ!</p>
                        <button 
                            className="action-button primary-button"
                            onClick={() => navigate('/flashcards')}
                        >
                            Bắt đầu học ngay
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserProgressPage; 