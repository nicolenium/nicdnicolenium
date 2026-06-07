
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

export const usePlayerLocation = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const cached = localStorage.getItem('nicd_player_location');
        if (cached) {
          const parsed = JSON.parse(cached);
          setLocation(parsed);
          updateProfileIfChanged(parsed);
          setLoading(false);
          return;
        }

        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Location fetch failed');
        const data = await response.json();
        
        const locData = {
          city: data.city || '',
          country: data.country_name || '',
          countryCode: data.country || '',
          lat: data.latitude,
          lon: data.longitude,
          fullString: `${data.city}, ${data.country_name}`
        };

        localStorage.setItem('nicd_player_location', JSON.stringify(locData));
        setLocation(locData);
        updateProfileIfChanged(locData);
        
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setLoading(false);
      }
    };

    const updateProfileIfChanged = async (locData) => {
      if (!isAuthenticated || !currentUser) return;
      if (currentUser.location !== locData.fullString) {
        try {
          await pb.collection('users').update(currentUser.id, {
            location: locData.fullString
          }, { $autoCancel: false });
        } catch (e) {
          console.error('Failed to update profile location:', e);
        }
      }
    };

    fetchLocation();
  }, [currentUser, isAuthenticated]);

  return { location, loading };
};
