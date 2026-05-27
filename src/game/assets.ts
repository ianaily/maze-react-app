import { sprites, walls } from 'src/const/spritesMap';
import { WallDirections } from 'src/types/direction';
import type { CanvasAssetResolver, CanvasDrawable } from 'engine-render-canvas';
import {
  ASSET_COIN,
  ASSET_DOOR,
  ASSET_FLOOR,
  ASSET_HERO_LEFT,
  ASSET_HERO_RIGHT,
  WALL_VARIANTS,
  wallAssetId,
} from './const';

const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load sprite: ${url}`));
    image.src = url;
  });

const createCoinSprite = (): HTMLCanvasElement => {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return canvas;
  }
  const cx = size / 2;
  const cy = size / 2;
  ctx.fillStyle = '#f8d24c';
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.32, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#9a6500';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#fff3b0';
  ctx.beginPath();
  ctx.arc(cx - size * 0.08, cy - size * 0.08, size * 0.08, 0, Math.PI * 2);
  ctx.fill();
  return canvas;
};

export const buildMazeAssets = async (): Promise<CanvasAssetResolver> => {
  const wallEntries: [string, string][] = WALL_VARIANTS.map((variant) => [
    wallAssetId(variant),
    walls[variant as WallDirections],
  ]);

  const definitions: [string, string][] = [
    [ASSET_FLOOR, sprites.way],
    [ASSET_DOOR, sprites.door],
    [ASSET_HERO_RIGHT, sprites.charRight],
    [ASSET_HERO_LEFT, sprites.charLeft],
    ...wallEntries,
  ];

  const entries = await Promise.all(
    definitions.map(async ([id, url]) => {
      const image = await loadImage(url);
      return [id, image] as [string, CanvasDrawable];
    }),
  );

  const map = new Map<string, CanvasDrawable>(entries);
  map.set(ASSET_COIN, createCoinSprite());

  return {
    resolve(id: string) {
      return map.get(id);
    },
  };
};
