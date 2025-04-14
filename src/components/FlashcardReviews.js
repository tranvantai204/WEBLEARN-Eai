import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import '../css/components/FlashcardReviews.css';

const FlashcardReviews = ({ reviews, flashcardSetId, onReviewAdded }) => {
    const { isAuthenticated } = useAuth();
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);
    const [hasAlreadyReviewed, setHasAlreadyReviewed] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [editingReview, setEditingReview] = useState(null);
    const [editFormData, setEditFormData] = useState({ rating: 5, comment: '' });
    const [deletingReview, setDeletingReview] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Get API URL
    const baseUrl = process.env.REACT_APP_API_URL || 'https://3599-115-76-51-131.ngrok-free.app';
    const API_URL = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;

    // Lấy user ID từ localStorage khi component mount và từ token JWT
    useEffect(() => {
        try {
            // Lấy từ localStorage trực tiếp
            let userId = localStorage.getItem('userId');
            
            // Nếu không có trong localStorage, thử lấy từ accessToken
            if (!userId) {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    // Lấy phần payload của token (phần thứ hai sau khi split theo dấu ".")
                    const base64Url = token.split('.')[1];
                    if (base64Url) {
                        // Decode base64
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const payload = JSON.parse(window.atob(base64));
                        
                        // Lấy userId từ payload token, thường nằm trong trường "nameid"
                        userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
                        
                        // Nếu tìm thấy userId, lưu vào localStorage cho lần sau
                        if (userId) {
                            localStorage.setItem('userId', userId);
                        }
                    }
                }
            }
            
            console.log('Current User ID:', userId);
            setCurrentUserId(userId);
        } catch (error) {
            console.error('Lỗi khi lấy userId:', error);
        }
    }, []);

    // Check if user has already reviewed this flashcard set
    useEffect(() => {
        if (reviews && reviews.length > 0 && isAuthenticated && currentUserId) {
            console.log('Kiểm tra đánh giá:', { reviews, currentUserId });
            const userReview = reviews.find(review => review.userId === currentUserId);
            if (userReview) {
                console.log('Đã tìm thấy đánh giá của người dùng:', userReview);
                setHasAlreadyReviewed(true);
            } else {
                setHasAlreadyReviewed(false);
            }
        }
    }, [reviews, isAuthenticated, currentUserId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReview({ ...newReview, [name]: name === 'rating' ? parseInt(value, 10) : value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: name === 'rating' ? parseInt(value, 10) : value });
    };

    const startEditingReview = (review) => {
        setEditingReview(review);
        setEditFormData({
            rating: review.rating,
            comment: review.comment
        });
    };

    const cancelEditing = () => {
        setEditingReview(null);
        setEditFormData({ rating: 5, comment: '' });
    };

    const submitReview = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            toast.error('Bạn phải đăng nhập để gửi đánh giá');
            return;
        }

        if (hasAlreadyReviewed) {
            toast.error('Bạn chỉ có thể đánh giá một lần cho mỗi bộ thẻ');
            return;
        }

        try {
            setSubmitting(true);
            
            const accessToken = localStorage.getItem('accessToken');
            
            // Sử dụng đúng API endpoint
            const response = await fetch(`${API_URL}/api/FlashcardReview/review/${flashcardSetId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    comment: newReview.comment,
                    rating: newReview.rating
                })
            });

            // Xử lý các trường hợp lỗi khác nhau
            const responseText = await response.text();
            let responseData;
            
            try {
                // Thử parse JSON
                responseData = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                responseData = { message: responseText };
            }

            if (!response.ok) {
                let errorMessage = 'Đã xảy ra lỗi khi gửi đánh giá';
                
                // Xử lý các mã lỗi cụ thể
                if (response.status === 401) {
                    errorMessage = 'Vui lòng đăng nhập lại để gửi đánh giá này';
                } else if (response.status === 400) {
                    if (responseData.message && responseData.message.includes('one review')) {
                        errorMessage = 'Bạn chỉ có thể đánh giá một lần cho mỗi bộ thẻ';
                        setHasAlreadyReviewed(true);
                    } else {
                        errorMessage = responseData.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
                    }
                } else if (response.status === 500) {
                    errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
                }
                
                throw new Error(errorMessage);
            }

            // Xử lý phản hồi thành công
            toast.success('Đánh giá đã được gửi thành công!');
            
            // Reset form
            setNewReview({ rating: 5, comment: '' });
            
            // Cập nhật đã đánh giá
            setHasAlreadyReviewed(true);
            
            // Thông báo cho component cha để làm mới danh sách đánh giá
            if (onReviewAdded && responseData) {
                onReviewAdded(responseData);
            }
            
        } catch (error) {
            console.error('Lỗi gửi đánh giá:', error);
            toast.error(error.message || 'Đã xảy ra lỗi khi gửi đánh giá');
        } finally {
            setSubmitting(false);
        }
    };

    const updateReview = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated || !editingReview) {
            return;
        }

        try {
            setSubmitting(true);
            
            const accessToken = localStorage.getItem('accessToken');
            
            // Gọi API cập nhật đánh giá
            const response = await fetch(`${API_URL}/api/FlashcardReview/update/${flashcardSetId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    comment: editFormData.comment,
                    rating: editFormData.rating
                })
            });

            // Xử lý phản hồi
            const responseText = await response.text();
            let responseData;
            
            try {
                responseData = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                responseData = { message: responseText };
            }

            if (!response.ok) {
                let errorMessage = 'Đã xảy ra lỗi khi cập nhật đánh giá';
                
                if (response.status === 401) {
                    errorMessage = 'Vui lòng đăng nhập lại để cập nhật đánh giá này';
                } else if (response.status === 400) {
                    errorMessage = responseData.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
                } else if (response.status === 404) {
                    errorMessage = 'Không tìm thấy đánh giá hoặc bạn không có quyền cập nhật nó.';
                } else if (response.status === 500) {
                    errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
                }
                
                throw new Error(errorMessage);
            }

            // Cập nhật thành công
            toast.success('Đánh giá đã được cập nhật thành công!');
            
            // Hủy chế độ chỉnh sửa
            setEditingReview(null);
            
            // Thông báo cho component cha để làm mới danh sách đánh giá
            if (onReviewAdded && responseData) {
                // Tìm và cập nhật đánh giá trong danh sách
                const updatedReviews = reviews.map(review => 
                    review.flashcardReviewId === responseData.flashcardReviewId ? responseData : review
                );
                onReviewAdded(responseData, updatedReviews);
            }
            
        } catch (error) {
            console.error('Lỗi cập nhật đánh giá:', error);
            toast.error(error.message || 'Đã xảy ra lỗi khi cập nhật đánh giá');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Kiểm tra nếu đánh giá thuộc về người dùng hiện tại
    const isCurrentUserReview = (review) => {
        if (!currentUserId || !review || !review.userId) {
            console.log('Không thể kiểm tra đánh giá:', { 
                currentUserId: currentUserId,
                reviewUserId: review?.userId
            });
            return false;
        }
        
        const matched = review.userId === currentUserId;
        console.log('Kiểm tra đánh giá có phải của người dùng hiện tại:', {
            reviewId: review.flashcardReviewId,
            reviewUserId: review.userId,
            currentUserId: currentUserId,
            matched: matched
        });
        
        return matched;
    };

    // Render stars for rating
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i 
                    key={i} 
                    className={`fas fa-star ${i <= rating ? 'filled' : 'empty'}`}
                ></i>
            );
        }
        return stars;
    };

    // Thêm hàm confirmDeleteReview để xác nhận trước khi xóa
    const confirmDeleteReview = (review) => {
        setDeletingReview(review);
    };

    // Thêm hàm cancelDeleteReview để hủy quá trình xóa
    const cancelDeleteReview = () => {
        setDeletingReview(null);
    };

    // Thêm hàm deleteReview để thực hiện xóa đánh giá
    const deleteReview = async () => {
        if (!isAuthenticated || !deletingReview) {
            return;
        }

        try {
            setIsDeleting(true);
            
            const accessToken = localStorage.getItem('accessToken');
            
            // Gọi API xóa đánh giá
            const response = await fetch(`${API_URL}/api/FlashcardReview/delete/${deletingReview.flashcardReviewId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            // Xử lý phản hồi
            const responseText = await response.text();
            let responseData;
            
            try {
                responseData = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                responseData = { message: responseText };
            }

            if (!response.ok) {
                let errorMessage = 'Đã xảy ra lỗi khi xóa đánh giá';
                
                if (response.status === 401) {
                    errorMessage = 'Vui lòng đăng nhập lại để xóa đánh giá này';
                } else if (response.status === 404) {
                    errorMessage = 'Đánh giá này không tồn tại hoặc bạn không có quyền xóa.';
                } else if (response.status === 500) {
                    errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
                }
                
                throw new Error(errorMessage);
            }

            // Xóa thành công
            toast.success('Đánh giá đã được xóa thành công!');
            
            // Hủy trạng thái xóa
            setDeletingReview(null);
            setHasAlreadyReviewed(false);
            
            // Thông báo cho component cha để cập nhật danh sách đánh giá
            if (onReviewAdded) {
                // Lọc đánh giá đã bị xóa khỏi danh sách
                const updatedReviews = reviews.filter(review => 
                    review.flashcardReviewId !== deletingReview.flashcardReviewId
                );
                onReviewAdded(null, updatedReviews);
            }
            
        } catch (error) {
            console.error('Lỗi xóa đánh giá:', error);
            toast.error(error.message || 'Đã xảy ra lỗi khi xóa đánh giá');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flashcard-reviews">
            <h3 className="reviews-title">Đánh giá ({reviews?.length || 0})</h3>
            
            {isAuthenticated && !hasAlreadyReviewed && (
                <div className="review-form-container">
                    <h4>Thêm đánh giá của bạn</h4>
                    <form onSubmit={submitReview}>
                        <div className="rating-input">
                            <label>Đánh giá:</label>
                            <div className="rating-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <label key={star}>
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={star}
                                            checked={newReview.rating === star}
                                            onChange={handleInputChange}
                                        />
                                        <i className={`fas fa-star ${star <= newReview.rating ? 'filled' : 'empty'}`}></i>
                                    </label>
                                ))}
                            </div>
                        </div>
                        
                        <div className="comment-input">
                            <label htmlFor="review-comment">Bình luận:</label>
                            <textarea
                                id="review-comment"
                                name="comment"
                                value={newReview.comment}
                                onChange={handleInputChange}
                                placeholder="Chia sẻ suy nghĩ của bạn về bộ thẻ này..."
                                required
                            ></textarea>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="submit-review-btn"
                            disabled={submitting}
                        >
                            {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                        </button>
                    </form>
                </div>
            )}
            
            {isAuthenticated && hasAlreadyReviewed && !editingReview && (
                <div className="already-reviewed-message">
                    <i className="fas fa-info-circle"></i>
                    <p>Bạn đã đánh giá bộ thẻ này.</p>
                </div>
            )}
            
            {/* Form chỉnh sửa đánh giá */}
            {isAuthenticated && editingReview && (
                <div className="review-form-container edit-form">
                    <h4>Chỉnh sửa đánh giá của bạn</h4>
                    <form onSubmit={updateReview}>
                        <div className="rating-input">
                            <label>Đánh giá:</label>
                            <div className="rating-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <label key={star}>
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={star}
                                            checked={editFormData.rating === star}
                                            onChange={handleEditInputChange}
                                        />
                                        <i className={`fas fa-star ${star <= editFormData.rating ? 'filled' : 'empty'}`}></i>
                                    </label>
                                ))}
                            </div>
                        </div>
                        
                        <div className="comment-input">
                            <label htmlFor="edit-review-comment">Bình luận:</label>
                            <textarea
                                id="edit-review-comment"
                                name="comment"
                                value={editFormData.comment}
                                onChange={handleEditInputChange}
                                placeholder="Chia sẻ suy nghĩ của bạn về bộ thẻ này..."
                                required
                            ></textarea>
                        </div>
                        
                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="submit-review-btn"
                                disabled={submitting}
                            >
                                {submitting ? 'Đang cập nhật...' : 'Cập nhật đánh giá'}
                            </button>
                            <button 
                                type="button" 
                                className="cancel-edit-btn"
                                onClick={cancelEditing}
                                disabled={submitting}
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            {/* Dialog xác nhận xóa */}
            {isAuthenticated && deletingReview && (
                <div className="delete-confirmation-overlay">
                    <div className="delete-confirmation-dialog">
                        <h4>Xác nhận xóa</h4>
                        <p>Bạn có chắc chắn muốn xóa đánh giá này không?</p>
                        <div className="dialog-actions">
                            <button 
                                className="delete-confirm-btn"
                                onClick={deleteReview}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Đang xóa...' : 'Xóa'}
                            </button>
                            <button 
                                className="delete-cancel-btn"
                                onClick={cancelDeleteReview}
                                disabled={isDeleting}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="reviews-list">
                {reviews && reviews.length > 0 ? (
                    reviews.map((review) => {
                        // Kiểm tra và lưu kết quả xem đánh giá có thuộc về người dùng hiện tại không
                        const userCanEdit = isAuthenticated && isCurrentUserReview(review) && !editingReview && !deletingReview;
                        
                        return (
                            <div key={review.flashcardReviewId} className="review-item">
                                <div className="review-header">
                                    <span className="reviewer-name">{review.userName}</span>
                                    <span className="review-date">{formatDate(review.createAt)}</span>
                                </div>
                                <div className="review-rating">
                                    {renderStars(review.rating)}
                                </div>
                                <p className="review-comment">{review.comment}</p>
                                
                                {/* Hiển thị nút chỉnh sửa và xóa */}
                                {userCanEdit && (
                                    <div className="review-actions">
                                        <button 
                                            type="button"
                                            className="edit-review-btn visible-edit-btn"
                                            onClick={() => startEditingReview(review)}
                                        >
                                            <i className="fas fa-edit"></i> Chỉnh sửa
                                        </button>
                                        <button 
                                            type="button"
                                            className="delete-review-btn"
                                            onClick={() => confirmDeleteReview(review)}
                                        >
                                            <i className="fas fa-trash-alt"></i> Xóa
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p className="no-reviews">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá bộ thẻ này!</p>
                )}
            </div>
        </div>
    );
};

export default FlashcardReviews; 