/**
 * Language Debugging Utility
 * 
 * This utility provides functions to help diagnose language-related issues
 * in the application. It can be loaded in the browser console to analyze
 * and fix language settings.
 */

/**
 * Gets all language-related localStorage items
 * @returns {Object} An object containing all language settings
 */
export const getLanguageSettings = () => {
  const settings = {};
  
  // All possible language keys
  const languageKeys = [
    'selectedLanguage',
    'appLanguage',
    'language',
    'locale',
    'userLanguage',
    'interfaceLanguage',
    'translateOnlyHome',
    'preferredLanguage'
  ];
  
  // Get all language-related items from localStorage
  languageKeys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      settings[key] = value;
    }
  });
  
  return settings;
};

/**
 * Prints all language-related localStorage items to console
 */
export const showLanguageSettings = () => {
  const settings = getLanguageSettings();
  console.log('Current language settings in localStorage:', settings);
  console.log('Number of language settings found:', Object.keys(settings).length);
  return settings;
};

/**
 * Checks if any non-English language settings exist
 * @returns {boolean} True if any non-English settings exist
 */
export const hasNonEnglishSettings = () => {
  const settings = getLanguageSettings();
  
  for (const key in settings) {
    const value = settings[key];
    if (value && value !== 'en' && value !== 'english') {
      console.log(`Found non-English setting: ${key} = ${value}`);
      return true;
    }
  }
  
  return false;
};

/**
 * Clears all language-related localStorage items
 */
export const clearAllLanguageSettings = () => {
  const languageKeys = [
    'selectedLanguage',
    'appLanguage',
    'language',
    'locale',
    'userLanguage',
    'interfaceLanguage',
    'translateOnlyHome',
    'preferredLanguage'
  ];
  
  languageKeys.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log('All language settings cleared from localStorage');
};

// Export an object with all functions for easy console use
const languageDebugger = {
  getLanguageSettings,
  showLanguageSettings,
  hasNonEnglishSettings,
  clearAllLanguageSettings
};

// Make it available globally when this script is loaded directly
if (typeof window !== 'undefined') {
  window.languageDebugger = languageDebugger;
}

export default languageDebugger; 