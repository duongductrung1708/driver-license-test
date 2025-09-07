import React from 'react';
import useConnectionStatus from '../hooks/useConnectionStatus';

const ConnectionMonitor = () => {
  // Monitor connection status inside Router context
  useConnectionStatus();
  
  // This component doesn't render anything, it just monitors connection
  return null;
};

export default ConnectionMonitor;
