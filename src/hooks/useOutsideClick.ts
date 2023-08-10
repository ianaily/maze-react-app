import React from 'react';

export const useOutsideClick = (
  refs: React.RefObject<HTMLElement>[],
  handler: (event: MouseEvent | TouchEvent) => void,
) => {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const isInside = refs
        .map((ref) => ref.current?.contains(event.target as Node))
        .some((contain) => contain);

      !isInside && handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [refs, handler]);
};
