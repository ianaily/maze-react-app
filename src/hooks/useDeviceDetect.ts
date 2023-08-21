import React from 'react';
import { styles } from 'src/styles/styles';
import { useWindowSize } from './useWindowSize';

export const useDeviceDetected = () => {
  const { width } = useWindowSize();
  const breakpoints = styles.breakpoints;

  return React.useMemo(() => {
    return {
      isMobile: width <= breakpoints.mobile,
      isTablet: width > breakpoints.mobile && width < breakpoints.tablet,
      isDesktop: width > breakpoints.desktop,
    };
  }, [width]);
};
