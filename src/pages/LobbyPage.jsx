import React, { useEffect, useState } from 'react';
import ConnectionConfig from '../components/RoomFlashCard/ConnectionConfig';
import RoomInfo from '../components/RoomFlashCard/RoomInfo';
import { useFlashcard } from '../contexts/FlashcardContext';
import { jwtDecode } from 'jwt-decode';
import './CSS/LobbyPage.css'; // Import the custom CSS
import { useLanguage } from '../contexts/LanguageContext';

const LobbyPage = (props) => {
  const { translateText } = useLanguage();
  const { getUserFlashcardSets } = useFlashcard();
  const [userId, setUserId] = useState(null); 
  const [flashcardSets, setFlashcardSets] = useState([]);
  
  // Thêm state cho các trường mới
  const [gameMode, setGameMode] = useState(1); // Default mode = 1
  const [maxParticipants, setMaxParticipants] = useState(10); // Default 10 người
  const [showLeaderboardRealtime, setShowLeaderboardRealtime] = useState(true); // Default true

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        setUserId(userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.warn("No token found in localStorage");
    }
  }, []);

  // Thêm vào đầu useEffect hiện tại
useEffect(() => {
  // Khôi phục từ cache nếu có
  const cachedData = localStorage.getItem('flashcardCache');
  if (cachedData) {
    const { sets, selected, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < 300000) {
      setFlashcardSets(sets);
      if (selected) setSelectedFlashcardSet(selected);
      return; 
    }
  }

  // Fetch mới nếu không có cache
  const fetchData = async () => {
    try {
      const response = await getUserFlashcardSets(userId);
      if (response?.flashcardSets) {
        setFlashcardSets(response.flashcardSets);
        // Lưu vào cache
        localStorage.setItem('flashcardCache', JSON.stringify({
          sets: response.flashcardSets,
          selected: selectedFlashcardSet,
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      console.error('Fetch failed:', error);
    }
  };

  if (userId) fetchData();
}, [userId, getUserFlashcardSets]);

  const validateRoomCode = (code) => {
    return /^[a-zA-Z0-9]{0,6}$/.test(code);
  };

  // Hàm tạo phòng được cập nhật với các tham số mới
  const handleCreateRoom = async () => {
    if (!selectedFlashcardSet) {
      // addMessage('Vui lòng chọn flashcard set'); // Uncomment nếu có addMessage function
      alert('Vui lòng chọn flashcard set');
      return;
    }
    
    // Gọi createRoom với các tham số từ state
    await createRoom(gameMode, maxParticipants, showLeaderboardRealtime);
  };

  const {
    token, setToken,
    apiBaseUrl, setApiBaseUrl,
    connectionStatus,
    connectToHub,
    roomName, setRoomName,
    flashcardSetId, setFlashcardSetId,
    createRoom,
    joinCode, setJoinCode,
    joinRoom,
    roomCode, 
    roomId,
    userRole,
    isWaitingForAnswer,
    navigateTo,
    roomParticipantsList,
    setSelectedFlashcardSet, 
    selectedFlashcardSet 
  } = props;

  return (
    <div className="lobby lobby-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
        </div>
      </div>

      <div className="container-lg position-relative">
        {/* Header with Animation */}
        <div className="header-sectionn p-2">
          <h1 className="main-title">
            <span className="title-word highlight">Learn Together</span>
            <span className="subtitle">Learning Hub</span>
          </h1>
        </div>
        
        {/* Connection Config with Glass Effect */}
        <div className="connection-section">
          <ConnectionConfig 
            token={token}
            setToken={setToken}
            apiBaseUrl={apiBaseUrl}
            setApiBaseUrl={setApiBaseUrl}
            connectToHub={connectToHub}
            connectionStatus={connectionStatus}
          />
        </div>

        <div className="row g-4">
          {/* Create Room Card */}
          <div className="col-md-6">
            <div className="game-card teacher-card">
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="card-icon teacher-icon">
                  <i className="fas fa-chalkboard-teacher"></i>
                </div>
                <h2 className="card-title">{translateText('Create Room')}</h2>
                <p className="card-subtitle">{translateText('For Teachers & Hosts')}</p>

                <div className="input-group">
                  <label htmlFor="roomNameInput" className="input-label">
                    <i className="fas fa-door-open"></i>
                    {translateText('Room Name')}
                  </label>
                  <input 
                    type="text" 
                    id="roomNameInput"
                    className="enhanced-input" 
                    value={roomName} 
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder={translateText('Enter room name...')}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="flashcardSetSelect" className="input-label">
                    <i className="fas fa-layer-group"></i>
                    {translateText('Select Flashcard Set')}
                  </label>
                  <select
                    id="flashcardSetSelect"
                    className="enhanced-select"
                    value={selectedFlashcardSet}
                    onChange={(e) => {
                      setSelectedFlashcardSet(e.target.value);
                      setFlashcardSetId(e.target.value);
                    }}
                  >
                    <option value="">-- {translateText('Choose flashcard set')} --</option>
                    {flashcardSets.map((set) => (
                      <option key={set.flashcardSetId} value={set.flashcardSetId}>
                        {set.title} ({set.learningLanguage} → {set.nativeLanguage}) - {set.totalVocabulary} words
                      </option>
                    ))}
                  </select>
                </div>

                {/* Game Mode Selection */}
                <div className="input-group">
                  <label htmlFor="gameModeSelect" className="input-label">
                    <i className="fas fa-gamepad"></i>
                    {translateText('Game Mode')}
                  </label>
                  <select
                    id="gameModeSelect"
                    className="enhanced-select"
                    value={gameMode}
                    onChange={(e) => setGameMode(parseInt(e.target.value))}
                  >
                    <option disabled value={0}>{translateText('Term To Definition')}</option>
                    <option value={1}>{translateText('Definition To Term')}</option>
                    <option disabled value={2}>{translateText('Mix')}</option>
                  </select>
                </div>

                {/* Max Participants */}
                <div className="input-group">
                  <label htmlFor="maxParticipantsInput" className="input-label">
                    <i className="fas fa-users"></i>
                    {translateText('Max Participants')}
                  </label>
                  <input 
                    type="number" 
                    id="maxParticipantsInput"
                    className="enhanced-input" 
                    value={maxParticipants} 
                    onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 1)}
                    min="1"
                    max="50"
                    placeholder={translateText('Maximum number of participants')}
                  />
                </div>

                {/* Show Leaderboard Option */}
                {/* <div className="input-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={showLeaderboardRealtime}
                      onChange={(e) => setShowLeaderboardRealtime(e.target.checked)}
                      className="enhanced-checkbox"
                      disabled
                    />
                    <span className="checkmark"></span>
                    <span className="checkbox-text ms-4 text-dark">
                      <i className="fas fa-trophy me-2"></i>
                      {translateText('Show Real-time Leaderboard')}
                    </span>
                  </label>
                </div> */}

                <button 
                  type="button"
                  className="action-btn teacher-btn"
                  onClick={handleCreateRoom}
                  disabled={connectionStatus !== 'Connected' || !selectedFlashcardSet}
                >
                  <span className="btn-text">{translateText('Create Room')}</span>
                  <span className="btn-icon">
                    <i className="fas fa-plus-circle"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Join Room Card */}
          <div className="col-md-6">
            <div className="game-card student-card">
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="card-icon student-icon">
                  <i className="fas fa-user-graduate"></i>
                </div>
                <h2 className="card-title">{translateText('Join Room')}</h2>
                <p className="card-subtitle">{translateText('For Students & Players')}</p>

                <div className="input-group">
                  <label htmlFor="joinCodeInput" className="input-label">
                    <i className="fas fa-key"></i>
                    {translateText('Room Code (6 characters)')}
                  </label>
                  <input 
                    type="text" 
                    id="joinCodeInput"
                    className={`enhanced-input code-input ${
                      joinCode.length !== 6 && joinCode.length > 0 ? 'invalid' : ''
                    }`}
                    value={joinCode} 
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      if (/^[a-zA-Z0-9]{0,6}$/.test(value)) {
                        setJoinCode(value);
                      }
                    }}
                    placeholder={translateText("E.G. ABC123")}
                    maxLength={6}
                    autoComplete="off"
                    spellCheck="false"
                  />
                  {joinCode.length !== 6 && joinCode.length > 0 && (
                    <div className="error-message">
                      <i className="fas fa-exclamation-triangle"></i>
                      {translateText('Room code must be exactly 6 characters (letters or numbers)')}
                    </div>
                  )}
                </div>

                <button 
                  type="button"
                  className="action-btn student-btn"
                  onClick={joinRoom}
                  disabled={connectionStatus !== 'Connected' || joinCode.length !== 6}
                >
                  <span className="btn-text">{translateText('Join Room')}</span>
                  <span className="btn-icon">
                    <i className="fas fa-sign-in-alt"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Room Info Section */}
        {(roomCode || roomId) && (
          <div className="room-info-section">
            <RoomInfo 
              roomCode={roomCode}
              roomId={roomId}
              userRole={userRole}
              isWaitingForAnswer={isWaitingForAnswer}
              roomParticipantsList={roomParticipantsList}
              navigateTo={navigateTo}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LobbyPage;