import React from 'react';
import RoomControl from '../components/RoomFlashCard/RoomControl';
import Leaderboard from '../components/RoomFlashCard/Leaderboard';
import LogPanel from '../components/RoomFlashCard/LogPanel';
import './CSS/TeacherPage.css'; // Import CSS file riêng
import { useLanguage } from '../contexts/LanguageContext';

const TeacherPage = (props) => {
  const {
    navigateTo,
    roomId,
    startRoom,
    nextQuestion,
    finishRoom,
    leaderboard,
    messages,
    signalRMessages,
    roomParticipantsList
  } = props;
  const { translateText } = useLanguage();

  // Hàm xuất báo cáo Excel
  const exportToExcel = () => {
    if (!leaderboard || leaderboard.length === 0) {
      alert(translateText('No data to export report!'));
      return;
    }

    const csvContent = [
      [translateText('Rank'), translateText('Student Name'), translateText('Score'), translateText('Correct Answers'), translateText('Time')],
      ...leaderboard.map((entry, index) => [
        index + 1,
        entry.username || translateText('Anonymous Student'),
        entry.score || 0,
        Math.round((entry.score || 0) / 10),
        new Date().toLocaleString('vi-VN')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${translateText('report-results')}-${roomId || translateText('room')}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Hàm xuất danh sách người tham gia
  const exportParticipants = () => {
    if (!roomParticipantsList || roomParticipantsList.length === 0) {
      alert(translateText('No participants list to export!'));
      return;
    }

    const csvContent = [
      [translateText('No.'), translateText('Username'), translateText('ID'), translateText('Join Time')],
      ...roomParticipantsList.map((participant, index) => [
        index + 1,
        participant.username || translateText('A friend'),
        participant.userId || participant.roomParticipantId || 'N/A',
        new Date().toLocaleString('vi-VN')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${translateText('participants-list')}-${roomId || translateText('room')}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="teacher-page fade-in">
      <div className="teacher-container">
        <div className="header-section">
          <h1 className="page-title">{translateText('Teacher Control Panel')}</h1>
          <button
            type="button"
            className="back-button"
            onClick={() => navigateTo('lobby')}
          >
            ← {translateText('Back to Lobby')}
          </button>
        </div>

        <div className="section-wrapper">
          <RoomControl
            roomId={roomId}
            startRoom={startRoom}
            nextQuestion={nextQuestion}
            finishRoom={finishRoom}
            navigateToStudentPage={() => navigateTo('student')}
          />
        </div>

        {/* Phần xuất báo cáo */}
        <div className="export-section">
          <h3 className="export-title">{translateText('Export Report')}</h3>
          <div className="export-buttons">
            <button
              type="button"
              className="export-button"
              onClick={exportToExcel}
              disabled={!leaderboard || leaderboard.length === 0}
            >
              {translateText('Export Results (CSV)')}
            </button>
            <button
              type="button"
              className="export-button"
              onClick={exportParticipants}
              disabled={!roomParticipantsList || roomParticipantsList.length === 0}
            >
              {translateText('Export Participants List')}
            </button>
          </div>
        </div>

        <div className="participants-card">
          <h3 className="participants-title">{translateText('People in this room:')}</h3>
          {roomParticipantsList && roomParticipantsList.length > 0 ? (
            <ul className="participants-list">
              {roomParticipantsList.map((participant) => (
                <li
                  key={participant.userId || participant.roomParticipantId}
                  className="participant-item"
                >
                  {participant.username || translateText('A friend')}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-participants">{translateText('No students have joined yet.')}</p>
          )}
        </div>

        {leaderboard && leaderboard.length > 0 && (
          <div className="section-wrapper">
            <Leaderboard leaderboard={leaderboard} isCompact={false} />
          </div>
        )}

        <div className="logs-grid d-none">
          <div>
            <LogPanel
              title={translateText('API Log')}
              messages={messages}
              messageType="api"
            />
          </div>
          <div>
            <LogPanel
              title={translateText('SignalR Events')}
              messages={signalRMessages}
              messageType="signalr"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPage;