/**
 * Force English Language Script
 * 
 * This script overrides any existing language settings and forces English
 * throughout the application. It can be imported and used in any component
 * that needs to ensure English is used.
 */

// Force English language in localStorage
const forceEnglishLanguage = () => {
  localStorage.setItem('selectedLanguage', 'en');
  
  // Look for other potential language keys and set them to English
  const possibleLanguageKeys = [
    'appLanguage',
    'language',
    'locale',
    'userLanguage',
    'interfaceLanguage'
  ];
  
  possibleLanguageKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.setItem(key, 'en');
    }
  });
  
  console.log('Language has been forced to English');
  return true;
};

// Run immediately on import
forceEnglishLanguage();

// Also export in case it needs to be called again
export default forceEnglishLanguage; 