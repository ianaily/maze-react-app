import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packagesRoot = resolve(repoRoot, 'packages');

const allowedPackageDeps = new Map([
  ['engine-animation', new Set(['engine-core'])],
  ['engine-asset', new Set()],
  ['engine-audio', new Set(['engine-asset', 'engine-core'])],
  ['engine-behavior', new Set(['engine-core', 'engine-scene'])],
  ['engine-camera', new Set(['engine-core', 'engine-render'])],
  ['engine-character', new Set(['engine-core', 'engine-physics'])],
  ['engine-core', new Set()],
  ['engine-debug', new Set(['engine-core', 'engine-math', 'engine-physics', 'engine-render'])],
  ['engine-editor', new Set(['engine-asset', 'engine-prefab', 'engine-scene', 'engine-tilemap', 'engine-ui'])],
  ['engine-input', new Set()],
  ['engine-math', new Set()],
  ['engine-physics', new Set(['engine-core', 'engine-math'])],
  ['engine-prefab', new Set(['engine-scene'])],
  ['engine-project', new Set()],
  ['engine-render', new Set(['engine-core', 'engine-math'])],
  ['engine-render-canvas', new Set(['engine-render'])],
  ['engine-runtime', new Set(['engine-animation', 'engine-audio', 'engine-behavior', 'engine-camera', 'engine-character', 'engine-core', 'engine-input', 'engine-particles', 'engine-physics', 'engine-render', 'engine-scene', 'engine-state', 'engine-tilemap', 'engine-tween', 'engine-ui'])],
  ['engine-scene', new Set(['engine-animation', 'engine-asset', 'engine-audio', 'engine-behavior', 'engine-camera', 'engine-character', 'engine-core', 'engine-particles', 'engine-physics', 'engine-render', 'engine-tilemap', 'engine-tween', 'engine-ui'])],
  ['engine-particles', new Set(['engine-core', 'engine-render'])],
  ['engine-state', new Set(['engine-core'])],
  ['engine-tilemap', new Set(['engine-asset', 'engine-core', 'engine-physics', 'engine-render'])],
  ['engine-timer', new Set(['engine-core'])],
  ['engine-tween', new Set(['engine-core'])],
  ['engine-ui', new Set(['engine-core'])]
]);

const errors = [];

for (const file of listTypeScriptFiles(packagesRoot)) {
  const sourcePackage = packageNameOf(file);

  if (sourcePackage === undefined) {
    errors.push(`${formatPath(file)} is not under a known package.`);
    continue;
  }

  const allowedDeps = allowedPackageDeps.get(sourcePackage);

  if (allowedDeps === undefined) {
    errors.push(`Package ${sourcePackage} is missing from scripts/check-boundaries.mjs.`);
    continue;
  }

  const source = readFileSync(file, 'utf8');

  for (const specifier of importSpecifiers(source)) {
    const targetPackage = packageNameForSpecifier(file, specifier);

    if (targetPackage === undefined || targetPackage === sourcePackage) {
      continue;
    }

    if (!allowedDeps.has(targetPackage)) {
      errors.push(`${formatPath(file)} imports ${targetPackage} via "${specifier}", but ${sourcePackage} may only depend on ${formatAllowed(allowedDeps)}.`);
    }
  }
}

if (errors.length > 0) {
  console.error('Package boundary check failed:');

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exitCode = 1;
} else {
  console.log('Package boundary check passed.');
}

function* listTypeScriptFiles(directory) {
  for (const entry of readdirSync(directory)) {
    const path = resolve(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      yield* listTypeScriptFiles(path);
      continue;
    }

    if (entry.endsWith('.ts') && !entry.endsWith('.d.ts')) {
      yield path;
    }
  }
}

function importSpecifiers(source) {
  const specifiers = [];
  const pattern = /\b(?:import|export)\s+(?:type\s+)?(?:[^'"]*?\s+from\s*)?['"]([^'"]+)['"]/g;
  const dynamicPattern = /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

  for (const match of source.matchAll(pattern)) {
    const specifier = match[1];

    if (specifier !== undefined) {
      specifiers.push(specifier);
    }
  }

  for (const match of source.matchAll(dynamicPattern)) {
    const specifier = match[1];

    if (specifier !== undefined) {
      specifiers.push(specifier);
    }
  }

  return specifiers;
}

function packageNameForSpecifier(file, specifier) {
  if (!specifier.startsWith('.')) {
    return packageNameFromBareSpecifier(specifier);
  }

  const target = resolve(dirname(file), specifier);
  return packageNameOf(target);
}

function packageNameFromBareSpecifier(specifier) {
  const [scopeOrName, name] = specifier.split('/');

  if (scopeOrName === undefined) {
    return undefined;
  }

  if (scopeOrName.startsWith('@')) {
    return name;
  }

  return existsSync(resolve(packagesRoot, scopeOrName)) ? scopeOrName : undefined;
}

function packageNameOf(path) {
  const relativePath = relative(packagesRoot, path);

  if (relativePath.startsWith('..') || relativePath === '') {
    return undefined;
  }

  const [packageName] = relativePath.split(sep);
  return packageName !== undefined && allowedPackageDeps.has(packageName) ? packageName : undefined;
}

function formatPath(path) {
  return relative(repoRoot, path).replaceAll(sep, '/');
}

function formatAllowed(allowedDeps) {
  return allowedDeps.size > 0 ? [...allowedDeps].sort().join(', ') : 'no other packages';
}
