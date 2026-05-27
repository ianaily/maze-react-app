#!/usr/bin/env node
// Re-snapshot the eng-2m engine into ./vendor/ from a sibling checkout.
//
// Usage:
//   node scripts/refresh-engine.mjs [path-to-eng-2m]
//
// Default source path: ../eng-2m
//
// Runs the engine's own pack-engine.mjs to produce a tarball, then extracts it
// into ./vendor/, replacing whatever was there before. This is the supported
// way to update the vendored engine; do not hand-edit files under vendor/.

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const engineArg = process.argv[2];
const engineRoot = resolve(projectRoot, engineArg ?? '../eng-2m');
const tarballPath = resolve(projectRoot, 'vendor', 'twodeng-engine-snapshot.tar.gz');
const vendorRoot = resolve(projectRoot, 'vendor');

if (!existsSync(engineRoot) || !statSync(engineRoot).isDirectory()) {
  console.error(`Engine source not found at: ${engineRoot}`);
  process.exit(1);
}

const packScript = join(engineRoot, 'scripts', 'pack-engine.mjs');
if (!existsSync(packScript)) {
  console.error(`Missing engine packer at: ${packScript}`);
  process.exit(1);
}

mkdirSync(vendorRoot, { recursive: true });

console.log(`Packing engine snapshot from ${engineRoot}...`);
execFileSync('node', [packScript, tarballPath], { stdio: 'inherit', cwd: engineRoot });

// Wipe previously extracted contents so removed packages don't linger.
for (const entry of ['packages', 'scripts', 'tsconfig.json']) {
  const target = join(vendorRoot, entry);
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
  }
}

console.log(`Extracting into ${vendorRoot}...`);
const extract = spawnSync('tar', ['-xf', tarballPath, '-C', vendorRoot], { stdio: 'inherit' });
if (extract.status !== 0) {
  console.error('tar extraction failed.');
  process.exit(extract.status ?? 1);
}

rmSync(tarballPath, { force: true });
console.log('Engine snapshot refreshed.');
