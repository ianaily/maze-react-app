import type { SceneBehaviorDocumentV1 } from '../scene-schema.js';

export const validateEntityBehaviors = (
  entityId: string,
  behaviors: readonly SceneBehaviorDocumentV1[]
): void => {
  const seen = new Set<string>();

  for (let index = 0; index < behaviors.length; index += 1) {
    const behavior = behaviors[index]!;

    if (typeof behavior.behaviorId !== 'string' || behavior.behaviorId.length === 0) {
      throw new Error(`Behavior at index ${index} on entity "${entityId}" must have a non-empty behaviorId.`);
    }

    if (seen.has(behavior.behaviorId)) {
      throw new Error(`Duplicate behaviorId "${behavior.behaviorId}" on entity "${entityId}".`);
    }

    seen.add(behavior.behaviorId);

    if (behavior.config !== undefined) {
      validateBehaviorConfigValue(
        behavior.config,
        `behaviors[${behavior.behaviorId}].config on entity "${entityId}"`
      );

      if (
        typeof behavior.config !== 'object'
        || behavior.config === null
        || Array.isArray(behavior.config)
      ) {
        throw new Error(
          `Behavior "${behavior.behaviorId}" on entity "${entityId}" requires config to be a plain object.`
        );
      }
    }
  }
};

/**
 * Behavior configs are persisted as JSON, so the allowed value space is the
 * JSON value space. Reject functions, dates, regexes, etc. up-front so the
 * editor never accidentally writes a non-serializable config to disk.
 */
const validateBehaviorConfigValue = (value: unknown, path: string): void => {
  if (value === null) {
    return;
  }

  const t = typeof value;

  if (t === 'string' || t === 'boolean') {
    return;
  }

  if (t === 'number') {
    if (!Number.isFinite(value)) {
      throw new Error(`${path} contains a non-finite number.`);
    }
    return;
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      validateBehaviorConfigValue(value[index], `${path}[${index}]`);
    }
    return;
  }

  if (t === 'object') {
    for (const key of Object.keys(value as Record<string, unknown>)) {
      validateBehaviorConfigValue((value as Record<string, unknown>)[key], `${path}.${key}`);
    }
    return;
  }

  throw new Error(`${path} must be JSON-serializable. Got ${t}.`);
};
