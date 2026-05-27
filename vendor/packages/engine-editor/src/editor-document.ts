import { validateScene, type SceneDocument } from '../../engine-scene/src/index.js';
import { createCommandGroup } from './command-group.js';
import { SelectionStore } from './selection-store.js';
import type { EditorCommand } from './scene-commands.js';

export class EditorDocument {
  readonly selection = new SelectionStore();

  private currentDocument: SceneDocument;
  private readonly undoStack: EditorCommand[] = [];
  private readonly redoStack: EditorCommand[] = [];

  constructor(document: SceneDocument) {
    validateScene(document);
    this.currentDocument = document;
    this.pruneSelection();
  }

  get document(): SceneDocument {
    return this.currentDocument;
  }

  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  execute(command: EditorCommand): SceneDocument {
    const result = command.apply(this.currentDocument);
    validateScene(result.document);
    this.currentDocument = result.document;
    this.undoStack.push(result.undo);
    this.redoStack.length = 0;
    this.pruneSelection();
    return this.currentDocument;
  }

  executeGroup(name: string, commands: readonly EditorCommand[]): SceneDocument {
    return this.execute(createCommandGroup(name, commands));
  }

  replaceDocument(document: SceneDocument): SceneDocument {
    validateScene(document);
    this.currentDocument = document;
    this.pruneSelection();
    return this.currentDocument;
  }

  undo(): boolean {
    const command = this.undoStack.pop();

    if (command === undefined) {
      return false;
    }

    const result = command.apply(this.currentDocument);
    validateScene(result.document);
    this.currentDocument = result.document;
    this.redoStack.push(result.undo);
    this.pruneSelection();
    return true;
  }

  redo(): boolean {
    const command = this.redoStack.pop();

    if (command === undefined) {
      return false;
    }

    const result = command.apply(this.currentDocument);
    validateScene(result.document);
    this.currentDocument = result.document;
    this.undoStack.push(result.undo);
    this.pruneSelection();
    return true;
  }

  private pruneSelection(): void {
    this.selection.retain(new Set(this.currentDocument.entities.map((entity) => entity.id)));
  }
}
