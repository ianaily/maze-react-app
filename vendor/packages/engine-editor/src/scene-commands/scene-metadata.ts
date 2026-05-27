import type {
  SceneDocument,
  SceneEditorGridDocumentV1
} from '../../../engine-scene/src/index.js';
import type { EditorCommand } from './types.js';

export function setSceneCameraEntityCommand(cameraEntityId: string | undefined): EditorCommand {
  return {
    name: cameraEntityId === undefined
      ? 'clear scene camera entity'
      : `set scene camera entity ${cameraEntityId}`,
    apply(document) {
      if (cameraEntityId !== undefined) {
        const exists = document.entities.some((entity) => entity.id === cameraEntityId);

        if (!exists) {
          throw new Error(`Cannot set scene camera entity: unknown entity ${cameraEntityId}`);
        }
      }

      const previous = document.cameraEntityId;
      const next = cameraEntityId === undefined
        ? withoutCameraEntity(document)
        : { ...document, cameraEntityId };

      return {
        document: next,
        undo: setSceneCameraEntityCommand(previous)
      };
    }
  };
}

function withoutCameraEntity(document: SceneDocument): SceneDocument {
  const { cameraEntityId: _omit, ...rest } = document as SceneDocument & {
    cameraEntityId?: string;
  };
  return rest;
}

export function setEditorGridCommand(grid: SceneEditorGridDocumentV1 | undefined): EditorCommand {
  return {
    name: 'set editor grid',
    apply(document) {
      const previous = document.editor?.grid;
      const nextEditor = applyGridToEditor(document.editor, grid);

      return {
        document: { ...document, ...(nextEditor !== undefined ? { editor: nextEditor } : {}) },
        undo: setEditorGridCommand(previous)
      };
    }
  };
}

function applyGridToEditor(
  editor: SceneDocument['editor'],
  grid: SceneEditorGridDocumentV1 | undefined
): SceneDocument['editor'] {
  if (grid === undefined) {
    if (editor === undefined) {
      return undefined;
    }

    const { grid: _omit, ...rest } = editor;
    return Object.keys(rest).length === 0 ? undefined : rest;
  }

  return {
    ...(editor ?? {}),
    grid: { ...grid }
  };
}
