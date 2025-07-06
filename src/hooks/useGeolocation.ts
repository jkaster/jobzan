import { useState, useEffect } from "react";

/**
 * Represents the user's geographical location.
 * @interface
 */
interface IUserLocation {
  latitude: number;
  longitude: number;
}

/**
 * A custom React hook for accessing and tracking the user's geolocation.
 * @returns An object containing the user's location and any error that occurred.
 */
const useGeolocation = () => {
  const [userLocation, setUserLocation] = useState<IUserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const handleError = (geoError: GeolocationPositionError) => {
      setError(geoError.message);
    };

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { userLocation, error };
};

export default useGeolocation;
