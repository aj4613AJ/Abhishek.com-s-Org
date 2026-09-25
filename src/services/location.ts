import { ReportLocation } from '../types';

export async function detectCurrentLocation(): Promise<ReportLocation> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        address: 'Maharashtra, India',
        city: 'Pune',
        state: 'Maharashtra',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Attempt reverse geocoding via Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en',
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const addr = data.address || {};
            const road = addr.road || addr.suburb || addr.neighbourhood || '';
            const city = addr.city || addr.town || addr.district || 'Pune';
            const state = addr.state || 'Maharashtra';

            const cleanAddress = data.display_name
              ? data.display_name.split(',').slice(0, 3).join(', ').trim()
              : `${road ? road + ', ' : ''}${city}, ${state}`;

            resolve({
              address: cleanAddress,
              latitude,
              longitude,
              city,
              state,
            });
            return;
          }
        } catch (e) {
          console.warn('Reverse geocoding fetch notice:', e);
        }

        // Fallback with coordinates
        resolve({
          address: `Field Point [${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E], Maharashtra`,
          latitude,
          longitude,
          city: 'Pune',
          state: 'Maharashtra',
        });
      },
      (error) => {
        console.warn('Geolocation prompt error or denied:', error.message);
        resolve({
          address: 'Pune, Maharashtra, India',
          city: 'Pune',
          state: 'Maharashtra',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  });
}
