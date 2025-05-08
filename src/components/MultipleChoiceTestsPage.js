import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultipleChoiceTest } from '../contexts/MultipleChoiceTestContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FaPlus, FaEye, FaEdit, FaTrash, FaLock, FaLockOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';
import "../css/components/MultipleChoiceTests.css";

const MultipleChoiceTestsPage = () => {
  const navigate = useNavigate();
  const { translateText } = useLanguage();
  const { user } = useAuth();
  const {
    multipleChoiceTests,
    loading,
    error,
    totalPages,
    currentPage,
    getAllMultipleChoiceTests,
    deleteMultipleChoiceTest,
    togglePublicStatus
  } = useMultipleChoiceTest();
  
  const [selectedLanguage, setSelectedLanguage] = useState('');
  
  useEffect(() => {
    // Fetch user's multiple choice tests on component mount
    if (user && user.userId) {
      getAllMultipleChoiceTests(user.userId);
    }
  }, [user, getAllMultipleChoiceTests]);

  const handlePageChange = (page) => {
    if (user && user.userId) {
      getAllMultipleChoiceTests(user.userId, page);
    }
  };

  const handleCreateTest = () => {
    navigate('/readings/multiple-choice/create');
  };

  const handleViewTest = (testId) => {
    navigate(`/readings/test/${testId}`);
  };

  const handleEditTest = (testId) => {
    navigate(`/readings/multiple-choice/edit/${testId}`);
  };

  const handleDeleteTest = async (testId) => {
    if (window.confirm(translateText('Are you sure you want to delete this test?'))) {
      try {
        await deleteMultipleChoiceTest(testId);
        toast.success(translateText('Test deleted successfully'));
      } catch (err) {
        toast.error(translateText('Failed to delete test'));
      }
    }
  };

  const handleToggleVisibility = async (testId, isCurrentlyPublic) => {
    try {
      await togglePublicStatus(testId);
      toast.success(translateText('Test visibility status has been changed'));
    } catch (err) {
      toast.error(translateText('Failed to change test visibility'));
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      // Return formatted date as "MMM DD, YYYY" using JavaScript's built-in formatting
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (err) {
      return dateString;
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="multiple-choice-tests-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>{translateText('Loading tests...')}</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="multiple-choice-tests-container">
        <div className="error-message">
          <h3>{translateText('Error')}</h3>
          <p>{error}</p>
          <button 
            onClick={() => user && user.userId && getAllMultipleChoiceTests(user.userId)}
            className="retry-button"
          >
            {translateText('Retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="multiple-choice-tests-container">
      <div className="multiple-choice-tests-header">
        <h1>{translateText('My Multiple Choice Tests')}</h1>
        <div className="header-buttons">
          <button 
            className="done-button"
            onClick={() => window.location.href = '/readings'}
          >
            {translateText('Done')}
          </button>
          <button 
            className="create-test-button"
            onClick={handleCreateTest}
          >
            <FaPlus /> {translateText('Create New Test')}
          </button>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="language-filter">{translateText('Filter by Language')}:</label>
          <select
            id="language-filter"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="">{translateText('All Languages')}</option>
            <option value="ENG">English</option>
            <option value="ESP">Spanish</option>
            <option value="FRA">French</option>
            <option value="DEU">German</option>
            <option value="ITA">Italian</option>
            <option value="POR">Portuguese</option>
            <option value="VIE">Vietnamese</option>
            {/* Add more language options as needed */}
          </select>
        </div>
      </div>

      {multipleChoiceTests.length === 0 ? (
        <div className="no-tests">
          <p>{translateText('You have not created any multiple choice tests yet.')}</p>
          <button 
            className="create-first-button"
            onClick={handleCreateTest}
          >
            {translateText('Create Your First Test')}
          </button>
        </div>
      ) : (
        <>
          <div className="tests-list">
            <table>
              <thead>
                <tr>
                  <th>{translateText('Title')}</th>
                  <th>{translateText('Learning Language')}</th>
                  <th>{translateText('Native Language')}</th>
                  <th>{translateText('Created')}</th>
                  <th>{translateText('Visibility')}</th>
                  <th>{translateText('Learners')}</th>
                  <th>{translateText('Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {multipleChoiceTests
                  .filter(test => !selectedLanguage || test.learningLanguage === selectedLanguage)
                  .map(test => (
                    <tr key={test.multipleChoiceTestId}>
                      <td>{test.title}</td>
                      <td>{test.learningLanguage}</td>
                      <td>{test.nativeLanguage}</td>
                      <td>{formatDate(test.createAt)}</td>
                      <td>
                        <button
                          className={`visibility-button ${test.isPublic ? 'public' : 'private'}`}
                          onClick={() => handleToggleVisibility(test.multipleChoiceTestId, test.isPublic)}
                          title={test.isPublic ? translateText('Public - Visibility status can be changed') : translateText('Private - Visibility status can be changed')}
                        >
                          {test.isPublic ? <FaLockOpen /> : <FaLock />}
                          {test.isPublic ? translateText('Public') : translateText('Private')}
                        </button>
                      </td>
                      <td>{test.learnerCount}</td>
                      <td className="actions">
                        <button
                          onClick={() => handleViewTest(test.multipleChoiceTestId)}
                          className="action-button view"
                          title={translateText('View Test')}
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEditTest(test.multipleChoiceTestId)}
                          className="action-button edit"
                          title={translateText('Edit Test')}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteTest(test.multipleChoiceTestId)}
                          className="action-button delete"
                          title={translateText('Delete Test')}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="pagination-button"
              >
                &laquo; {translateText('Previous')}
              </button>
              
              <span className="page-info">
                {translateText('Page {{current}} of {{total}}').replace('{{current}}', currentPage).replace('{{total}}', totalPages)}
              </span>
              
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="pagination-button"
              >
                {translateText('Next')} &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MultipleChoiceTestsPage; 