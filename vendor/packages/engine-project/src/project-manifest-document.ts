export interface ProjectSceneEntryV1 {
  readonly id: string;
  readonly path: string;
  readonly label?: string;
}

export interface ProjectManifestDocumentV1 {
  readonly version: 1;
  readonly name?: string;
  readonly defaultSceneId?: string;
  readonly scenes?: readonly ProjectSceneEntryV1[];
  readonly assetRoots?: readonly string[];
}

export type ProjectManifestDocument = ProjectManifestDocumentV1;

export interface ProjectSceneEntry extends ProjectSceneEntryV1 {}
