import React from 'react';
import QuestionPanel from '../components/RoomFlashCard/QuestionPanel';
import AnswerResult from '../components/RoomFlashCard/AnswerResult';
import Leaderboard from '../components/RoomFlashCard/Leaderboard';
import { useLanguage } from '../contexts/LanguageContext';

const StudentPage = (props) => {
  const {
    navigateTo,
    currentQuestion,
    answerText,
    setAnswerText,
    handleAnswerKeyPress,
    isWaitingForAnswer,
    submitAnswer,
    lastAnswerResult,
    leaderboard,
    connectionStatus,
    roomId,
    currentFlashcardId,
    roomParticipantsList,
    isRoomFinished,
    isStudentFinished 
  } = props;
  const { translateText } = useLanguage();
  
  // State để điều khiển hiển thị overlay
  const [showFinishedOverlay, setShowFinishedOverlay] = React.useState(true); 
  const [showStudentFinishedOverlay, setShowStudentFinishedOverlay] = React.useState(true);

  // Student Finished Overlay Component
  const StudentFinishedOverlay = () => (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
         style={{ 
           backgroundColor: 'rgba(0, 0, 0, 0.85)', 
           zIndex: 9999,
           backdropFilter: 'blur(8px)'
         }}>
      <div className="card border-0 shadow-lg text-center position-relative" 
           style={{ 
             borderRadius: '24px', 
             maxWidth: '550px', 
             width: '90%',
             background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
             transform: 'scale(1)',
             animation: 'slideInUp 0.6s ease-out'
           }}>
        
        {/* Close Button */}
        <button
          type="button"
          className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center"
          style={{ 
            width: '40px', 
            height: '40px',
            zIndex: 10000,
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
          }}
          onClick={() => setShowStudentFinishedOverlay(false)}
          title={translateText('Close')}
        >
          <i className="fas fa-times fs-5"></i>
        </button>

        <div className="card-body p-5 text-white position-relative overflow-hidden">
          {/* Background decorations */}
          <div className="position-absolute top-0 end-0 opacity-20">
            <div className="rounded-circle bg-white" style={{ width: '100px', height: '100px', transform: 'translate(30px, -30px)' }}></div>
          </div>
          <div className="position-absolute bottom-0 start-0 opacity-20">
            <div className="rounded-circle bg-white" style={{ width: '60px', height: '60px', transform: 'translate(-20px, 20px)' }}></div>
          </div>
          <div className="position-absolute" style={{ top: '50%', left: '10%', transform: 'translateY(-50%)' }}>
            <div className="rounded-circle bg-white opacity-10" style={{ width: '40px', height: '40px' }}></div>
          </div>

          <div className="position-relative">
            {/* Celebration Icon with Animation */}
            <div className="mb-4" style={{ fontSize: '4.5rem' }}>
              <span className="d-inline-block" style={{ 
                animation: 'bounce 2s ease-in-out infinite' 
              }}>🎉</span>
            </div>

            <h2 className="display-6 fw-bold mb-3 text-white">
              {translateText('Congratulations!')}
            </h2>
            
            <p className="fs-5 mb-4 opacity-90">
              {translateText('You have completed all questions!')}
            </p>

            <div className="bg-white bg-opacity-20 rounded-4 p-4 mb-4">
              <p className="mb-3 fw-semibold">
                <i className="fas fa-hourglass-half me-2"></i>
                {translateText('You can now:')}
              </p>
              <div className="row g-3">
                <div className="col-12">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-users me-3 text-yellow-300"></i>
                    <span>{translateText('Wait for other players to finish')}</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-trophy me-3 text-yellow-300"></i>
                    <span>{translateText('Check the live leaderboard')}</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-redo me-3 text-yellow-300"></i>
                    <span>{translateText('Start a new game when ready')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-white bg-opacity-15 rounded-3 p-3 mb-4">
              <div className="small opacity-75 mb-2">{translateText('Current Status')}</div>
              <div className="d-flex align-items-center justify-content-center">
                <div className="spinner-border spinner-border-sm me-2" role="status" style={{ width: '16px', height: '16px' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span className="fw-semibold">
                  {translateText('Waiting for game to end...')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <button
                type="button"
                className="btn btn-light btn-lg px-4 py-2 fw-bold"
                onClick={() => setShowStudentFinishedOverlay(false)}
                style={{ borderRadius: '12px' }}
              >
                <i className="fas fa-eye me-2"></i>
                {translateText('Continue Watching')}
              </button>
              
              <button
                type="button"
                className="btn btn-outline-light btn-lg px-4 py-2 fw-bold"
                onClick={() => navigateTo('lobby')}
                style={{ borderRadius: '12px' }}
              >
                <i className="fas fa-home me-2"></i>
                {translateText('Back to Lobby')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-20px); }
          60% { transform: translateY(-10px); }
        }
        @keyframes slideInUp {
          0% { 
            opacity: 0;
            transform: translateY(100px) scale(0.9);
          }
          100% { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .text-yellow-300 {
          color: #fde047 !important;
        }
      `}</style>
    </div>
  );

  // Room Finished Overlay Component
  const RoomFinishedOverlay = () => (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
         style={{ 
           backgroundColor: 'rgba(0, 0, 0, 0.8)', 
           zIndex: 9999,
           backdropFilter: 'blur(5px)'
         }}>
      <div className="card border-0 shadow-lg text-center position-relative" 
           style={{ 
             borderRadius: '24px', 
             maxWidth: '500px', 
             width: '90%',
             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
           }}>
        
        {/* Close Button */}
        <button
          type="button"
          className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center"
          style={{ 
            width: '40px', 
            height: '40px',
            zIndex: 10000
          }}
          onClick={() => setShowFinishedOverlay(false)}
          title={translateText('Close')}
        >
          <i className="fas fa-times fs-5"></i>
        </button>

        <div className="card-body p-5 text-white position-relative overflow-hidden">
          {/* Background decorations */}
          <div className="position-absolute top-0 end-0 opacity-20">
            <div className="rounded-circle bg-white" style={{ width: '120px', height: '120px', transform: 'translate(40px, -40px)' }}></div>
          </div>
          <div className="position-absolute bottom-0 start-0 opacity-20">
            <div className="rounded-circle bg-white" style={{ width: '80px', height: '80px', transform: 'translate(-30px, 30px)' }}></div>
          </div>

          <div className="position-relative">
            {/* Celebration Icon with Animation */}
            <div className="mb-4" style={{ fontSize: '5rem' }}>
              <span className="d-inline-block" style={{ 
                animation: 'celebration 2s ease-in-out infinite alternate' 
              }}>🎊</span>
            </div>

            <h2 className="display-5 fw-bold mb-3 text-white">
              {translateText('Game Completed!')}
            </h2>
            
            <p className="fs-5 mb-4 opacity-90">
              {translateText('Thank you for participating! The room has been closed.')}
            </p>

            {/* Final Stats */}
            {leaderboard && leaderboard.length > 0 && (
              <div className="bg-white bg-opacity-20 rounded-4 p-4 mb-4">
                <h4 className="h5 fw-bold mb-3 text-white">
                  <i className="fas fa-trophy me-2"></i>
                  {translateText('Final Results')}
                </h4>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="text-center">
                      <div className="fs-2 fw-bold text-warning">
                        {leaderboard.length}
                      </div>
                      <div className="small text-white opacity-75">
                        {translateText('Total Players')}
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <div className="fs-2 fw-bold text-success">
                        {leaderboard[0]?.score || 0}
                      </div>
                      <div className="small text-white opacity-75">
                        {translateText('Highest Score')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <button
                type="button"
                className="btn btn-light btn-lg px-4 py-2 fw-bold"
                onClick={() => navigateTo('lobby')}
                style={{ borderRadius: '12px' }}
              >
                <i className="fas fa-home me-2"></i>
                {translateText('Back to Lobby')}
              </button>
              
              <button
                type="button"
                className="btn btn-outline-light btn-lg px-4 py-2 fw-bold"
                onClick={() => window.location.reload()}
                style={{ borderRadius: '12px' }}
              >
                <i className="fas fa-redo me-2"></i>
                {translateText('Play Again')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes celebration {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(10deg); }
          100% { transform: scale(1) rotate(-10deg); }
        }
      `}</style>
    </div>
  );

  return (
    <div className="min-vh-100 rounded-4" style={{ background: 'linear-gradient(135deg,rgb(251, 232, 255) 0%,rgb(250, 184, 122) 100%)' }}>
      <div className="container-fluid py-4">
        {/* Header Section */}
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-xl-10">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              <div className="text-center text-md-start">
                <h1 className="display-5 fw-bold text-white mb-2">
                  {translateText('Flashcard Battle')}
                  {isRoomFinished && (
                    <span className="badge bg-danger ms-3 fs-6" style={{ borderRadius: '12px' }}>
                      {translateText('Finished')}
                    </span>
                  )}
                  {isStudentFinished && !isRoomFinished && (
                    <span className="badge bg-success ms-3 fs-6" style={{ borderRadius: '12px' }}>
                      {translateText('You Completed!')}
                    </span>
                  )}
                </h1>
                <p className="mb-0">
                  {isRoomFinished 
                    ? translateText('Game has ended - Thank you for playing!') 
                    : isStudentFinished
                      ? translateText('You finished all questions! Waiting for others...')
                      : translateText('Challenge Your Knowledge!')
                  }
                </p>
              </div>
              <button
                type="button"
                className="btn btn-light btn-lg shadow-sm px-4 py-2"
                onClick={() => navigateTo('lobby')}
                style={{ borderRadius: '12px' }}
              >
                <i className="fas fa-arrow-left me-2"></i>
                {translateText('Back to Lobby')}
              </button>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <div className="row g-4">
              {/* Main Game Area */}
              <div className="col-12 col-lg-8">
                <div className="d-flex flex-column gap-4">
                  {/* Show different content based on room status */}
                  {isRoomFinished ? (
                    // Room Finished Summary Card
                    <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
                      <div 
                        className="card-header border-0 text-center py-4 position-relative text-white"
                        style={{ background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)' }}
                      >
                        <div className="position-relative">
                          <div className="d-flex align-items-center justify-content-center mb-2">
                            <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                              <i className="fas fa-flag-checkered fs-4 text-white"></i>
                            </div>
                            <h2 className="h3 fw-bold mb-0 text-white">{translateText('Game Summary')}</h2>
                          </div>
                          <div className="small opacity-75">{translateText('The session has ended')}</div>
                        </div>
                      </div>
                      
                      <div className="card-body p-4 text-center">
                        <div className="mb-4" style={{ fontSize: '4rem' }}>🏁</div>
                        <h3 className="h4 fw-bold text-primary mb-3">
                          {translateText('Session Completed Successfully!')}
                        </h3>
                        <p className="text-muted mb-4">
                          {translateText('All questions have been answered. Check the final leaderboard to see the results!')}
                        </p>
                        
                        {/* Quick Stats */}
                        <div className="row g-3 mb-4">
                          <div className="col-4">
                            <div className="p-3 bg-light rounded-3">
                              <div className="h4 fw-bold text-primary mb-1">
                                {roomParticipantsList?.length || 0}
                              </div>
                              <div className="small text-muted">{translateText('Players')}</div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="p-3 bg-light rounded-3">
                              <div className="h4 fw-bold text-success mb-1">
                                {leaderboard?.[0]?.score || 0}
                              </div>
                              <div className="small text-muted">{translateText('Top Score')}</div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="p-3 bg-light rounded-3">
                              <div className="h4 fw-bold text-warning mb-1">
                                {leaderboard?.length || 0}
                              </div>
                              <div className="small text-muted">{translateText('Participants')}</div>
                            </div>
                          </div>
                        </div>

                        <div className="alert alert-info border-0" style={{ borderRadius: '12px' }}>
                          <i className="fas fa-info-circle me-2"></i>
                          {translateText('You can now return to the lobby or check the final leaderboard.')}
                        </div>
                      </div>
                    </div>
                  ) : isStudentFinished ? (
                    // Student Finished Waiting Card
                    <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
                      <div 
                        className="card-header border-0 text-center py-4 position-relative text-white"
                        style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}
                      >
                        <div className="position-relative">
                          <div className="d-flex align-items-center justify-content-center mb-2">
                            <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                              <i className="fas fa-check-circle fs-4 text-white"></i>
                            </div>
                            <h2 className="h3 fw-bold mb-0 text-white">{translateText('Well Done!')}</h2>
                          </div>
                          <div className="small opacity-75">{translateText('You have completed all questions')}</div>
                        </div>
                      </div>
                      
                      <div className="card-body p-4 text-center">
                        <div className="mb-4" style={{ fontSize: '4rem' }}>
                          <span style={{ animation: 'bounce 2s ease-in-out infinite' }}>🎉</span>
                        </div>
                        <h3 className="h4 fw-bold text-success mb-3">
                          {translateText('Congratulations!')}
                        </h3>
                        <p className="text-muted mb-4">
                          {translateText('You have successfully answered all questions. Now you can wait for other players to finish or start a new game.')}
                        </p>
                        
                        {/* Waiting Status */}
                        <div className="alert alert-success border-0 mb-4" style={{ borderRadius: '12px' }}>
                          <div className="d-flex align-items-center justify-content-center">
                            <div className="spinner-border spinner-border-sm text-success me-2" role="status" style={{ width: '16px', height: '16px' }}>
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <span className="fw-semibold">
                              {translateText('Waiting for other players to finish...')}
                            </span>
                          </div>
                        </div>

                        {/* Action Options */}
                        <div className="row g-3">
                          <div className="col-6">
                            <div className="p-3 bg-light rounded-3 h-100">
                              <i className="fas fa-hourglass-half fs-4 text-warning mb-2"></i>
                              <div className="fw-semibold text-dark mb-1">{translateText('Keep Waiting')}</div>
                              <div className="small text-muted">{translateText('Stay to see final results')}</div>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="p-3 bg-light rounded-3 h-100">
                              <i className="fas fa-redo fs-4 text-primary mb-2"></i>
                              <div className="fw-semibold text-dark mb-1">{translateText('New Game')}</div>
                              <div className="small text-muted">{translateText('Start fresh in lobby')}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Normal Game Content
                    <>
                      <QuestionPanel
                        currentQuestion={currentQuestion}
                        answerText={answerText}
                        setAnswerText={setAnswerText}
                        handleAnswerKeyPress={handleAnswerKeyPress}
                        isWaitingForAnswer={isWaitingForAnswer}
                        submitAnswer={submitAnswer}
                        currentFlashcardId={currentFlashcardId}
                      />

                      {lastAnswerResult && (
                        <AnswerResult lastAnswerResult={lastAnswerResult} />
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-12 col-lg-4">
                <div className="d-flex flex-column gap-4">
                  {/* Leaderboard */}
                  {leaderboard && leaderboard.length > 0 && (
                    <div className="card border-0 shadow-lg" style={{ borderRadius: '16px' }}>
                      <div className="card-header bg-transparent border-0 py-3">
                        <h3 className="h5 fw-bold mb-0 text-warning">
                          <i className="fas fa-trophy me-2"></i>
                          {isRoomFinished ? translateText('Final Leaderboard') : translateText('Leaderboard')}
                        </h3>
                      </div>
                      <div className="card-body pt-0">
                        <Leaderboard leaderboard={leaderboard} isCompact={true} />
                        {isRoomFinished && (
                          <div className="text-center mt-3">
                            <div className="badge bg-success px-3 py-2" style={{ borderRadius: '12px' }}>
                              <i className="fas fa-check me-1"></i>
                              {translateText('Final Results')}
                            </div>
                          </div>
                        )}
                        {isStudentFinished && !isRoomFinished && (
                          <div className="text-center mt-3">
                            <div className="badge bg-info px-3 py-2" style={{ borderRadius: '12px' }}>
                              <i className="fas fa-clock me-1"></i>
                              {translateText('You completed!')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Room Participants */}
                  <div className="card border-0 shadow-lg" style={{ borderRadius: '16px' }}>
                    <div className="card-header bg-transparent border-0 py-3">
                      <h3 className="h5 fw-bold mb-0 text-primary">
                        <i className="fas fa-users me-2"></i>
                        {translateText('Players')} ({roomParticipantsList?.length || 0})
                      </h3>
                    </div>
                    <div className="card-body pt-0">
                      {roomParticipantsList && roomParticipantsList.length > 0 ? (
                        <div className="d-flex flex-column gap-2">
                          {roomParticipantsList.map((participant, index) => (
                            <div
                              key={participant.userId || participant.roomParticipantId || index}
                              className="d-flex align-items-center p-3 bg-light rounded-3"
                              style={{ borderRadius: '12px' }}
                            >
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  background: `hsl(${(index * 137.5) % 360}, 65%, 60%)`
                                }}
                              >
                                <span className="text-white fw-bold">
                                  {(participant.username || 'U').charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-grow-1">
                                <div className="fw-semibold text-dark">
                                  {participant.username || translateText('A friend')}
                                </div>
                                <div className="small text-muted">
                                  <i className={`fas fa-circle ${isRoomFinished ? 'text-secondary' : 'text-success'} me-1`} style={{ fontSize: '8px' }}></i>
                                  {isRoomFinished ? translateText('Session ended') : translateText('Online')}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <div className="text-muted mb-2" style={{ fontSize: '3rem' }}>👥</div>
                          <p className="text-muted mb-0">{translateText('No other players')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Connection Status */}
                  <div className="card border-0 shadow-lg" style={{ borderRadius: '16px' }}>
                    <div className="card-header bg-transparent border-0 py-3">
                      <h3 className="h5 fw-bold mb-0 text-info">
                        <i className="fas fa-wifi me-2"></i>
                        {translateText('Connection Info')}
                      </h3>
                    </div>
                    <div className="card-body pt-0">
                      {/* Connection Status Indicator */}
                      <div className="d-flex align-items-center justify-content-between p-3 mb-3 rounded-3"
                           style={{ backgroundColor: connectionStatus === 'Connected' ? '#d1e7dd' : '#f8d7da' }}>
                        <div className="d-flex align-items-center">
                          <div className={`rounded-circle me-3 ${connectionStatus === 'Connected' ? 'bg-success' : 'bg-danger'}`}
                               style={{ width: '12px', height: '12px' }}></div>
                          <span className="fw-semibold">{translateText('Connection Status')}</span>
                        </div>
                        <span className={`fw-bold ${connectionStatus === 'Connected' ? 'text-success' : 'text-danger'}`}>
                          {connectionStatus === 'Connected' ? translateText('Connected') : translateText('Disconnected')}
                        </span>
                      </div>

                      {/* Room Info */}
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="p-3 bg-light rounded-3">
                            <div className="small text-muted mb-1">{translateText('Room ID')}</div>
                            <div className="font-monospace fw-bold text-primary">
                              {roomId || 'N/A'}
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="p-3 bg-light rounded-3">
                            <div className="small text-muted mb-1">{translateText('Flashcard ID')}</div>
                            <div className="font-monospace fw-bold text-secondary">
                              {currentFlashcardId || 'N/A'}
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="p-3 bg-light rounded-3">
                            <div className="small text-muted mb-1">{translateText('Game Status')}</div>
                            <div className={`fw-bold ${
                              isRoomFinished 
                                ? 'text-secondary' 
                                : isStudentFinished
                                  ? 'text-success'
                                  : isWaitingForAnswer 
                                    ? 'text-warning' 
                                    : 'text-success'
                            }`}>
                              {isRoomFinished 
                                ? translateText('Finished') 
                                : isStudentFinished
                                  ? translateText('You finished!')
                                  : isWaitingForAnswer 
                                    ? translateText('Processing...') 
                                    : translateText('Ready to play')
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="position-fixed top-0 start-0 w-100 h-100 overflow-hidden" style={{ zIndex: -1 }}>
        <div className="position-absolute opacity-10"
             style={{
               top: '10%',
               right: '10%',
               width: '200px',
               height: '200px',
               background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
               borderRadius: '50%'
             }}>
        </div>
        <div className="position-absolute opacity-10"
             style={{
               bottom: '15%',
               left: '5%',
               width: '150px',
               height: '150px',
               background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
               borderRadius: '50%'
             }}>
        </div>
      </div>

      {/* Overlays */}
      {isRoomFinished && showFinishedOverlay && <RoomFinishedOverlay />}
      {isStudentFinished && !isRoomFinished && showStudentFinishedOverlay && <StudentFinishedOverlay />}
    </div>
  );
};

export default StudentPage;
                              