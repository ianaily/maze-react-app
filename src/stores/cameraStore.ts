import { Camera } from 'src/types/camera';

export class CameraStore {
  camera: Camera = {
    point: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
    areas: [],
  };
}

export default new CameraStore();
