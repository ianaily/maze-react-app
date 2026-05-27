import type {
  SceneBehaviorConfig,
  SceneBehaviorDocumentV1,
  SceneDocument,
  SceneEntityDocumentV1
} from '../../engine-scene/src/index.js';
import type { EditorCommand } from './scene-commands.js';

export function addBehaviorCommand(entityId: string, behavior: SceneBehaviorDocumentV1): EditorCommand {
  const snapshot = cloneBehavior(behavior);

  return {
    name: `add behavior ${snapshot.behaviorId} to ${entityId}`,
    apply(document) {
      const entity = entityById(document, entityId);
      const previous = entity.behaviors;

      if (previous?.some((existing) => existing.behaviorId === snapshot.behaviorId) === true) {
        throw new Error(
          `Behavior "${snapshot.behaviorId}" is already bound on entity "${entityId}". Remove it before adding again.`
        );
      }

      const nextList = [...(previous ?? []), cloneBehavior(snapshot)];

      return {
        document: replaceEntity(document, withBehaviors(entity, nextList)),
        undo: setBehaviorsCommand(entityId, previous)
      };
    }
  };
}

export function removeBehaviorCommand(entityId: string, behaviorId: string): EditorCommand {
  return {
    name: `remove behavior ${behaviorId} from ${entityId}`,
    apply(document) {
      const entity = entityById(document, entityId);
      const previous = entity.behaviors;

      if (previous === undefined || previous.length === 0) {
        return { document, undo: setBehaviorsCommand(entityId, previous) };
      }

      const nextList = previous.filter((behavior) => behavior.behaviorId !== behaviorId);

      return {
        document: replaceEntity(
          document,
          withBehaviors(entity, nextList.length === 0 ? undefined : nextList)
        ),
        undo: setBehaviorsCommand(entityId, previous)
      };
    }
  };
}

export function updateBehaviorConfigCommand(
  entityId: string,
  behaviorId: string,
  config: SceneBehaviorConfig | undefined
): EditorCommand {
  const configSnapshot = config === undefined ? undefined : cloneConfig(config);

  return {
    name: `update behavior config ${behaviorId} on ${entityId}`,
    apply(document) {
      const entity = entityById(document, entityId);
      const previous = entity.behaviors;

      if (previous === undefined || !previous.some((b) => b.behaviorId === behaviorId)) {
        throw new Error(`Behavior "${behaviorId}" is not bound on entity "${entityId}".`);
      }

      const nextList = previous.map((behavior) =>
        behavior.behaviorId === behaviorId
          ? configSnapshot === undefined
            ? { behaviorId }
            : { behaviorId, config: cloneConfig(configSnapshot) }
          : behavior
      );

      return {
        document: replaceEntity(document, withBehaviors(entity, nextList)),
        undo: setBehaviorsCommand(entityId, previous)
      };
    }
  };
}

/**
 * Bulk setter — used as the undo for the per-behavior commands so undo restores
 * the full prior list in one shot.
 */
export function setBehaviorsCommand(
  entityId: string,
  behaviors: readonly SceneBehaviorDocumentV1[] | undefined
): EditorCommand {
  const snapshot = behaviors === undefined ? undefined : behaviors.map(cloneBehavior);

  return {
    name: `set behaviors on ${entityId}`,
    apply(document) {
      const entity = entityById(document, entityId);
      const previous = entity.behaviors;

      return {
        document: replaceEntity(
          document,
          withBehaviors(entity, snapshot === undefined ? undefined : snapshot.map(cloneBehavior))
        ),
        undo: setBehaviorsCommand(entityId, previous)
      };
    }
  };
}

function entityById(document: SceneDocument, id: string): SceneEntityDocumentV1 {
  const entity = document.entities.find((candidate) => candidate.id === id);

  if (entity === undefined) {
    throw new Error(`Scene entity does not exist: ${id}`);
  }

  return entity;
}

function replaceEntity(document: SceneDocument, entity: SceneEntityDocumentV1): SceneDocument {
  return {
    ...document,
    entities: document.entities.map((candidate) => (candidate.id === entity.id ? entity : candidate))
  };
}

function withBehaviors(
  entity: SceneEntityDocumentV1,
  behaviors: readonly SceneBehaviorDocumentV1[] | undefined
): SceneEntityDocumentV1 {
  const { behaviors: _previous, ...rest } = entity;
  return behaviors === undefined ? rest : { ...rest, behaviors };
}

function cloneBehavior(behavior: SceneBehaviorDocumentV1): SceneBehaviorDocumentV1 {
  return behavior.config === undefined
    ? { behaviorId: behavior.behaviorId }
    : { behaviorId: behavior.behaviorId, config: cloneConfig(behavior.config) };
}

function cloneConfig(config: SceneBehaviorConfig): SceneBehaviorConfig {
  return JSON.parse(JSON.stringify(config)) as SceneBehaviorConfig;
}
