
import pb from '@/lib/pocketbaseClient';

// Helper to convert country code (e.g. US) to flag emoji
export const codeToFlag = (countryCode) => {
  if (!countryCode) return '🌍';
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
};

export const getPlayerLocation = async () => {
  try {
    const cached = sessionStorage.getItem('user_location');
    if (cached) return JSON.parse(cached);

    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    const locationData = {
      country: data.country_name || 'Unknown',
      state: data.region || 'Unknown',
      countryCode: data.country_code || 'UN',
      flag: data.country_code ? codeToFlag(data.country_code) : '🌍'
    };

    sessionStorage.setItem('user_location', JSON.stringify(locationData));
    return locationData;
  } catch (error) {
    console.warn("Failed to detect geolocation:", error);
    return { country: 'Unknown', state: 'Unknown', countryCode: 'UN', flag: '🌍' };
  }
};

export const syncUserLocation = async (userId) => {
  if (!userId) return;
  try {
    const locationData = await getPlayerLocation();
    
    // Check if location record exists for user
    const existing = await pb.collection('player_locations').getList(1, 1, {
      filter: `userId = "${userId}"`,
      $autoCancel: false
    });

    if (existing.items.length > 0) {
      await pb.collection('player_locations').update(existing.items[0].id, {
        country: locationData.country,
        state: locationData.state,
        countryCode: locationData.countryCode,
      }, { $autoCancel: false });
    } else {
      await pb.collection('player_locations').create({
        userId,
        country: locationData.country,
        state: locationData.state,
        countryCode: locationData.countryCode,
        privacyLevel: 'approximate'
      }, { $autoCancel: false });
    }
  } catch (err) {
    console.error("Failed to sync location to PB:", err);
  }
};
