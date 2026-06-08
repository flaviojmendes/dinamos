/**
 * One-time migration: seed the `content_modules` table from the built-in
 * DEFAULT_MODULES list. Run with:
 *
 *   npm run db:seed-modules
 *
 * Idempotent: upserts by key, so re-running refreshes labels/tiers/paths
 * without creating duplicates. After seeding, modules are managed via the
 * admin CMS at /admin/modules.
 */
import { db } from '../db/client';
import { contentModules } from '../db/schema';
import { DEFAULT_MODULES } from '../../src/config/contentRegistry';

async function main() {
  let seeded = 0;
  for (let i = 0; i < DEFAULT_MODULES.length; i++) {
    const m = DEFAULT_MODULES[i];
    await db
      .insert(contentModules)
      .values({
        key: m.id,
        label: m.label,
        tier: m.tier,
        base: m.base,
        paths: m.paths ?? null,
        orderIndex: i,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: contentModules.key,
        set: {
          label: m.label,
          tier: m.tier,
          base: m.base,
          paths: m.paths ?? null,
          orderIndex: i,
          updatedAt: new Date(),
        },
      });
    seeded++;
  }
  console.log(`\nSeeded/updated ${seeded} modules.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Module seed failed:', err);
  process.exit(1);
});
