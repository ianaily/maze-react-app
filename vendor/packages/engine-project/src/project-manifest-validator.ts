import type { ProjectManifestDocument } from './project-manifest-document.js';

export function validateProjectManifest(manifest: ProjectManifestDocument): void {
  if (manifest.version !== 1) {
    throw new Error(`Unsupported project manifest version: ${manifest.version}`);
  }

  const sceneIds = new Set<string>();

  for (const scene of manifest.scenes ?? []) {
    if (typeof scene.id !== 'string' || scene.id.length === 0) {
      throw new Error('Project scene entry requires a non-empty id.');
    }

    if (typeof scene.path !== 'string' || scene.path.length === 0) {
      throw new Error(`Project scene "${scene.id}" requires a non-empty path.`);
    }

    if (isAbsoluteLikePath(scene.path)) {
      throw new Error(`Project scene path must be relative to the project root: ${scene.path}`);
    }

    if (sceneIds.has(scene.id)) {
      throw new Error(`Duplicate project scene id: ${scene.id}`);
    }

    sceneIds.add(scene.id);
  }

  if (manifest.defaultSceneId !== undefined && !sceneIds.has(manifest.defaultSceneId)) {
    throw new Error(`Project defaultSceneId is not registered: ${manifest.defaultSceneId}`);
  }

  for (const root of manifest.assetRoots ?? []) {
    if (typeof root !== 'string' || root.length === 0) {
      throw new Error('Project asset root must be a non-empty string.');
    }

    if (isAbsoluteLikePath(root)) {
      throw new Error(`Project asset root must be relative to the project root: ${root}`);
    }
  }
}

export function findProjectSceneEntry(
  manifest: ProjectManifestDocument,
  id: string
): ProjectManifestDocument['scenes'] extends readonly (infer T)[] | undefined ? T | undefined : never;
export function findProjectSceneEntry(manifest: ProjectManifestDocument, id: string) {
  return manifest.scenes?.find((entry) => entry.id === id);
}

function isAbsoluteLikePath(value: string): boolean {
  if (value.startsWith('/') || value.startsWith('\\')) {
    return true;
  }

  if (/^[A-Za-z]:[\\/]/.test(value)) {
    return true;
  }

  if (value.includes('..')) {
    return true;
  }

  return false;
}
