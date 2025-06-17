import React, { useState } from 'react';
import './CSS/RoomInfo.css';
import { useLanguage } from '../../contexts/LanguageContext';

const RoomInfo = ({ 
  roomCode, 
  roomId, 
  userRole, 
  isWaitingForAnswer,
  roomParticipantsList,
  navigateTo 
}) => {
  const { translateText } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    if (roomCode) {
      try {
        await navigator.clipboard.writeText(roomCode);
        setCopied(true);
        // Reset copied state after a few seconds
        setTimeout(() => setCopied(false), 2000); 
      } catch (err) {
        console.error('Cannot copy room code:', err);
        alert('Error: Cannot copy room code. Please try again.');
      }
    }
  };

  return (
    <div className="roominfo room-info-card">
      <div className="room-info-header">
        <h2 className="room-info-title">
          <i className="fas fa-info-circle"></i>
          {translateText('Room Information')}
        </h2>
      </div>

      <div className="room-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-hashtag"></i>
          </div>
          <div className="stat-content">
            <div className="stat-label">{translateText('Room ID')}</div>
            <div className="stat-value room-id">{roomId || 'N/A'}</div>
          </div>
        </div>

        <div className="stat-card room-code-card">
          <div className="stat-icon code-icon">
            <i className="fas fa-key"></i>
          </div>
          <div className="stat-content">
            <div className="stat-label">{translateText('Room Code')}</div>
            <div 
              className="stat-value room-code-display"
              onClick={handleCopyCode}
              title="Click to copy room code"
            >
              {roomCode || 'N/A'}
              {copied && <span className="copy-feedback">{translateText('Copied!')}</span>}
            </div>
            <button 
              type="button" 
              className="copy-btn"
              onClick={handleCopyCode}
              disabled={!roomCode}
            >
              <i className="fas fa-copy"></i>
              <span>{translateText('Copy Code')}</span>
            </button>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-user-tag"></i>
          </div>
          <div className="stat-content">
            <div className="stat-label">{translateText('Role')}</div>
            <div className="stat-value user-role">{userRole || 'N/A'}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className={`fas ${isWaitingForAnswer ? 'fa-clock' : 'fa-check-circle'}`}></i>
          </div>
          <div className="stat-content">
            <div className="stat-label">{translateText('Status')}</div>
            <div className={`stat-value status ${isWaitingForAnswer ? 'waiting' : 'ready'}`}>
              {isWaitingForAnswer ? translateText('Waiting...') : translateText('Ready')}
            </div>
          </div>
        </div>
      </div>
      
      <div className="participants-section">
        <h3 className="participants-titlee">
          <i className="fas fa-users"></i>
          {translateText('Room Participants')}
          <span className="participant-count">
            ({roomParticipantsList ? roomParticipantsList.length : 0})
          </span>
        </h3>
        
        {roomParticipantsList && roomParticipantsList.length > 0 ? (
          <div className="participants-grid">
            {roomParticipantsList.map((participant, index) => (
              <div 
                key={participant.userId || participant.roomParticipantId || index}
                className="participant-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="participant-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="participant-name">
                  {participant.username || 'Anonymous User'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-participants">
            <i className="fas fa-user-friends"></i>
            <p>{translateText("You're currently alone in this room.")}</p>
          </div>
        )}
      </div>
      
      <div className="navigation-section">
        {userRole === 'teacher' && (
          <button 
            type="button"
            className="nav-btn teacher-nav-btn"
            onClick={() => navigateTo('teacher')}
          >
            <span className="btn-icon">
              <i className="fas fa-chalkboard-teacher"></i>
            </span>
            <span className="btn-text">{translateText('ENTER TEACHER CONTROL PANEL')}</span>
            <span className="btn-arrow">
              <i className="fas fa-arrow-right"></i>
            </span>
          </button>
        )}
        {userRole === 'student' && (
          <button 
            type="button"
            className="nav-btn student-nav-btn"
            onClick={() => navigateTo('student')}
          >
            <span className="btn-icon">
              <i className="fas fa-user-graduate"></i>
            </span>
            <span className="btn-text">{translateText('ENTER STUDENT LEARNING AREA')}</span>
            <span className="btn-arrow">
              <i className="fas fa-arrow-right"></i>
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomInfo;