import { useState, useEffect } from 'react';

export const useCurrentLocation = () => {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }
    
    const handleSuccess = async (position) => {
      const { latitude, longitude } = position.coords;
      
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        if (!response.ok) throw new Error('Failed to fetch location data.');
        
        const data = await response.json();
        console.log(data)
        
        // --- YAHAN CHANGE KIYA HAI ---
        // Aapke JSON example ke mutabiq behtar logic
        // Yeh sab se choti jagah (village) se shuru karega
        const locationName = data.address?.village ||      // e.g., "Shamkay Bhattian"
                             data.address?.municipality ||  // e.g., "Raiwind Tehsil"
                             data.address?.suburb ||
                             data.address?.town ||
                             data.address?.city ||
                             data.address?.state ||         // Fallback e.g., "Punjab"
                             'Unknown Location';
        setCity(data.address?.city)
        setLocation(locationName);
        // -----------------------------

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const handleError = (err) => {
      setError(err.message);
      setLoading(false);
    };

    setLoading(true);
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);

  }, []); // Yeh effect sirf aik baar chalega

  return { location, loading, error,city };
};

