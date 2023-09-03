import React from 'react';

export const useIsElectron = () => {
  const [isElectron, setIsElectron] = React.useState(false);

  React.useEffect(() => {
    setIsElectron(navigator.userAgent.toLowerCase().includes('electron'));
  }, [navigator.userAgent]);

  return isElectron;
};
