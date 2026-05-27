import type { SceneEntityDocumentV1 } from '../../engine-scene/src/index.js';
import type { SceneComponentKey } from './scene-commands.js';

export type InspectorFieldType =
  | 'boolean'
  | 'number'
  | 'select'
  | 'text'
  | 'asset-sprite'
  | 'asset-audio'
  | 'animation-clip'
  | 'entity-id';

export interface InspectorFieldDefinition {
  readonly key: string;
  readonly label: string;
  readonly type: InspectorFieldType;
  readonly defaultValue: boolean | number | string;
  readonly min?: number;
  readonly options?: readonly InspectorFieldOption[];
}

export interface InspectorFieldOption {
  readonly label: string;
  readonly value: number | string;
}

export interface InspectorComponentDefinition {
  readonly component: SceneComponentKey;
  readonly label: string;
  readonly fields: readonly InspectorFieldDefinition[];
}

export interface EntityInspectorModel {
  readonly entityId: string;
  readonly components: readonly EntityInspectorComponentModel[];
}

export interface EntityInspectorComponentModel {
  readonly component: SceneComponentKey;
  readonly label: string;
  readonly present: boolean;
  readonly fields: readonly EntityInspectorFieldModel[];
}

export interface EntityInspectorFieldModel extends InspectorFieldDefinition {
  readonly value: boolean | number | string;
}

export const inspectorComponents = [
  {
    component: 'transform',
    label: 'Transform',
    fields: [
      numberField('x', 'X', 0),
      numberField('y', 'Y', 0),
      numberField('rotation', 'Rotation', 0),
      numberField('scaleX', 'Scale X', 1),
      numberField('scaleY', 'Scale Y', 1)
    ]
  },
  {
    component: 'sprite',
    label: 'Sprite',
    fields: [
      referenceField('assetId', 'Asset', 'asset-sprite'),
      numberField('width', 'Width', 1, 0.000_001),
      numberField('height', 'Height', 1, 0.000_001),
      numberField('offsetX', 'Offset X', 0),
      numberField('offsetY', 'Offset Y', 0),
      numberField('alpha', 'Alpha', 1, 0)
    ]
  },
  {
    component: 'collider',
    label: 'Collider',
    fields: [
      numberField('width', 'Width', 1, 0.000_001),
      numberField('height', 'Height', 1, 0.000_001),
      numberField('offsetX', 'Offset X', 0),
      numberField('offsetY', 'Offset Y', 0),
      booleanField('trigger', 'Trigger', false),
      numberField('categoryBits', 'Category Bits', 1, 0),
      numberField('maskBits', 'Mask Bits', 0xffff_ffff, 0)
    ]
  },
  {
    component: 'rigidbody',
    label: 'Rigidbody',
    fields: [
      {
        key: 'type',
        label: 'Type',
        type: 'select',
        defaultValue: 1,
        options: [
          { label: 'Static', value: 0 },
          { label: 'Dynamic', value: 1 }
        ]
      },
      numberField('velocityX', 'Velocity X', 0),
      numberField('velocityY', 'Velocity Y', 0),
      numberField('gravityScale', 'Gravity Scale', 1)
    ]
  },
  {
    component: 'animator',
    label: 'Animator',
    fields: [
      referenceField('clipId', 'Clip', 'animation-clip'),
      booleanField('playing', 'Playing', true),
      numberField('speed', 'Speed', 1)
    ]
  },
  {
    component: 'characterController',
    label: 'Character Controller',
    fields: [
      {
        key: 'mode',
        label: 'Mode',
        type: 'select',
        defaultValue: 'platformer',
        options: [
          { label: 'Platformer', value: 'platformer' },
          { label: 'Top Down', value: 'top-down' }
        ]
      },
      numberField('maxSpeed', 'Max Speed', 72, 0.000_001),
      numberField('jumpSpeed', 'Jump Speed', 170, 0.000_001)
    ]
  },
  {
    component: 'camera',
    label: 'Camera',
    fields: [
      referenceField('targetEntityId', 'Target entity', 'entity-id'),
      numberField('smoothingTimeSeconds', 'Smoothing (s)', 0, 0),
      numberField('deadZoneWidth', 'Dead zone W', 0, 0),
      numberField('deadZoneHeight', 'Dead zone H', 0, 0),
      numberField('zoom', 'Zoom', 1, 0.000_001)
    ]
  },
  {
    component: 'tween',
    label: 'Tween',
    fields: [
      numberField('from', 'From', 0),
      numberField('to', 'To', 0),
      numberField('durationSeconds', 'Duration (s)', 0.3, 0),
      numberField('delaySeconds', 'Delay (s)', 0, 0),
      {
        key: 'easing',
        label: 'Easing',
        type: 'select',
        defaultValue: 'linear',
        options: [
          { label: 'Linear', value: 'linear' },
          { label: 'In Quad', value: 'ease-in-quad' },
          { label: 'Out Quad', value: 'ease-out-quad' },
          { label: 'InOut Quad', value: 'ease-in-out-quad' },
          { label: 'In Cubic', value: 'ease-in-cubic' },
          { label: 'Out Cubic', value: 'ease-out-cubic' },
          { label: 'InOut Cubic', value: 'ease-in-out-cubic' },
          { label: 'Out Elastic', value: 'ease-out-elastic' },
          { label: 'Out Bounce', value: 'ease-out-bounce' }
        ]
      },
      {
        key: 'repeat',
        label: 'Repeat',
        type: 'select',
        defaultValue: 'once',
        options: [
          { label: 'Once', value: 'once' },
          { label: 'Loop', value: 'loop' },
          { label: 'Ping-pong', value: 'ping-pong' }
        ]
      },
      booleanField('autoplay', 'Autoplay', true)
    ]
  },
  {
    component: 'particleEmitter',
    label: 'Particle Emitter',
    fields: [
      referenceField('spriteAssetId', 'Sprite asset', 'asset-sprite'),
      {
        key: 'shape',
        label: 'Shape',
        type: 'select',
        defaultValue: 'point',
        options: [
          { label: 'Point', value: 'point' },
          { label: 'Line', value: 'line' },
          { label: 'Rect', value: 'rect' }
        ]
      },
      numberField('extentX', 'Extent X', 0, 0),
      numberField('extentY', 'Extent Y', 0, 0),
      numberField('rate', 'Rate (per s)', 10, 0),
      numberField('burstCount', 'Burst count', 0, 0),
      textField('eventName', 'Burst event', ''),
      numberField('lifetimeMinSeconds', 'Lifetime min (s)', 0.5, 0),
      numberField('lifetimeMaxSeconds', 'Lifetime max (s)', 1, 0),
      numberField('velocityMinX', 'Vx min', -10),
      numberField('velocityMaxX', 'Vx max', 10),
      numberField('velocityMinY', 'Vy min', -30),
      numberField('velocityMaxY', 'Vy max', -10),
      numberField('gravityScale', 'Gravity scale', 1),
      numberField('startScale', 'Start scale', 1, 0),
      numberField('endScale', 'End scale', 0, 0),
      numberField('startAlpha', 'Start alpha', 1, 0),
      numberField('endAlpha', 'End alpha', 0, 0),
      booleanField('autoplay', 'Autoplay', true)
    ]
  },
  {
    component: 'audio',
    label: 'Audio',
    fields: [
      referenceField('clipId', 'Clip', 'asset-audio'),
      booleanField('autoplay', 'Autoplay', false),
      booleanField('loop', 'Loop', false),
      numberField('volume', 'Volume', 1, 0),
      {
        key: 'channel',
        label: 'Channel',
        type: 'select',
        defaultValue: 'sfx',
        options: [
          { label: 'SFX', value: 'sfx' },
          { label: 'Music', value: 'music' }
        ]
      }
    ]
  }
] satisfies readonly InspectorComponentDefinition[];

export function inspectorComponentDefinition(component: SceneComponentKey): InspectorComponentDefinition {
  const definition = inspectorComponents.find((candidate) => candidate.component === component);

  if (definition === undefined) {
    throw new Error(`Unknown inspector component: ${component}`);
  }

  return definition;
}

export function buildEntityInspectorModel(entity: SceneEntityDocumentV1): EntityInspectorModel {
  return {
    entityId: entity.id,
    components: inspectorComponents.map((definition) => buildComponentModel(entity, definition))
  };
}

function buildComponentModel(
  entity: SceneEntityDocumentV1,
  definition: InspectorComponentDefinition
): EntityInspectorComponentModel {
  const componentValue = entity[definition.component] as Record<string, unknown> | undefined;

  return {
    component: definition.component,
    label: definition.label,
    present: componentValue !== undefined,
    fields: definition.fields.map((field) => ({
      ...field,
      value: readFieldValue(componentValue, field)
    }))
  };
}

function readFieldValue(
  componentValue: Record<string, unknown> | undefined,
  field: InspectorFieldDefinition
): boolean | number | string {
  const value = componentValue?.[field.key];

  switch (field.type) {
    case 'boolean':
      return typeof value === 'boolean' ? value : field.defaultValue;
    case 'number':
      return typeof value === 'number' ? value : field.defaultValue;
    case 'select':
      return typeof value === 'number' || typeof value === 'string' ? value : field.defaultValue;
    case 'text':
    case 'asset-sprite':
    case 'asset-audio':
    case 'animation-clip':
    case 'entity-id':
      return typeof value === 'string' ? value : field.defaultValue;
  }
}

function numberField(key: string, label: string, defaultValue: number, min?: number): InspectorFieldDefinition {
  return {
    key,
    label,
    type: 'number',
    defaultValue,
    ...(min !== undefined ? { min } : {})
  };
}

function textField(key: string, label: string, defaultValue: string): InspectorFieldDefinition {
  return {
    key,
    label,
    type: 'text',
    defaultValue
  };
}

function referenceField(
  key: string,
  label: string,
  type: 'asset-sprite' | 'asset-audio' | 'animation-clip' | 'entity-id'
): InspectorFieldDefinition {
  return {
    key,
    label,
    type,
    defaultValue: ''
  };
}

function booleanField(key: string, label: string, defaultValue: boolean): InspectorFieldDefinition {
  return {
    key,
    label,
    type: 'boolean',
    defaultValue
  };
}
