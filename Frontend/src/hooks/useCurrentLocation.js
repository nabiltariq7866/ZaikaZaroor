import { useState, useEffect } from 'react';
import axios from "axios"
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
      const apiKey=import.meta.env.VITE_GEOAPIKEY;
      try {
        const {data} = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`)
        let cityfind=data?.results[0]?.district
        cityfind=cityfind.split(" ")
        setCity(cityfind[0])
        setLocation(cityfind[0]);

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

