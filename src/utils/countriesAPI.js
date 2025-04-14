// Utility to fetch and manage countries data
const API_URL = 'https://open.oapi.vn/location/countries';
const CACHE_KEY = 'countries_data_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Get countries data from API or cache
 * @returns {Promise<Array>} Array of country objects with id, name, niceName, iso, iso3, flag
 */
export const getCountriesData = async () => {
  try {
    // Check if we have cached data that's not expired
    const cachedData = localStorage.getItem(CACHE_KEY);
    
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const now = Date.now();
      
      // If cache is still valid, return the cached data
      if (now - timestamp < CACHE_EXPIRY) {
        return data;
      }
    }
    
    // If no valid cache, fetch from API
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.code !== 'success') {
      throw new Error('API returned an error');
    }
    
    // Cache the data with timestamp
    localStorage.setItem(
      CACHE_KEY, 
      JSON.stringify({
        data: result.data,
        timestamp: Date.now()
      })
    );
    
    return result.data;
  } catch (error) {
    console.error('Error fetching countries data:', error);
    // Return empty array if fetch fails
    return [];
  }
};

/**
 * Format countries data as language options for select inputs
 * @returns {Promise<Array>} Array of language options { value, label, flag }
 */
export const getLanguageOptions = async () => {
  try {
    const countries = await getCountriesData();
    
    return countries.map(country => ({
      value: country.iso,
      label: country.niceName,
      flag: country.flag
    }));
  } catch (error) {
    console.error('Error formatting language options:', error);
    
    // Return default language options if there's an error
    return [
      { value: 'ENG', label: 'English' },
      { value: 'VIE', label: 'Vietnamese' },
      { value: 'JP', label: 'Japanese' },
      { value: 'KR', label: 'Korean' },
      { value: 'FR', label: 'French' },
      { value: 'CN', label: 'Chinese' },
      { value: 'DE', label: 'German' },
      { value: 'ES', label: 'Spanish' }
    ];
  }
}; 