import React from 'react';
import { Config } from 'src/types/config';

export const useSprite = (config: Config) => {
  const getImage = (src: string) => {
    const image = new Image();
    image.src = src;
    image.onload = () => setLoadedSpriteCount((prev) => prev + 1);

    return image;
  };
  const sprites: { [src: string]: CanvasImageSource } = React.useMemo(() => {
    const sprites = {};
    config.types.forEach((type) => (sprites[type.sprite] = getImage(type.sprite)));
    config.customTypes.forEach((type) => (sprites[type.sprite] = getImage(type.sprite)));
    Object.keys(config.wallSprites).forEach(
      (direction) =>
        (sprites[config.wallSprites[direction]] = getImage(config.wallSprites[direction])),
    );
    Object.keys(config.charSprites).forEach(
      (direction) =>
        (sprites[config.charSprites[direction]] = getImage(config.charSprites[direction])),
    );

    return sprites;
  }, []);

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
