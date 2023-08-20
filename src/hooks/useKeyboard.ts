import React from 'react';

export const useKeyboard = (onKeyDown: (key: string) => void) => {
  React.useEffect(() => {
    const handleKeyDown = ({ target, code }: KeyboardEvent) => {
      const isInputActive =
        target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;

      !isInputActive && onKeyDown(code);
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onKeyDown]);
};
