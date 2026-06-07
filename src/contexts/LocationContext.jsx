
import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    country: 'US',
    region: 'North America',
    city: 'New York',
    detected: false
  });

  useEffect(() => {
    // Mock geolocation detection
    const detectLocation = () => {
      const savedLocation = localStorage.getItem('nicd_location');
      if (savedLocation) {
        setLocation(JSON.parse(savedLocation));
      } else {
        // Simulate API call
        setTimeout(() => {
          const detected = { country: 'US', region: 'North America', city: 'New York', detected: true };
          setLocation(detected);
          localStorage.setItem('nicd_location', JSON.stringify(detected));
        }, 1000);
      }
    };
    detectLocation();
  }, []);

  const updateLocation = (newLocation) => {
    const updated = { ...location, ...newLocation, detected: true };
    setLocation(updated);
    localStorage.setItem('nicd_location', JSON.stringify(updated));
  };

  return (
    <LocationContext.Provider value={{ location, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
