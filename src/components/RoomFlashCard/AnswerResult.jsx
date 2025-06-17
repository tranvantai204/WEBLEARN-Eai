import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AnswerResult = ({ lastAnswerResult }) => {
  const { translateText } = useLanguage(); 
  if (!lastAnswerResult) return null;

  const isCorrect = lastAnswerResult.isCorrect;

  return (
    <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
      {/* Animated Result Header */}
      <div
        className={`position-relative p-4 text-center text-white ${
          isCorrect ? 'bg-success' : 'bg-danger'
        }`}
        style={{
          background: isCorrect
            ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
            : 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)'
        }}
      >
        {/* Background Pattern */}
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10">
          <div className="position-absolute top-0 end-0 rounded-circle bg-white"
               style={{ width: '100px', height: '100px', transform: 'translate(30px, -30px)' }}>
          </div>
          <div className="position-absolute bottom-0 start-0 rounded-circle bg-white"
               style={{ width: '60px', height: '60px', transform: 'translate(-20px, 20px)' }}>
          </div>
        </div>

        <div className="position-relative">
          {/* Main Result Icon & Text */}
          <div className="mb-3">
            <div className="display-1 mb-2" style={{ fontSize: '4rem' }}>
              {isCorrect ? '🎉' : '😞'}
            </div>
            <h2 className="display-5 fw-bold mb-0 text-white">
              {isCorrect ? translateText('Correct!') : translateText('Incorrect!')}
            </h2>
            <p className="mb-0 opacity-75">
              {isCorrect ? translateText('Great! You answered correctly') : translateText('Don\'t worry, try again next time')}
            </p>
          </div>

          {/* Score Display */}
          <div className="d-inline-flex align-items-center px-4 py-2 bg-white bg-opacity-20 rounded-pill">
            <span className="fs-4 fw-bold text-white">
              <i className="fas fa-star me-2"></i>
              {translateText('Score')}: {lastAnswerResult.newScore}
            </span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="card-body p-4">
        {/* Correct Answer Section */}
        {!isCorrect && lastAnswerResult.correctAnswer && (
          <div className="mb-4">
            <div className="row align-items-center">
              <div className="col-auto">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <i className="fas fa-lightbulb text-primary fs-4"></i>
                </div>
              </div>
              <div className="col">
                <h4 className="h5 fw-bold text-dark mb-1">{translateText('Correct Answer')}</h4>
                <p className="mb-0">
                  <span className="badge bg-primary fs-6 px-3 py-2" style={{ borderRadius: '12px' }}>
                    {lastAnswerResult.correctAnswer}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Game Completion */}
        {!lastAnswerResult.nextQuestion && (
          <div
            className="text-center p-4 rounded-4 position-relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
              border: '3px solid #ffd700'
            }}
          >
            {/* Sparkle Animation Background */}
            <div className="position-absolute top-0 start-0 w-100 h-100">
              <div className="position-absolute text-warning opacity-50"
                   style={{ top: '10px', left: '20px', fontSize: '1.5rem' }}>✨</div>
              <div className="position-absolute text-warning opacity-50"
                   style={{ top: '20px', right: '30px', fontSize: '1rem' }}>⭐</div>
              <div className="position-absolute text-warning opacity-50"
                   style={{ bottom: '15px', left: '40px', fontSize: '1.2rem' }}>🌟</div>
              <div className="position-absolute text-warning opacity-50"
                   style={{ bottom: '25px', right: '15px', fontSize: '1.8rem' }}>✨</div>
            </div>

            <div className="position-relative">
              <div className="display-4 mb-3">🏆</div>
              <h3 className="h4 fw-bold text-dark mb-2">{translateText('Excellent!')}</h3>
              <p className="text-dark mb-0 fw-semibold">
                {translateText('You have completed all questions!')}
              </p>
            </div>
          </div>
        )}

        {/* Next Question Indicator */}
        {lastAnswerResult.nextQuestion && (
          <div className="text-center mt-3">
            <div className="d-inline-flex align-items-center px-3 py-2 bg-light rounded-pill">
              <div className="spinner-grow spinner-grow-sm text-primary me-2" role="status">
                <span className="visually-hidden">{translateText('Loading...')}</span>
              </div>
              <span className="text-muted">{translateText('Preparing next question...')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="card-footer bg-transparent border-0 px-4 pb-4">
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted me-2">{translateText('Recent result')}</small>
          <div className={`badge ${isCorrect ? 'bg-success' : 'bg-danger'} px-3 py-2`}
               style={{ borderRadius: '12px' }}>
            {isCorrect ? translateText('Correct') : translateText('Incorrect')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerResult;