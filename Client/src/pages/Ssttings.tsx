import React, { useState, useEffect } from 'react';
import { getClocks, saveClocks, type ClockConfig } from '../utils/storage';
import { getTimezones, searchTimezones } from '../services/timezone';

const Settings: React.FC = () => {
  const [clocks, setClocks] = useState<ClockConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    const savedClocks = getClocks();
    setClocks(savedClocks);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchTimezones(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleAddClock = (timezone: string, cityName: string) => {
    const newClock: ClockConfig = {
      timezone,
      city: cityName
    };

    // Check for duplicates
    const isDuplicate = clocks.some(
      clock => clock.timezone === timezone && clock.city === cityName
    );

    if (!isDuplicate) {
      const updatedClocks = [...clocks, newClock];
      setClocks(updatedClocks);
      saveClocks(updatedClocks);
    }

    setSearchQuery('');
    setSelectedCity('');
    setSearchResults([]);
  };

  const handleRemoveClock = (index: number) => {
    const updatedClocks = clocks.filter((_, i) => i !== index);
    setClocks(updatedClocks);
    saveClocks(updatedClocks);
  };

  const handleSearchSelect = (timezone: string) => {
    const cityName = timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;
    setSelectedCity(timezone);
    setSearchQuery(cityName);
  };

  const popularTimezones = [
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Dubai',
    'Australia/Sydney',
    'Asia/Kolkata'
  ];

  return (
    <div className="settings-page">
      <div className="container">
        <h1>Settings</h1>
        
        <div className="add-clock-section">
          <h2>Add World Clock</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for a city or timezone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((timezone) => (
                  <div
                    key={timezone}
                    className="search-result-item"
                    onClick={() => handleSearchSelect(timezone)}
                  >
                    {timezone.split('/').pop()?.replace(/_/g, ' ')} ({timezone})
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedCity && (
            <button
              onClick={() => handleAddClock(selectedCity, selectedCity.split('/').pop()?.replace(/_/g, ' ') || selectedCity)}
              className="add-btn"
            >
              Add {selectedCity.split('/').pop()?.replace(/_/g, ' ')} Clock
            </button>
          )}

          <div className="popular-timezones">
            <h3>Popular Cities</h3>
            <div className="popular-list">
              {popularTimezones.map((timezone) => {
                const cityName = timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;
                return (
                  <button
                    key={timezone}
                    onClick={() => handleAddClock(timezone, cityName)}
                    className="popular-btn"
                  >
                    + {cityName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="current-clocks">
          <h2>Your Clocks ({clocks.length})</h2>
          {clocks.length === 0 ? (
            <p className="no-clocks">No clocks added yet.</p>
          ) : (
            <div className="clocks-list">
              {clocks.map((clock, index) => (
                <div key={index} className="clock-item">
                  <span className="clock-info">
                    <strong>{clock.city}</strong> ({clock.timezone})
                  </span>
                  <button
                    onClick={() => handleRemoveClock(index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;