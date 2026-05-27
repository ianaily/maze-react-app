import type { EntityId } from '../../../engine-core/src/index.js';
import type { SceneBehaviorDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const loadBehaviors = (
  runtime: SceneRuntime,
  entity: EntityId,
  documents: readonly SceneBehaviorDocumentV1[]
): void => {
  if (documents.length === 0) {
    return;
  }

  runtime.behaviors.set(entity, documents);
};
