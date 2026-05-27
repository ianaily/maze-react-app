import type {
  SceneDocument,
  SceneEntityDocumentV1
} from '../../../engine-scene/src/index.js';

export type SceneComponentKey =
  | 'animator'
  | 'audio'
  | 'camera'
  | 'characterController'
  | 'collider'
  | 'particleEmitter'
  | 'rigidbody'
  | 'sprite'
  | 'tilemap'
  | 'transform'
  | 'tween';

export interface EditorCommand {
  readonly name: string;
  apply(document: SceneDocument): EditorCommandResult;
}

export interface EditorCommandResult {
  readonly document: SceneDocument;
  readonly undo: EditorCommand;
}

export type SceneComponentValue<K extends SceneComponentKey> = NonNullable<SceneEntityDocumentV1[K]>;

export type MutableSceneEntity = {
  -readonly [K in keyof SceneEntityDocumentV1]: SceneEntityDocumentV1[K];
};
