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

function cleanupDirectory(path: string, preservePrimaryError = false): void {
  try {
    rmSync(path, { recursive: true, force: true });
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    // Cleanup is not publication. Restricted filesystems may leave obsolete
    // directories behind after their files have been removed successfully.
    if (preservePrimaryError || code === 'EPERM' || code === 'EACCES') return;
    throw error;
  }
}

function promoteVersionDirectory(versionRoot: string, finalVersionDir: string): void {
  try {
    renameSync(versionRoot, finalVersionDir);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== 'EXDEV' && code !== 'EPERM') throw error;

    // Some filesystems allow files to be created and renamed, but cannot move
    // directories between parents. The new hash is not referenced by the
    // manifest yet, so copying it completely before publishing remains safe.
    try {
      cpSync(versionRoot, finalVersionDir, { recursive: true, errorOnExist: true, force: false });
    } catch (copyError) {
      cleanupDirectory(finalVersionDir, true);
      throw copyError;
    }
  }
}

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
  const finalVersionDir = join(contentRoot, snapshot.contentHash);

  // A version currently referenced by the manifest is immutable. In particular,
  // retrying the same release must not remove it or prune its predecessor.
  if (previousContentHash === snapshot.contentHash && existsSync(finalVersionDir)) {
    return { previousContentHash, retainedHashes: listVersionDirectories(contentRoot).sort() };
  }

  const stagingRoot = join(contentRoot, `.staging-${snapshot.contentHash}`);
  const versionRoot = join(stagingRoot, snapshot.contentHash);
  mkdirSync(join(versionRoot, 'pages'), { recursive: true });
  let failed = false;

  try {
    for (const bodyFile of snapshot.bodyFiles) {
      const targetPath = join(stagingRoot, bodyFile.relativePath);
      mkdirSync(join(targetPath, '..'), { recursive: true });
      writeJsonAtomic(targetPath, bodyFile.payload);
    }

    mkdirSync(contentRoot, { recursive: true });

    if (existsSync(finalVersionDir)) {
      rmSync(finalVersionDir, { recursive: true, force: true });
    }
    promoteVersionDirectory(versionRoot, finalVersionDir);

    // Both the rename and copy paths finish all payloads before this atomic
    // manifest replacement makes the new version visible to readers.
    writeJsonAtomic(join(contentRoot, MANIFEST_FILENAME), toManifest(snapshot));

    const retained = new Set<string>([snapshot.contentHash]);
    if (previousContentHash && previousContentHash !== snapshot.contentHash) {
      retained.add(previousContentHash);
    }

    for (const hashDir of listVersionDirectories(contentRoot)) {
      if (!retained.has(hashDir)) {
        cleanupDirectory(join(contentRoot, hashDir));
      }
    }

    return {
      previousContentHash,
      retainedHashes: [...retained].sort(),
    };
  } catch (error) {
    failed = true;
    throw error;
  } finally {
    cleanupDirectory(stagingRoot, failed);
  }
}

/** Test helper: copy an existing version directory into a new hash slot. */
export function seedVersionDirectory(contentRoot: string, hash: string, sourceDir: string): void {
  const target = join(contentRoot, hash);
  mkdirSync(contentRoot, { recursive: true });
  cpSync(sourceDir, target, { recursive: true });
}
