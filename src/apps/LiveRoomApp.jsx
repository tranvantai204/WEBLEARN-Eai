import { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import LobbyPage from '../pages/LobbyPage'; 
import TeacherPage from '../pages/TeacherPage'; 
import StudentPage from '../pages/StudentPage'; 
import { jwtDecode } from 'jwt-decode';

export default function LiveRoomApp() { 
  const apiUrlFromEnv = process.env.REACT_APP_API_URL;
  const apibaseUrl = apiUrlFromEnv.split('/api')[0];
  
  // State quản lý trang hiện tại
  const [currentPage, setCurrentPage] = useState('lobby'); // 'lobby', 'teacher', 'student'
  // State kết nối và API
  const [token, setToken] = useState(''); 
  const [apiBaseUrl, setApiBaseUrl] = useState(apibaseUrl); 
  const [connection, setConnection] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [messages, setMessages] = useState([]);
  
  // State phòng học
  const [roomName, setRoomName] = useState('');
  const [flashcardSetId, setFlashcardSetId] = useState(''); 
  const [roomCode, setRoomCode] = useState('');
  const [roomId, setRoomId] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [userRole, setUserRole] = useState(''); // 'teacher' or 'student'
  const [roomParticipantsList, setRoomParticipantsList] = useState([]);
  const [selectedFlashcardSet, setSelectedFlashcardSet] = useState('');
  
  // State trò chơi
  const [currentFlashcardId, setCurrentFlashcardId] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [signalRMessages, setSignalRMessages] = useState([]);
  // const [roomDetails, setRoomDetails] = useState(null); // This state was not used in the provided logic
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [lastAnswerResult, setLastAnswerResult] = useState(null);
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);
  const [isRoomFinished, setIsRoomFinished] = useState(false);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Kiểm tra cả 'token' và 'accessToken'
    const storedToken = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
      connectToHub(); 
    } else {
      console.warn('No token or accessToken found in localStorage. Please log in first.');
    }
  }, []); 

  useEffect(() => {
  if (token) {
    connectToHub(); 
  }
}, [token]);

  // Kết nối tới SignalR Hub
  const connectToHub = async () => {
     if (!token) {
      setConnectionStatus('Disconnected (No token)');
      return; // Dừng nếu không có token
    }
    if (connectionStatus === 'Connected' || connectionStatus === 'Connecting') {
        addMessage('Already connected or connecting to SignalR hub.');
        return;
    }
    setConnectionStatus('Connecting');
    try {
      const newConnection = new HubConnectionBuilder()
        .withUrl(`${apiBaseUrl}/roomhub`, { 
          accessTokenFactory: () => token 
        })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      newConnection.on('ConnectedSuccessfully', (message) => {
        addSignalRMessage('System', message);
        if (roomId && (userRole === 'teacher' || userRole === 'student')) {
            newConnection.invoke('JoinRoomGroup', roomId)
                .then(() => addMessage(`Successfully invoked JoinRoomGroup for room ${roomId} as ${userRole}`))
                .catch(err => addMessage(`Error invoking JoinRoomGroup for room ${roomId}: ${err}`));
        }
      });
      
      newConnection.on('UserJoined', (user) => {
        addSignalRMessage('Event', `User joined: ${JSON.stringify(user)}`);
        console.log('User joined:', user);
        setRoomParticipantsList(prevList => {
            const isAlreadyInList = prevList.some(p => p.userId === user.userId || p.roomParticipantId === user.roomParticipantId);
            if (!isAlreadyInList) {
                return [...prevList, user];
            }
            return prevList; 
        });
        if (userRole === 'teacher') {
          console.log('[DEBUG DÀNH CHO GIÁO VIÊN] Có người mới tham gia phòng:', user);
        }
      });
      
      newConnection.on('UserLeft', (user) => { 
        addSignalRMessage('Event', `User left: ${user.username} (ID: ${user.userId})`);
        console.log('SignalR: UserLeft event received', user);
        setRoomParticipantsList(prevList =>
            prevList.filter(p => p.userId !== user.userId)
        );
      });
      
      newConnection.on('NextFlashcard', (question, questionIndex) => {
        addSignalRMessage('Question', `New flashcard received: ${question?.questionText}, Index: ${questionIndex}`);
        setCurrentFlashcardId(question.flashcardId);
        setCurrentQuestion(question);
        setLastAnswerResult(null); 
        setAnswerText(''); 
        setIsWaitingForAnswer(false);
      });
      
      newConnection.on('QuestionStarted', (data) => { 
        addSignalRMessage('Question', `Question started event: ${JSON.stringify(data)}`);
        setCurrentFlashcardId(data.flashcardId);
        setIsWaitingForAnswer(false);
      });
      
      newConnection.on('AnswerResult', (result) => {
        addSignalRMessage('Result', `Answer result: Correct - ${result.isCorrect}, Score - ${result.newScore}`);
        setLastAnswerResult(result);
        setIsWaitingForAnswer(false);
        
        if (result.nextQuestion) {
          setCurrentQuestion(result.nextQuestion);
          setCurrentFlashcardId(result.nextQuestion.flashcardId);
          setAnswerText(''); 
          addSignalRMessage('Question', `Next question received in answer result: ${result.nextQuestion.questionText}`);
        } else {
          if (userRole === 'student') {
             addSignalRMessage('Event', 'No more questions for you / You have completed all flashcards!');
          }
        }
      });
      
      newConnection.on('LeaderboardUpdate', (leaderboardData) => {
        addSignalRMessage('Leaderboard', `Leaderboard updated. Entries: ${leaderboardData?.length || 0}`);
        setLeaderboard(leaderboardData);
      });
      
      newConnection.on('RoomFinished', (finalResults) => {
        addSignalRMessage('Event', `Room finished. Final results: ${JSON.stringify(finalResults)}`);
        setCurrentQuestion(null);
        setCurrentFlashcardId(null);
        setLastAnswerResult(null);
        setLeaderboard(finalResults); 
        setIsRoomFinished(true);
      });
      
      newConnection.on('AnswerSubmissionError', (errors) => {
        const errorMsg = Array.isArray(errors) ? errors.join(', ') : JSON.stringify(errors);
        addSignalRMessage('Error', `Answer submission error: ${errorMsg}`);
        setIsWaitingForAnswer(false);
      });

      await newConnection.start();
      setConnection(newConnection);
      setConnectionStatus('Connected');
      addMessage('Successfully connected to SignalR hub.');
      
    } catch (err) {
      setConnectionStatus(`Connection failed: ${err.message || err}`);
      addMessage(`Failed to connect to SignalR hub: ${err.message || err}`);
      setConnection(null); 
    }
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };
  
  const addSignalRMessage = (type, message) => {
    setSignalRMessages(prev => [...prev, { type, message, time: new Date().toLocaleTimeString() }]);
  };

  const callApi = async (endpoint, method = 'GET', body = null) => {
    if (!token) {
      addMessage('API Error: No token available');
      return { success: false, error: 'No token' };
    }
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const options = {
        method,
        headers
      };
      
      if (body !== null) { 
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(`${apiBaseUrl}${endpoint}`, options);
      
      if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { errors: [response.statusText] };
        }
        throw new Error(JSON.stringify(errorData.errors || errorData.message || errorData.title || errorData || 'API request failed'));
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: true, data: null }; 
      }

    } catch (error) {
      addMessage(`API Error: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  const createRoom = async () => {
    if (!selectedFlashcardSet) {
      addMessage('Vui lòng chọn flashcard set');
      return;
    }
    addMessage(`Creating room "${roomName}" with FlashcardSet ID: ${flashcardSetId}`);
    
    const result = await callApi('/api/Rooms/create', 'POST', {
      flashcardSetId: flashcardSetId,
      roomName: roomName,
      mode: 1, 
      maxParticipants: 10, 
      showLeaderboardRealtime: true
    });
    
    if (result.success && result.data) {
      addMessage(`Room created successfully. Code: ${result.data.roomCode}, ID: ${result.data.roomId}`);
      setRoomCode(result.data.roomCode);
      setRoomId(result.data.roomId);
      setUserRole('teacher');
      setRoomParticipantsList([]); 
      setIsRoomFinished(false);

      const createdRoomId = result.data.roomId; 
      if (connection && connection.state === 'Connected' && createdRoomId) {
        try {
          await connection.invoke('JoinRoomGroup', createdRoomId);
          addMessage(`Teacher joined SignalR group for newly created room ${createdRoomId}`);
        } catch (err) {
          addMessage(`Error joining SignalR group for new room: ${err}`);
        }
      } else if (!connection || connection.state !== 'Connected') {
         addMessage('SignalR not connected. Teacher should connect/reconnect to manage the room.');
      }
    } else {
        addMessage(`Failed to create room. ${result.error || 'Unknown error'}`);
    }
  };
  
  const joinRoom = async () => {
    if (!/^[a-zA-Z0-9]{6}$/.test(joinCode)) {
      addMessage('Mã phòng không hợp lệ - phải gồm 6 ký tự (chữ hoặc số)');
      return;
    }
    
    addMessage(`Attempting to join room with code: ${joinCode}`);
    
    const result = await callApi('/api/Rooms/join', 'POST', {
      roomCode: joinCode
    });
    
    if (result.success && result.data) {
      addMessage(`Joined room successfully: ${result.data.roomInfo.roomName}`);
      const newRoomId = result.data.roomInfo.roomId;
      setRoomId(newRoomId);
      setUserRole('student'); 
      setIsRoomFinished(false);

      if (result.data.currentParticipantsInRoom) {
        setRoomParticipantsList(result.data.currentParticipantsInRoom);
        addMessage(`Current participants in room: ${result.data.currentParticipantsInRoom.length}`);
      } else {
        setRoomParticipantsList([]); 
      }
      
      if (result.data.currentQuestion) {
        setCurrentQuestion(result.data.currentQuestion);
        setCurrentFlashcardId(result.data.currentQuestion.flashcardId);
        addMessage(`Current question retrieved: ${result.data.currentQuestion.questionText}`);
      } else {
        setCurrentQuestion(null);
        setCurrentFlashcardId(null);
        addMessage('Waiting for the room to start or for the next question.');
      }
      
      if (connection && connection.state === 'Connected') {
        try {
          await connection.invoke('JoinRoomGroup', newRoomId);
          addMessage(`Student joined SignalR group for room ${newRoomId}`);
        } catch (err) {
          addMessage(`Error joining SignalR group for room: ${err}`);
        }
      } else if (!connection || connection.state !== 'Connected') {
        addMessage('SignalR not connected. Student should connect/reconnect to participate.');
      }
    } else {
        addMessage(`Failed to join room. ${result.error || 'Unknown error'}`);
    }
  };

  const startRoom = async () => {
    if (!roomId) {
        addMessage('Error: No Room ID available to start.');
        return;
    }
    addMessage(`Attempting to start room: ${roomId}`);
    const result = await callApi(`/api/Rooms/${roomId}/start`, 'POST');
    if (result.success) {
      addMessage('Room started successfully. First question should be broadcast via SignalR.');
    } else {
      addMessage(`Failed to start room. ${result.error || 'Unknown error'}`);
    }
  };
  
  const nextQuestion = async () => {
    if (!roomId) {
        addMessage('Error: No Room ID available for next question.');
        return;
    }
    addMessage(`Attempting to advance to next question for room: ${roomId}`);
    const result = await callApi(`/api/Rooms/${roomId}/next-question`, 'POST');
    if (result.success) {
      addMessage('Advanced to next question. New question should be broadcast via SignalR.');
    } else {
      addMessage(`Failed to advance to next question. ${result.error || 'Unknown error'}`);
    }
  };
  
  const finishRoom = async () => {
    if (!roomId) {
        addMessage('Error: No Room ID available to finish.');
        return;
    }
    addMessage(`Attempting to finish room: ${roomId}`);
    const result = await callApi(`/api/Rooms/${roomId}/finish`, 'POST');
    if (result.success) {
      addMessage('Room finished successfully. Final results should be broadcast via SignalR.');
    } else {
      addMessage(`Failed to finish room. ${result.error || 'Unknown error'}`);
    }
  };

  const submitAnswer = async () => {
    if (!currentFlashcardId || !connection || isWaitingForAnswer || !roomId) {
        addMessage('Cannot submit answer: Invalid state (no flashcard ID, not connected, waiting for answer, or no room ID).');
        return;
    }
    
    addMessage(`Submitting answer "${answerText}" for flashcard ${currentFlashcardId} in room ${roomId}`);
    setIsWaitingForAnswer(true);
    
    try {
      await connection.invoke('SubmitAnswer', roomId.toString(), parseInt(currentFlashcardId, 10), answerText);
      addMessage('Answer submitted via SignalR. Waiting for result.');
    } catch (err) {
      addMessage(`Error submitting answer: ${err.message || err}`);
      setIsWaitingForAnswer(false);
    }
  };

  const handleAnswerKeyPress = (e) => {
    if (e.key === 'Enter' && !isWaitingForAnswer && currentFlashcardId && answerText.trim() && roomId) {
      submitAnswer();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, signalRMessages]); 

  useEffect(() => {
    return () => {
      if (connection) {
        connection.stop()
          .then(() => console.log('SignalR Connection stopped.'))
          .catch(err => console.error('Error stopping SignalR connection:', err));
      }
    };
  }, [connection]);

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const lobbyProps = {
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
  };

  const teacherProps = {
    navigateTo,
    roomId,
    startRoom,
    nextQuestion,
    finishRoom,
    leaderboard,
    messages, 
    signalRMessages, 
    roomParticipantsList 
  };

  const studentProps = {
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
    isRoomFinished 
  };

  return (
    <div>
      {currentPage === 'lobby' && <LobbyPage {...lobbyProps} />}
      {currentPage === 'teacher' && <TeacherPage {...teacherProps} />}
      {currentPage === 'student' && <StudentPage {...studentProps} />}
    </div>
  );
}