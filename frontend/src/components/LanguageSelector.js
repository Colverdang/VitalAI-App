import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import './LanguageSelector.css';

// List of supported languages with only native names
const LANGUAGES = [
  { name: 'English' },
  { name: 'isiZulu' },
  { name: 'isiXhosa' },
  { name: 'Sesotho' },
  { name: 'Setswana' },
  { name: 'Sepedi' },
  { name: 'siSwati' },
  { name: 'Tshivenda' },
  { name: 'Xitsonga' },
  { name: 'isiNdebele' },
  { name: 'Afrikaans' },
];

// LanguageSelector component allows users to select a language from a dropdown
const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  // State to control whether the dropdown is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Find the currently selected language object, default to the first language if not found
  const selectedLang = LANGUAGES.find(lang => lang.name === selectedLanguage) || LANGUAGES[0];

  // Handle language selection: call parent callback and close dropdown
  const handleLanguageSelect = (languageName) => {
    onLanguageChange(languageName);
    setIsOpen(false);
  };

  return (
    <div className="language-selector">
      {/* Button to trigger dropdown open/close */}
      <button 
        className="language-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe size={16} /> {/* Globe icon */}
        <span className="selected-language-text">{selectedLang.name}</span> {/* Current language name */}
        <ChevronDown size={16} className={`chevron ${isOpen ? 'rotate-180' : ''}`} /> {/* Dropdown arrow */}
      </button>

      {/* Dropdown menu with language options */}
      {isOpen && (
        <div className="language-dropdown">
          {LANGUAGES.map((language) => (
            <button
              key={language.name}
              className={`language-option ${selectedLanguage === language.name ? 'selected' : ''}`}
              onClick={() => handleLanguageSelect(language.name)}
              role="option"
              aria-selected={selectedLanguage === language.name}
            >
              <div className="language-info">
                <span className="language-native">{language.name}</span> {/* Native name only */}
              </div>
              {/* Indicator for selected language */}
              {selectedLanguage === language.name && (
                <div className="selected-indicator" aria-hidden="true"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;