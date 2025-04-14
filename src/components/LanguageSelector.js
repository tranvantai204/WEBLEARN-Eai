import React, { useState, useEffect, useRef } from 'react';
import { getLanguageOptions } from '../utils/countriesAPI';
import '../css/components/LanguageSelector.css';

/**
 * An enhanced language selector component with flags
 * @param {Object} props - Component props
 * @param {string} props.id - Input id attribute
 * @param {string} props.name - Input name attribute
 * @param {string} props.value - Selected value
 * @param {function} props.onChange - Change handler function
 * @param {string} props.label - Label text (optional)
 * @param {boolean} props.required - If the field is required (optional)
 * @param {string} props.error - Error message (optional)
 */
function LanguageSelector({ 
  id, 
  name, 
  value, 
  onChange, 
  label, 
  required = false, 
  error 
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);
  const selectorRef = useRef(null);

  // Fetch language options on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const languageOptions = await getLanguageOptions();
        setOptions(languageOptions);
        
        // Find and set the selected option based on value
        if (value) {
          const selected = languageOptions.find(option => option.value === value);
          setSelectedOption(selected || null);
        }
      } catch (error) {
        console.error('Error loading language options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    
    // Create synthetic event to mimic native select
    const syntheticEvent = {
      target: {
        name,
        value: option.value
      }
    };
    
    onChange(syntheticEvent);
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    if (!loading) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div 
      className={`language-selector ${isOpen ? 'language-selector--open' : ''} ${loading ? 'language-selector--loading' : ''}`}
      ref={selectorRef}
    >
      {label && (
        <label htmlFor={id} className="language-selector__label">
          {label} {required && <span className="language-selector__required">*</span>}
        </label>
      )}
      
      <div 
        className="language-selector__select-wrapper" 
        onClick={toggleDropdown}
      >
        <div className="language-selector__current-selection">
          {selectedOption ? selectedOption.label : 'Select language'}
        </div>
        
        {/* Hide the actual select element but keep it for form submission */}
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="language-selector__hidden-select"
          aria-hidden="true"
          tabIndex="-1"
        >
          <option value="">Select language</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {selectedOption && (
          <div className="language-selector__flag-wrapper">
            <img 
              src={selectedOption.flag} 
              alt={`${selectedOption.label} flag`} 
              className="language-selector__flag"
            />
          </div>
        )}
      </div>
      
      {error && (
        <div className="language-selector__error">
          {error}
        </div>
      )}
      
      {isOpen && (
        <div className="language-selector__dropdown" ref={dropdownRef}>
          <div className="language-selector__search">
            <input
              type="text"
              className="language-selector__search-input"
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="language-selector__options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  className={`language-selector__option ${selectedOption?.value === option.value ? 'language-selector__option--selected' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <img
                    src={option.flag}
                    alt={`${option.label} flag`}
                    className="language-selector__flag"
                  />
                  <span className="language-selector__option-label">{option.label}</span>
                </div>
              ))
            ) : (
              <div className="language-selector__no-results">
                No languages found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSelector; 