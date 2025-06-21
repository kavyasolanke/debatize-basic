import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../services/TranslationService';
import './LanguageSelector.css';

const LanguageSelector = ({ onClose }) => {
  const { currentLanguage, changeLanguage, getAvailableLanguages, getLanguageInfo } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [activeFilter, setActiveFilter] = useState('all');

  const languages = getAvailableLanguages();
  const languageInfo = getLanguageInfo();

  // Filter languages based on search and active filter
  const filteredLanguages = useMemo(() => {
    let filtered = languages;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lang => {
        const info = languageInfo[lang];
        return (
          info.name.toLowerCase().includes(query) ||
          info.nativeName.toLowerCase().includes(query) ||
          lang.toLowerCase().includes(query)
        );
      });
    }

    // Apply region filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(lang => {
        const info = languageInfo[lang];
        return info.region === activeFilter;
      });
    }

    return filtered;
  }, [languages, searchQuery, activeFilter, languageInfo]);

  // Get unique regions for filter
  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(languages.map(lang => languageInfo[lang]?.region).filter(Boolean))];
    return uniqueRegions.sort();
  }, [languages, languageInfo]);

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
  };

  const handleApplyLanguage = () => {
    if (selectedLanguage !== currentLanguage) {
      changeLanguage(selectedLanguage);
    }
    onClose();
  };

  const handleClose = () => {
    setSelectedLanguage(currentLanguage);
    onClose();
  };

  const getSelectedLanguageInfo = () => {
    return languageInfo[selectedLanguage] || {};
  };

  return (
    <div className="language-selector-overlay" onClick={handleClose}>
      <div className="language-selector-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="language-selector-header">
          <button className="close-language-btn" onClick={handleClose}>
            ×
          </button>
          <h2>Select Language</h2>
          <p>Choose your preferred language for Debatize</p>
        </div>

        <div className="language-selector-content">
          {/* Search Bar */}
          <div className="language-search">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="language-search-input"
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Region Filters */}
          <div className="region-filters">
            <button
              className={`region-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              🌍 All Regions
            </button>
            {regions.map(region => (
              <button
                key={region}
                className={`region-filter-btn ${activeFilter === region ? 'active' : ''}`}
                onClick={() => setActiveFilter(region)}
              >
                {getRegionIcon(region)} {region}
              </button>
            ))}
          </div>

          {/* Language Grid */}
          <div className="language-grid">
            {filteredLanguages.map(lang => {
              const info = languageInfo[lang];
              const isSelected = lang === selectedLanguage;
              
              return (
                <div
                  key={lang}
                  className={`language-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleLanguageSelect(lang)}
                >
                  <div className="language-flag">{info?.flag || '🌐'}</div>
                  <div className="language-info">
                    <div className="language-name">{info?.name || lang}</div>
                    <div className="language-native">{info?.nativeName || lang}</div>
                    <div className="language-region">{info?.region || 'Unknown'}</div>
                  </div>
                  {isSelected && <div className="selected-indicator">✓</div>}
                </div>
              );
            })}
          </div>

          {/* Selected Language Preview */}
          {selectedLanguage && (
            <div className="selected-language-preview">
              <div className="selected-language-card">
                <div className="selected-language-info">
                  <div className="selected-language-flag">
                    {getSelectedLanguageInfo().flag || '🌐'}
                  </div>
                  <div className="selected-language-details">
                    <h3>{getSelectedLanguageInfo().name || selectedLanguage}</h3>
                    <p>{getSelectedLanguageInfo().nativeName || selectedLanguage}</p>
                    <div className="language-features">
                      {getSelectedLanguageInfo().features?.map((feature, index) => (
                        <span key={index} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="language-direction-indicator">
                  {getSelectedLanguageInfo().direction === 'rtl' ? '←' : '→'}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="language-actions">
            <button className="cancel-btn" onClick={handleClose}>
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

// Helper function to get region icons
const getRegionIcon = (region) => {
  const regionIcons = {
    'Europe': '🇪🇺',
    'Asia': '🌏',
    'Americas': '🌎',
    'Africa': '🌍',
    'Oceania': '🌏',
    'Middle East': '🌍'
  };
  return regionIcons[region] || '🌐';
};

export default LanguageSelector; 