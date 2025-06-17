import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const QuestionPanel = ({
  currentQuestion,
  answerText,
  setAnswerText,
  handleAnswerKeyPress,
  isWaitingForAnswer,
  submitAnswer,
  currentFlashcardId
}) => {
  const { translateText } = useLanguage(); 

  if (!currentQuestion) {
    return (
      <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
        <div
          className="card-body text-center p-5"
          style={{
            background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
            position: 'relative'
          }}
        >
          {/* Background decoration */}
          <div className="position-absolute top-0 end-0 opacity-10">
            <div className="rounded-circle bg-primary"
                 style={{ width: '120px', height: '120px', transform: 'translate(40px, -40px)' }}>
            </div>
          </div>
          <div className="position-absolute bottom-0 start-0 opacity-10">
            <div className="rounded-circle bg-secondary"
                 style={{ width: '80px', height: '80px', transform: 'translate(-30px, 30px)' }}>
            </div>
          </div>

          <div className="position-relative">
            {/* Animated waiting icon */}
            <div className="mb-4" style={{ fontSize: '5rem' }}>
              <span className="d-inline-block" style={{ animation: 'bounce 2s infinite' }}>🎯</span>
            </div>
            <h2 className="h2 fw-bold text-primary mb-3">{translateText('Waiting for Next Question')}</h2>
            <p className="text-muted fs-5 mb-4">{translateText('The teacher will start the game soon!')}</p>

            {/* Loading dots animation */}
            <div className="d-flex justify-content-center align-items-center gap-2">
              <div className="spinner-grow spinner-grow-sm text-primary" role="status">
                <span className="visually-hidden">{translateText('Loading...')}</span>
              </div>
              <div className="spinner-grow spinner-grow-sm text-success" role="status" style={{ animationDelay: '0.2s' }}>
                <span className="visually-hidden">{translateText('Loading...')}</span>
              </div>
              <div className="spinner-grow spinner-grow-sm text-warning" role="status" style={{ animationDelay: '0.4s' }}>
                <span className="visually-hidden">{translateText('Loading...')}</span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `}</style>
      </div>
    );
  }

  const isButtonDisabled = isWaitingForAnswer || !currentFlashcardId || !answerText.trim();

  return (
    <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
      {/* Header Section */}
      <div
        className="card-header border-0 text-center py-4 position-relative text-white"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        {/* Background pattern */}
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10">
          <div className="position-absolute top-0 end-0 rounded-circle bg-white"
               style={{ width: '80px', height: '80px', transform: 'translate(25px, -25px)' }}>
          </div>
          <div className="position-absolute bottom-0 start-0 rounded-circle bg-white"
               style={{ width: '50px', height: '50px', transform: 'translate(-15px, 15px)' }}>
          </div>
        </div>

        <div className="position-relative">
          <div className="d-flex align-items-center justify-content-center mb-2">
            <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
              <i className="fas fa-question-circle fs-4 text-white"></i>
            </div>
            <h2 className="h3 fw-bold mb-0 text-white">{translateText('Question')}</h2>
          </div>
          <div className="small opacity-75 ms-4">{translateText('Read carefully and answer correctly!')}</div>
        </div>
      </div>

      {/* Question Content */}
      <div className="card-body p-0">
        {/* Question Display */}
        <div className="p-4 mb-4">
          <div
            className="position-relative p-4 rounded-4 text-center"
            style={{
              background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%)',
              border: '2px solid #e3f2fd'
            }}
          >
            {/* Question mark decoration */}
            <div className="position-absolute top-0 end-0 opacity-20">
              <div className="fs-1 text-primary" style={{ transform: 'translate(10px, -10px)' }}>❓</div>
            </div>

            <div className="position-relative">
              <div className="fs-2 fw-bold text-primary mb-3" style={{ lineHeight: '1.3' }}>
                {currentQuestion.questionText}
              </div>

              {currentQuestion.exampleSentence && (
                <div className="mt-3 p-3 bg-white bg-opacity-60 rounded-3 border-start border-4 border-info">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-lightbulb text-warning me-2"></i>
                    <small className="fw-semibold text-muted">{translateText('EXAMPLE')}</small>
                  </div>
                  <div className="fs-5 text-secondary fst-italic">
                    {currentQuestion.exampleSentence}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Answer Input Section */}
        <div className="px-4 pb-4">
          <div className="row g-3">
            <div className="col-12 col-md-8">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control form-control-lg fs-4 text-center border-2"
                  style={{
                    borderRadius: '15px',
                    borderColor: answerText.trim() ? '#28a745' : '#dee2e6',
                    boxShadow: answerText.trim() ? '0 0 0 0.2rem rgba(40, 167, 69, 0.25)' : 'none',
                    padding: '15px 20px'
                  }}
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  onKeyPress={handleAnswerKeyPress}
                  placeholder={translateText('Type your answer...')}
                  disabled={isWaitingForAnswer}
                />
                {answerText.trim() && (
                  <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                    <i className="fas fa-check-circle text-success fs-5"></i>
                  </div>
                )}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <button
                type="button"
                className={`btn btn-lg fw-bold w-100 d-flex align-items-center justify-content-center gap-2 ${
                  isButtonDisabled
                    ? 'btn-secondary'
                    : 'btn-success'
                }`}
                style={{
                  borderRadius: '15px',
                  padding: '15px 20px',
                  background: !isButtonDisabled ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' : undefined,
                  border: 'none',
                  boxShadow: !isButtonDisabled ? '0 4px 15px rgba(40, 167, 69, 0.3)' : 'none'
                }}
                onClick={submitAnswer}
                disabled={isButtonDisabled}
              >
                {isWaitingForAnswer ? (
                  <>
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">{translateText('Loading...')}</span>
                    </div>
                    <span>{translateText('Submitting...')}</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    <span>{translateText('Submit Answer')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Waiting Status */}
          {isWaitingForAnswer && (
            <div className="text-center mt-4">
              <div
                className="d-inline-flex align-items-center gap-3 px-4 py-3 rounded-pill"
                style={{
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                  border: '2px solid #e1f5fe'
                }}
              >
                <div className="d-flex gap-1">
                  <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px', animation: 'pulse 1.5s infinite' }}></div>
                  <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px', animation: 'pulse 1.5s infinite 0.3s' }}></div>
                  <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px', animation: 'pulse 1.5s infinite 0.6s' }}></div>
                </div>
                <span className="fw-semibold text-primary">
                  {translateText('Processing your answer...')}
                </span>
              </div>
            </div>
          )}

          {/* Helper Text */}
          <div className="text-center mt-3">
            <small className="text-muted">
              <i className="fas fa-info-circle me-1"></i>
              {translateText('Press Enter or click "Submit Answer" to answer')}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPanel;