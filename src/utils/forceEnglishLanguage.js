/**
 * Language Utility
 *
 * This utility provides functions to manage the user's language preferences
 * in the application.
 */

/**
 * Gets the user's selected language from localStorage
 * @returns {string} Language code, defaults to 'en'
 */
export const getSelectedLanguage = () => {
  try {
    return localStorage.getItem('selectedLanguage') || 'en';
  } catch (error) {
    console.error('Error getting language from localStorage:', error);
    return 'en';
  }
};

/**
 * Sets the language in localStorage
 * @param {string} langCode - The language code to set
 * @returns {boolean} True if successful
 */
export const setLanguageInLocalStorage = (langCode) => {
  try {
    if (!langCode || (langCode !== 'en' && langCode !== 'vi')) {
      langCode = 'en'; // Default to English for invalid codes
    }
    
    localStorage.setItem('selectedLanguage', langCode);
    console.log(`Language settings in localStorage set to ${langCode}`);
    return true;
  } catch (error) {
    console.error('Error setting language in localStorage:', error);
    return false;
  }
};

/**
 * Updates the language context with the user's selected language
 * @param {function} changeLanguage - The changeLanguage function from LanguageContext
 * @param {string} langCode - The language code to set
 * @returns {boolean} True if successful
 */
export const updateLanguageContext = (changeLanguage, langCode = null) => {
  try {
    if (typeof changeLanguage === 'function') {
      // If no langCode provided, get from localStorage
      if (!langCode) {
        langCode = getSelectedLanguage();
      }
      
      // Only allow English or Vietnamese
      if (langCode !== 'en' && langCode !== 'vi') {
        langCode = 'en';
      }
      
      changeLanguage(langCode);
      console.log(`Language context updated to ${langCode}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating language context:', error);
    return false;
  }
};

/**
 * Legacy function - now just respects user's language choice
 * @param {function} changeLanguage - Optional changeLanguage function from LanguageContext
 * @param {boolean} reload - Whether to reload the page after changes
 * @returns {boolean} True if successful
 */
export const forceEnglishLanguage = (changeLanguage = null, reload = false) => {
  const langCode = getSelectedLanguage();
  let success = true;
  
  if (changeLanguage) {
    success = updateLanguageContext(changeLanguage, langCode);
  }
  
  if (reload) {
    // Add a small delay to ensure localStorage changes are saved
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
  
  return success;
};

// Default export for simple usage
export default forceEnglishLanguage; 