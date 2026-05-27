import type { EditorCommand } from './scene-commands.js';

export function createCommandGroup(name: string, commands: readonly EditorCommand[]): EditorCommand {
  const commandSnapshot = [...commands];

  if (commandSnapshot.length === 0) {
    throw new Error('Command group must contain at least one command.');
  }

  return {
    name,
    apply(document) {
      let nextDocument = document;
      const undoCommands: EditorCommand[] = [];

      for (const command of commandSnapshot) {
        const result = command.apply(nextDocument);
        nextDocument = result.document;
        undoCommands.push(result.undo);
      }

      return {
        document: nextDocument,
        undo: createCommandGroup(`undo ${name}`, undoCommands.reverse())
      };
    }
  };
}
