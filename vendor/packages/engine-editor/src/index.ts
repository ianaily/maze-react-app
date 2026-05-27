export {
  addBehaviorCommand,
  removeBehaviorCommand,
  setBehaviorsCommand,
  updateBehaviorConfigCommand
} from './behavior-commands.js';
export { createCommandGroup } from './command-group.js';
export { EditorDocument } from './editor-document.js';
export {
  buildHierarchy,
  reparentEntitiesCommand,
  setHierarchyCommand,
  setHierarchyParentCommand,
  wouldCreateCycle,
  type EditorHierarchyNode,
  type HierarchyDropPosition,
  type ReparentRequest
} from './hierarchy.js';
export {
  buildEntityInspectorModel,
  inspectorComponentDefinition,
  inspectorComponents,
  type EntityInspectorComponentModel,
  type EntityInspectorFieldModel,
  type EntityInspectorModel,
  type InspectorComponentDefinition,
  type InspectorFieldDefinition,
  type InspectorFieldOption,
  type InspectorFieldType
} from './inspector-schema.js';
export { SelectionStore } from './selection-store.js';
export {
  createEntityCommand,
  destroyEntityCommand,
  setEditorGridCommand,
  setEntityComponentCommand,
  setEntityLayerCommand,
  setEntityOrderCommand,
  setSceneCameraEntityCommand,
  updateEntityComponentCommand,
  updateTransformCommand,
  type EditorCommand,
  type EditorCommandResult,
  type SceneComponentKey
} from './scene-commands.js';
export {
  migrateSceneAssets,
  registerAudioClipAssetCommand,
  registerSpriteAssetCommand,
  removeAssetCommand,
  renameAssetCommand,
  setSceneMusicCommand
} from './asset-commands.js';
export {
  convertSelectionToPrefab,
  instantiatePrefabCommand,
  type ConvertSelectionToPrefabOptions,
  type InstantiatePrefabOptions
} from './prefab-commands.js';
export { setTilemapTilesCommand, type TilemapTileEdit } from './tilemap-commands.js';
export { updateUiNodeCommand, type UiNodePatch } from './ui-commands.js';
