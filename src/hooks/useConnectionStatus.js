import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // If user was offline and now back online, redirect to home
      if (wasOffline) {
        setWasOffline(false);
        navigate('/');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      // Redirect to offline page when connection is lost
      navigate('/offline');
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate, wasOffline]);

  return { isOnline, wasOffline };
};

export default useConnectionStatus;
