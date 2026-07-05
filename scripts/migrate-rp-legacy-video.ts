/**
 * Migrate legacy relyingParty.video → media.videos in community-catalog source JSON.
 *
 * Usage:
 *   tsx scripts/migrate-rp-legacy-video.ts          # dry run
 *   tsx scripts/migrate-rp-legacy-video.ts --apply  # write files
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyRpMediaNormalization } from '../src/lib/normalize-rp-media.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const catalogsGlobRoot = path.join(repoRoot, 'community-catalogs');
const apply = process.argv.includes('--apply');

type CatalogFile = {
  relyingParties?: Array<Record<string, unknown>>;
};

function listCatalogFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listCatalogFiles(full));
    } else if (entry.isFile() && entry.name === 'rp-catalog.json') {
      out.push(full);
    }
  }
  return out.sort();
}

function migrateCatalog(filePath: string): number {
  const raw = fs.readFileSync(filePath, 'utf8');
  const catalog = JSON.parse(raw) as CatalogFile;
  const rps = Array.isArray(catalog.relyingParties) ? catalog.relyingParties : [];
  let changed = 0;

  catalog.relyingParties = rps.map((rp) => {
    if (!rp || typeof rp !== 'object' || !('video' in rp)) {
      return rp;
    }
    changed += 1;
    return applyRpMediaNormalization(rp as { video?: string; media?: { videos?: string[]; images?: string[] } });
  });

  if (changed > 0 && apply) {
    fs.writeFileSync(filePath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  }

  return changed;
}

let total = 0;
for (const filePath of listCatalogFiles(catalogsGlobRoot)) {
  const rel = path.relative(repoRoot, filePath);
  const count = migrateCatalog(filePath);
  if (count > 0) {
    total += count;
    console.log(`${apply ? 'updated' : 'would update'} ${count} RP(s) in ${rel}`);
  }
}

if (total === 0) {
  console.log('No legacy video fields found.');
} else if (!apply) {
  console.log(`Dry run: ${total} RP(s) would be migrated. Re-run with --apply to write.`);
} else {
  console.log(`Migrated ${total} RP(s).`);
}
