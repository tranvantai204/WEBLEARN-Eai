import React, { useState } from 'react';
import { toast } from 'react-toastify';
import '../css/components/ContentReportModal.css';

/**
 * ContentReportModal component for reporting inappropriate content
 * 
 * @param {Object} props Component properties
 * @param {boolean} props.isOpen Whether the modal is open
 * @param {Function} props.onClose Function to close the modal
 * @param {string} props.contentId ID of the content being reported
 * @param {number} props.contentType Type of content (1=MultipleChoice, 2=FlashCard)
 * @param {string} props.contentName Name of the content for display purposes
 */
const ContentReportModal = ({ isOpen, onClose, contentId, contentType, contentName }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Close modal and reset state
  const handleClose = () => {
    if (!isSubmitting) {
      setReason('');
      setErrorMessage('');
      onClose();
    }
  };
  
  // Submit report to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!reason.trim()) {
      setErrorMessage('Please enter a reason for the report');
      return;
    }
    
    if (reason.length > 500) {
      setErrorMessage('Report reason cannot exceed 500 characters');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Your session has expired. Please log in again.');
        setIsSubmitting(false);
        return;
      }
      
      const API_URL = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${API_URL}/ContentReport/ReportContent/${contentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          ContentType: contentType,
          Reason: reason
        })
      });
      
      if (!response.ok) {
        // Handle different error codes
        if (response.status === 400) {
          const errorData = await response.json();
          console.error('Validation error:', errorData);
          
          if (errorData.errors && errorData.errors.ContentType) {
            setErrorMessage(`Content type error: ${errorData.errors.ContentType[0]}`);
          } else if (errorData.errors && errorData.errors.Reason) {
            setErrorMessage(`Reason error: ${errorData.errors.Reason[0]}`);
          } else if (response.statusText === 'Content report already exists.') {
            setErrorMessage('You have already reported this content');
            toast.info('You have already reported this content');
          } else {
            setErrorMessage('Invalid data. Please check your input.');
          }
        } else if (response.status === 401) {
          setErrorMessage('Your session has expired. Please log in again.');
          toast.error('Your session has expired. Please log in again.');
        } else if (response.status === 500) {
          setErrorMessage('Server error. Please try again later.');
          toast.error('Server error. Please try again later.');
        } else {
          setErrorMessage(`An error occurred: ${response.status}`);
          toast.error(`An error occurred: ${response.status}`);
        }
      } else {
        // Success
        const reportData = await response.json();
        console.log('Report submitted successfully:', reportData);
        toast.success('Report submitted successfully. Thank you for your feedback!');
        handleClose();
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setErrorMessage('An error occurred while submitting the report. Please try again later.');
      toast.error('An error occurred while submitting the report. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="report-modal-overlay" onClick={handleClose}>
      <div className="report-modal-container" onClick={e => e.stopPropagation()}>
        <div className="report-modal-header">
          <h2 className="report-modal-title">Report Content</h2>
          <button className="report-modal-close" onClick={handleClose} disabled={isSubmitting}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="report-modal-body">
          <div className="report-content-info">
            <p className="report-content-name">
              <strong>Content:</strong> {contentName || 'Selected content'}
            </p>
            <p className="report-content-type">
              <strong>Content type:</strong> {contentType === 1 ? 'Multiple Choice Test' : 'Flashcard Set'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="reason">
                Reason for report <span className="required">*</span>
              </label>
              <textarea
                id="reason"
                name="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please describe the issue with this content (maximum 500 characters)"
                rows="5"
                maxLength="500"
                disabled={isSubmitting}
                className={errorMessage ? 'form-control is-invalid' : 'form-control'}
              ></textarea>
              <div className="char-count">{reason.length}/500</div>
              {errorMessage && <div className="invalid-feedback">{errorMessage}</div>}
            </div>
            
            <div className="report-modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContentReportModal; 