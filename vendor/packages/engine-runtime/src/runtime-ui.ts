import type { EventBus } from '../../engine-core/src/index.js';
import {
  buildUiDrawCommands,
  layoutUi,
  routePointerEvent,
  type UiDrawCommand,
  type UiLayer,
  type UiPointerEvent,
  type UiPointerResult
} from '../../engine-ui/src/index.js';
import type { RuntimeSession } from './runtime-session.js';

export interface RuntimeUiOptions {
  readonly eventBus?: EventBus;
  readonly viewport?: { readonly width: number; readonly height: number };
}

export interface RuntimeUiBinding {
  readonly layer: UiLayer | undefined;
  setViewport(width: number, height: number): void;
  routePointer(event: UiPointerEvent): UiPointerResult;
  buildDrawCommands(out?: UiDrawCommand[]): UiDrawCommand[];
  setLabelText(nodeId: string, text: string): void;
}

const EMPTY_RESULT: UiPointerResult = { consumed: false };

export function attachRuntimeUi(session: RuntimeSession, options: RuntimeUiOptions = {}): RuntimeUiBinding {
  const layer = session.runtime.ui;

  if (layer !== undefined && options.viewport !== undefined) {
    layoutUi(layer, options.viewport);
  }

  return {
    layer,
    setViewport(width, height): void {
      if (layer !== undefined) {
        layoutUi(layer, { width, height });
      }
    },
    routePointer(event): UiPointerResult {
      if (layer === undefined) {
        return EMPTY_RESULT;
      }

      return routePointerEvent(layer, event, options.eventBus);
    },
    buildDrawCommands(out): UiDrawCommand[] {
      if (layer === undefined) {
        return out ?? [];
      }

      return buildUiDrawCommands(layer, out);
    },
    setLabelText(nodeId, text): void {
      if (layer === undefined) {
        return;
      }

      const node = layer.byId.get(nodeId);

      if (node === undefined) {
        return;
      }

      const mutable = node as { text: string };
      mutable.text = text;
    }
  };
}
