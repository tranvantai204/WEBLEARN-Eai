import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import '../../css/components/ExploreSection.css';

/**
 * ExploreSection component - Shows explore links for authenticated users
 * @param {Object} props
 * @param {string} props.type - The type of content (flashcards, readings, writing)
 */
const ExploreSection = ({ type }) => {
  const { translateText } = useLanguage();
  
  let title = '';
  let description = '';
  let icon = '';
  let link = '';
  let linkText = '';
  
  switch (type) {
    case 'flashcards':
      title = translateText('Explore Public Flashcards');
      description = translateText('Discover flashcard sets created by other users to expand your vocabulary.');
      icon = 'fas fa-globe';
      link = '/flashcards/explore';
      linkText = translateText('Browse Public Flashcards');
      break;
    case 'readings':
      title = translateText('Explore Public Reading Tests');
      description = translateText('Find reading comprehension tests shared by other learners.');
      icon = 'fas fa-globe';
      link = '/readings/tests/explore';
      linkText = translateText('Browse Public Tests');
      break;
    case 'writing':
      title = translateText('Explore Public Writing Exercises');
      description = translateText('Discover writing exercises created by other users to improve your skills.');
      icon = 'fas fa-globe';
      link = '/writing/explore';
      linkText = translateText('Browse Public Writing Exercises');
      break;
    default:
      title = translateText('Explore Content');
      description = translateText('Find public learning materials shared by other users.');
      icon = 'fas fa-compass';
      link = '/discover';
      linkText = translateText('Explore');
  }
  
  return (
    <div className="explore-section">
      <div className="explore-content">
        <div className="explore-icon">
          <i className={icon}></i>
        </div>
        <div className="explore-info">
          <h3>{title}</h3>
          <p>{description}</p>
          <Link to={link} className="explore-link">
            {linkText} <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExploreSection; 