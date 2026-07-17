import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { toManifest } from './transform.js';
import { validateSnapshot } from './validate.js';
import type { ContentManifest, StaticContentSnapshot } from './types.js';

export const CONTENT_ROOT_DIR = 'public/content';
export const MANIFEST_FILENAME = 'manifest.json';

const HASH_DIR_PATTERN = /^[a-f0-9]{16}$/;

function writeJsonAtomic(targetPath: string, value: unknown): void {
  const tmpPath = `${targetPath}.tmp`;
  writeFileSync(tmpPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  renameSync(tmpPath, targetPath);
}

export function readExistingManifest(contentRoot: string): ContentManifest | null {
  const manifestPath = join(contentRoot, MANIFEST_FILENAME);
  if (!existsSync(manifestPath)) return null;
  return JSON.parse(readFileSync(manifestPath, 'utf8')) as ContentManifest;
}

export function listVersionDirectories(contentRoot: string): string[] {
  if (!existsSync(contentRoot)) return [];
  return readdirSync(contentRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && HASH_DIR_PATTERN.test(entry.name))
    .map((entry) => entry.name);
}

export function writeStaticContentSnapshot(
  contentRoot: string,
  snapshot: StaticContentSnapshot
): { previousContentHash: string | null; retainedHashes: string[] } {
  validateSnapshot(snapshot);

  const previousManifest = readExistingManifest(contentRoot);
  const previousContentHash = previousManifest?.contentHash ?? null;

  const stagingRoot = join(contentRoot, `.staging-${snapshot.contentHash}`);
  const versionRoot = join(stagingRoot, snapshot.contentHash);
  mkdirSync(join(versionRoot, 'pages'), { recursive: true });

  for (const bodyFile of snapshot.bodyFiles) {
    const targetPath = join(stagingRoot, bodyFile.relativePath);
    mkdirSync(join(targetPath, '..'), { recursive: true });
    writeJsonAtomic(targetPath, bodyFile.payload);
  }

  mkdirSync(contentRoot, { recursive: true });

  const finalVersionDir = join(contentRoot, snapshot.contentHash);
  if (existsSync(finalVersionDir)) {
    rmSync(finalVersionDir, { recursive: true, force: true });
  }
  renameSync(versionRoot, finalVersionDir);

  writeJsonAtomic(join(contentRoot, MANIFEST_FILENAME), toManifest(snapshot));

  const retained = new Set<string>([snapshot.contentHash]);
  if (previousContentHash && previousContentHash !== snapshot.contentHash) {
    retained.add(previousContentHash);
  }

  for (const hashDir of listVersionDirectories(contentRoot)) {
    if (!retained.has(hashDir)) {
      rmSync(join(contentRoot, hashDir), { recursive: true, force: true });
    }
  }

  rmSync(stagingRoot, { recursive: true, force: true });

  return {
    previousContentHash,
    retainedHashes: [...retained].sort(),
  };
}

/** Test helper: copy an existing version directory into a new hash slot. */
export function seedVersionDirectory(contentRoot: string, hash: string, sourceDir: string): void {
  const target = join(contentRoot, hash);
  mkdirSync(contentRoot, { recursive: true });
  cpSync(sourceDir, target, { recursive: true });
}
