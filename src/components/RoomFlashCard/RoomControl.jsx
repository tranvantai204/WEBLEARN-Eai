import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../contexts/LanguageContext';

const RoomControl = ({
  roomId,
  startRoom,
  nextQuestion,
  finishRoom,
  navigateToStudentPage 
}) => {
  const { translateText } = useLanguage(); 

  return (
    <div className="shadow-sm p-4 mb-4 rounded-4 border-0 room-control-card">
      <div className="row row-cols-1 row-cols-md-3 g-3 justify-content-center">
        <div className="col">
          <button
            type="button"
            className="btn btn-success btn-lg w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 room-btn"
            onClick={startRoom}
            disabled={!roomId}
          >
            <FontAwesomeIcon icon={faPlay} />
            {translateText('Start Room')}
          </button>
        </div>
        {/* <div className="col">
          <button
            type="button"
            className="btn btn-primary btn-lg w-100 stat-icon"
            onClick={nextQuestion}
            disabled
          >
            {translateText('Next Question')}
          </button>
        </div> */}

        <div className="col">
          <button
            type="button"
            className="btn btn-danger btn-lg w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 room-btn"
            onClick={finishRoom}
            disabled={!roomId}
          >
            <FontAwesomeIcon icon={faStop} />
            {translateText('End Room')}
          </button>
        </div>

        <div className="col">
          <button
            type="button"
            className="btn btn-info btn-lg w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 room-btn"
            onClick={navigateToStudentPage} 
          >
            <FontAwesomeIcon icon={faUserGraduate} />
            {translateText('View Student Page')}
          </button>
        </div>

      </div>
    </div>
  );
};

export default RoomControl;