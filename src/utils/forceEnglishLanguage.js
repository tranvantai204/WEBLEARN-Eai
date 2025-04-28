/**
 * Force English Language Utility
 *
 * This utility provides functions to ensure the application displays in English,
 * regardless of the user's language settings or saved preferences.
 */

/**
 * Sets all language-related localStorage items to English
 * @returns {boolean} True if successful
 */
export const setEnglishInLocalStorage = () => {
  try {
    // Primary language key used by the application
    localStorage.setItem('selectedLanguage', 'en');
    
    // Check for other potential language keys and set them to English
    const possibleLanguageKeys = [
      'appLanguage',
      'language',
      'locale',
      'userLanguage',
      'interfaceLanguage',
      'translateOnlyHome',
      'preferredLanguage'
    ];
    
    possibleLanguageKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.setItem(key, 'en');
      }
    });
    
    console.log('Language settings in localStorage set to English');
    return true;
  } catch (error) {
    console.error('Error setting English in localStorage:', error);
    return false;
  }
};

/**
 * Updates the language context to English and refreshes components
 * @param {function} changeLanguage - The changeLanguage function from LanguageContext
 * @returns {boolean} True if successful
 */
export const updateLanguageContext = (changeLanguage) => {
  try {
    if (typeof changeLanguage === 'function') {
      changeLanguage('en');
      console.log('Language context updated to English');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating language context:', error);
    return false;
  }
};

/**
 * Force English language across the app (comprehensive approach)
 * @param {function} changeLanguage - Optional changeLanguage function from LanguageContext
 * @param {boolean} reload - Whether to reload the page after changes
 * @returns {boolean} True if successful
 */
export const forceEnglishLanguage = (changeLanguage = null, reload = false) => {
  let success = setEnglishInLocalStorage();
  
  if (changeLanguage) {
    success = updateLanguageContext(changeLanguage) && success;
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