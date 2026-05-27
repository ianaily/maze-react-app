/**
 * JSON-serializable scalar values allowed inside `SceneBehaviorConfig`.
 * Behavior configs travel through scene JSON unchanged, so the value space is
 * the JSON value space.
 */
export type SceneBehaviorConfigValue =
  | string
  | number
  | boolean
  | null
  | readonly SceneBehaviorConfigValue[]
  | { readonly [key: string]: SceneBehaviorConfigValue };

export type SceneBehaviorConfig = { readonly [key: string]: SceneBehaviorConfigValue };

export interface SceneBehaviorDocumentV1 {
  readonly behaviorId: string;
  readonly config?: SceneBehaviorConfig;
}
