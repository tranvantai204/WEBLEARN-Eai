import React from 'react';
import './CSS/Leaderboard.css';
import { useLanguage } from '../../contexts/LanguageContext';

const Leaderboard = ({ leaderboard, totalQuestions = 10, isCompact = false }) => {
  const { translateText } = useLanguage(); // Thêm dòng này

  if (!leaderboard || leaderboard.length === 0) return null;

  return (
    <div className={`leaderboard leaderboard-container enhanced-card ${isCompact ? 'compact' : 'full'}`}>
      <h2 className="leaderboard-title">
        {isCompact ? translateText('🏆 Leaderboard') : translateText('Live Leaderboard')}
      </h2>

      {isCompact ? (
        <div className="compact-leaderboard">
          {leaderboard.slice(0, 5).map((entry, index) => {
            const correctAnswers = Math.round(entry.score / 10);
            return (
              <div
                key={entry.userId || index}
                className={`leaderboard-item ${index === 0 ? 'winner' : ''} rank-${index + 1}`}
              >
                <div className="player-info">
                  <span className="rank-icon">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </span>
                  <span className="player-name">{entry.username}</span>
                </div>
                <div className="score-info">
                  <div className="score-main">{entry.score} {translateText('points')}</div>
                  <div className="score-detail">{correctAnswers} {translateText('correct answers')}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="full-leaderboard">
          <div className="table-container">
            {/* Thay thế table bằng div grid layout */}
            <div className="grid-layout">
              {/* Header */}
              <div className="grid-header">
                <div className="col-rank">{translateText('Rank')}</div>
                <div className="col-name">{translateText('Student')}</div>
                <div className="col-score">{translateText('Score')}</div>
                <div className="col-correct">{translateText('Correct')}</div>
                <div className="col-percentage">{translateText('Percentage')}</div>
              </div>

              {/* Data rows */}
              <div className="grid-body">
                {leaderboard.map((entry, index) => {
                  const correctAnswers = Math.round(entry.score / 10);
                  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

                  return (
                    <div
                      key={entry.userId || index}
                      className={`grid-row ${index === 0 ? 'winner-row' : ''} rank-${index + 1}`}
                    >
                      <div className="rank-cell">
                        <span className="rank-display">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                        </span>
                      </div>

                      <div className="name-cell">
                        {entry.username}
                      </div>

                      <div className="score-cell">
                        {entry.score}
                      </div>

                      <div className="correct-cell">
                        {correctAnswers}
                      </div>

                      <div className="percentage-cell">
                        <div className="progress-container">
                          <div
                            className="progress-bar"
                            style={{width: `${percentage}%`}}
                          ></div>
                          <span className="progress-text">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;