export type AssetPreloadKind = 'image' | 'audio' | 'binary';

export interface AssetPreloadRequest {
  readonly id: string;
  readonly url: string;
  readonly kind: AssetPreloadKind;
}

export interface AssetPreloadResult {
  readonly id: string;
  readonly url: string;
  readonly kind: AssetPreloadKind;
  readonly value: HTMLImageElement | ArrayBuffer | Blob;
}

export interface AssetPreloadProgress {
  readonly loaded: number;
  readonly total: number;
  readonly id: string;
}

export interface AssetPreloadOptions {
  readonly onProgress?: (progress: AssetPreloadProgress) => void;
  readonly fetcher?: typeof fetch;
  readonly imageFactory?: () => HTMLImageElement;
  readonly signal?: AbortSignal;
}

/**
 * Tiny preload helper that does not depend on the scene runtime. Use it to
 * fetch every asset a non-scene game needs before showing the first frame,
 * with a progress callback for loading screens.
 */
export class AssetPreloader {
  private readonly requests: AssetPreloadRequest[] = [];
  private readonly seenIds = new Set<string>();

  add(id: string, url: string, kind: AssetPreloadKind): this {
    if (id.length === 0) {
      throw new Error('AssetPreloader requires a non-empty asset id.');
    }

    if (this.seenIds.has(id)) {
      throw new Error(`AssetPreloader already tracks id: ${id}`);
    }

    this.seenIds.add(id);
    this.requests.push({ id, url, kind });
    return this;
  }

  list(): readonly AssetPreloadRequest[] {
    return this.requests;
  }

  async preloadAll(options: AssetPreloadOptions = {}): Promise<AssetPreloadResult[]> {
    const fetcher = options.fetcher ?? globalFetch();
    const imageFactory = options.imageFactory ?? defaultImageFactory;
    const results: AssetPreloadResult[] = [];

    for (let index = 0; index < this.requests.length; index += 1) {
      const request = this.requests[index];

      if (request === undefined) {
        continue;
      }

      if (options.signal?.aborted === true) {
        throw new Error('AssetPreloader aborted.');
      }

      const result = await this.loadOne(request, fetcher, imageFactory, options.signal);
      results.push(result);
      options.onProgress?.({
        loaded: index + 1,
        total: this.requests.length,
        id: request.id
      });
    }

    return results;
  }

  private async loadOne(
    request: AssetPreloadRequest,
    fetcher: typeof fetch,
    imageFactory: () => HTMLImageElement,
    signal: AbortSignal | undefined
  ): Promise<AssetPreloadResult> {
    if (request.kind === 'image') {
      const image = await loadImage(request.url, imageFactory);
      return { id: request.id, url: request.url, kind: 'image', value: image };
    }

    const response = await fetcher(request.url, signal !== undefined ? { signal } : undefined);

    if (!response.ok) {
      throw new Error(`Failed to preload asset "${request.id}" from ${request.url}: ${response.status}`);
    }

    if (request.kind === 'audio') {
      const blob = await response.blob();
      return { id: request.id, url: request.url, kind: 'audio', value: blob };
    }

    const buffer = await response.arrayBuffer();
    return { id: request.id, url: request.url, kind: 'binary', value: buffer };
  }
}

const loadImage = (url: string, factory: () => HTMLImageElement): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = factory();

    image.onload = (): void => resolve(image);
    image.onerror = (): void => reject(new Error(`Image preload failed: ${url}`));
    image.src = url;
  });
};

const globalFetch = (): typeof fetch => {
  if (typeof fetch === 'function') {
    return fetch;
  }

  throw new Error('AssetPreloader requires a fetch implementation. Pass options.fetcher.');
};

const defaultImageFactory = (): HTMLImageElement => {
  if (typeof Image === 'undefined') {
    throw new Error('AssetPreloader requires an Image constructor. Pass options.imageFactory.');
  }

  return new Image();
};
