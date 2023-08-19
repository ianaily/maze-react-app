import React from 'react';

export const useKeyboard = (onKeyDown: (key: string) => void) => {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.code;

      onKeyDown(key);
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onKeyDown]);
};
