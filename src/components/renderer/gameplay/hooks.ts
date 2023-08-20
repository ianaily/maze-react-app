import React from 'react';
import TL from 'src/assets/sprites/walls/top-left.png';
import TM from 'src/assets/sprites/walls/top-middle.png';
import TR from 'src/assets/sprites/walls/top-right.png';
import ML from 'src/assets/sprites/walls/middle-left.png';
import MM from 'src/assets/sprites/walls/middle.png';
import MR from 'src/assets/sprites/walls/middle-right.png';
import BL from 'src/assets/sprites/walls/bottom-left.png';
import BM from 'src/assets/sprites/walls/bottom-middle.png';
import BR from 'src/assets/sprites/walls/bottom-right.png';
import NT from 'src/assets/sprites/walls/narrow-top.png';
import NR from 'src/assets/sprites/walls/narrow-right.png';
import NB from 'src/assets/sprites/walls/narrow-bottom.png';
import NL from 'src/assets/sprites/walls/narrow-left.png';
import NH from 'src/assets/sprites/walls/narrow-horizontal.png';
import NV from 'src/assets/sprites/walls/narrow-vertical.png';
import NM from 'src/assets/sprites/walls/narrow.png';
import Way from 'src/assets/sprites/way.png';
import Door from 'src/assets/sprites/door.png';
import Char from 'src/assets/sprites/char-r.png';

export const useSprite = () => {
  const getImage = (src: string) => {
    const image = new Image();
    image.src = src;
    image.onload = () => setLoadedSpriteCount((prev) => prev + 1);

    return image;
  };
  const sprites: { [src: string]: CanvasImageSource } = React.useMemo(
    () => ({
      [TL]: getImage(TL),
      [TM]: getImage(TM),
      [TR]: getImage(TR),
      [ML]: getImage(ML),
      [MM]: getImage(MM),
      [MR]: getImage(MR),
      [BL]: getImage(BL),
      [BM]: getImage(BM),
      [BR]: getImage(BR),
      [NT]: getImage(NT),
      [NR]: getImage(NR),
      [NB]: getImage(NB),
      [NL]: getImage(NL),
      [NH]: getImage(NH),
      [NV]: getImage(NV),
      [NM]: getImage(NM),
      [Way]: getImage(Way),
      [Door]: getImage(Door),
      [Char]: getImage(Char),
    }),
    [],
  );

  const [loadedSpriteCount, setLoadedSpriteCount] = React.useState(0);

  const spritesLoaded = React.useMemo(
    () => loadedSpriteCount >= Object.keys(sprites || {}).length,
    [loadedSpriteCount],
  );

  const getSpite = (sprite: string) => sprites?.[sprite];

  return {
    getSpite,
    spritesLoaded,
  };
};
