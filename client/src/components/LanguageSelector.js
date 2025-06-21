import React, { useState, useEffect } from 'react';
import './LanguageSelector.css';

const LanguageSelector = ({ 
  isOpen, 
  onClose, 
  currentLanguage, 
  onLanguageChange,
  translations 
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLanguages, setFilteredLanguages] = useState([]);

  // Supported languages with native names and flags
  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      direction: 'ltr',
      region: 'Global'
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      direction: 'ltr',
      region: 'Europe'
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      direction: 'ltr',
      region: 'Europe'
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
      direction: 'ltr',
      region: 'Europe'
    },
    {
      code: 'it',
      name: 'Italian',
      nativeName: 'Italiano',
      flag: '🇮🇹',
      direction: 'ltr',
      region: 'Europe'
    },
    {
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      flag: '🇵🇹',
      direction: 'ltr',
      region: 'Europe'
    },
    {
      code: 'ru',
      name: 'Russian',
      nativeName: 'Русский',
      flag: '🇷🇺',
      direction: 'ltr',
      region: 'Europe'
    },
    {
      code: 'zh',
      name: 'Chinese (Simplified)',
      nativeName: '中文 (简体)',
      flag: '🇨🇳',
      direction: 'ltr',
      region: 'Asia'
    },
    {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      flag: '🇯🇵',
      direction: 'ltr',
      region: 'Asia'
    },
    {
      code: 'ko',
      name: 'Korean',
      nativeName: '한국어',
      flag: '🇰🇷',
      direction: 'ltr',
      region: 'Asia'
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      direction: 'rtl',
      region: 'Middle East'
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: '🇮🇳',
      direction: 'ltr',
      region: 'Asia'
    },
    {
      code: 'tr',
      name: 'Turkish',
      nativeName: 'Türkçe',
      flag: '🇹🇷',
      direction: 'ltr',
      region: 'Europe'
    },
    {
      code: 'nl',
      name: 'Dutch',
      nativeName: 'Nederlands',
      flag: '🇳🇱',
      direction: 'ltr',
      region: 'Europe'
    },
    {
      code: 'pl',
      name: 'Polish',
      nativeName: 'Polski',
      flag: '🇵🇱',
      direction: 'ltr',
      region: 'Europe'
    },
    {
      code: 'sv',
      name: 'Swedish',
      nativeName: 'Svenska',
      flag: '🇸🇪',
      direction: 'ltr',
      region: 'Europe'
    },
    {
      code: 'da',
      name: 'Danish',
      nativeName: 'Dansk',
      flag: '🇩🇰',
      direction: 'ltr',
      region: 'Europe'
    },
    {
      code: 'no',
      name: 'Norwegian',
      nativeName: 'Norsk',
      flag: '🇳🇴',
      direction: 'ltr',
      region: 'Europe'
    },
    {
      code: 'fi',
      name: 'Finnish',
      nativeName: 'Suomi',
      flag: '🇫🇮',
      direction: 'ltr',
      region: 'Europe'
    },
    {
      code: 'he',
      name: 'Hebrew',
      nativeName: 'עברית',
      flag: '🇮🇱',
      direction: 'rtl',
      region: 'Middle East'
    }
  ];

  // Group languages by region
  const languagesByRegion = languages.reduce((acc, lang) => {
    if (!acc[lang.region]) {
      acc[lang.region] = [];
    }
    acc[lang.region].push(lang);
    return acc;
  }, {});

  // Filter languages based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLanguages(languages);
    } else {
      const filtered = languages.filter(lang =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLanguages(filtered);
    }
  }, [searchTerm]);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.code);
  };

  const handleApplyLanguage = () => {
    onLanguageChange(selectedLanguage);
    onClose();
  };

  const handleCancel = () => {
    setSelectedLanguage(currentLanguage);
    onClose();
  };

  const getCurrentLanguageInfo = () => {
    return languages.find(lang => lang.code === selectedLanguage) || languages[0];
  };

  const currentLangInfo = getCurrentLanguageInfo();

  if (!isOpen) return null;

  return (
    <div className="language-selector-overlay" onClick={onClose}>
      <div className="language-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="language-selector-header">
          <button className="close-language-btn" onClick={onClose}>
            ×
          </button>
          <h2>🌍 Language Settings</h2>
          <p>Choose your preferred language for Debatize</p>
        </div>

        <div className="language-selector-content">
          {/* Search Bar */}
          <div className="language-search">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="language-search-input"
              />
            </div>
          </div>

          {/* Current Selection Preview */}
          <div className="current-selection">
            <h4>Current Selection</h4>
            <div className="selected-language-card">
              <div className="language-flag">{currentLangInfo.flag}</div>
              <div className="language-info">
                <div className="language-name">{currentLangInfo.name}</div>
                <div className="language-native">{currentLangInfo.nativeName}</div>
                <div className="language-direction">
                  {currentLangInfo.direction === 'rtl' ? 'Right-to-Left' : 'Left-to-Right'}
                </div>
              </div>
            </div>
          </div>

          {/* Language List */}
          <div className="language-list-container">
            <h4>Available Languages</h4>
            
            {searchTerm.trim() === '' ? (
              // Grouped by region
              Object.entries(languagesByRegion).map(([region, regionLanguages]) => (
                <div key={region} className="language-region">
                  <h5 className="region-title">{region}</h5>
                  <div className="region-languages">
                    {regionLanguages.map(language => (
                      <div
                        key={language.code}
                        className={`language-option ${selectedLanguage === language.code ? 'selected' : ''}`}
                        onClick={() => handleLanguageSelect(language)}
                      >
                        <div className="language-flag">{language.flag}</div>
                        <div className="language-details">
                          <div className="language-name">{language.name}</div>
                          <div className="language-native">{language.nativeName}</div>
                        </div>
                        <div className="language-direction-indicator">
                          {language.direction === 'rtl' ? 'RTL' : 'LTR'}
                        </div>
                        {selectedLanguage === language.code && (
                          <div className="selection-check">✓</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // Filtered results
              <div className="filtered-languages">
                {filteredLanguages.map(language => (
                  <div
                    key={language.code}
                    className={`language-option ${selectedLanguage === language.code ? 'selected' : ''}`}
                    onClick={() => handleLanguageSelect(language)}
                  >
                    <div className="language-flag">{language.flag}</div>
                    <div className="language-details">
                      <div className="language-name">{language.name}</div>
                      <div className="language-native">{language.nativeName}</div>
                      <div className="language-region">{language.region}</div>
                    </div>
                    <div className="language-direction-indicator">
                      {language.direction === 'rtl' ? 'RTL' : 'LTR'}
                    </div>
                    {selectedLanguage === language.code && (
                      <div className="selection-check">✓</div>
                    )}
                  </div>
                ))}
                {filteredLanguages.length === 0 && (
                  <div className="no-results">
                    <span className="no-results-icon">🔍</span>
                    <p>No languages found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Language Features */}
          <div className="language-features">
            <h4>Language Features</h4>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">🌐</span>
                <div className="feature-info">
                  <h5>Full Translation</h5>
                  <p>Complete interface translation</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <div className="feature-info">
                  <h5>Mobile Optimized</h5>
                  <p>Responsive design for all languages</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔤</span>
                <div className="feature-info">
                  <h5>RTL Support</h5>
                  <p>Right-to-left language support</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💾</span>
                <div className="feature-info">
                  <h5>Auto-Save</h5>
                  <p>Language preference saved automatically</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="language-actions">
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button 
              className="apply-btn" 
              onClick={handleApplyLanguage}
              disabled={selectedLanguage === currentLanguage}
            >
              Apply Language
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector; 