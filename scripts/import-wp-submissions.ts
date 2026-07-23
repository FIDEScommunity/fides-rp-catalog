#!/usr/bin/env tsx
/**
 * Import published WordPress RP submissions into community-catalogs/.
 *
 * Merges one relying party object per export entry into the provider's rp-catalog.json
 * (grouped by org slug). Preserves sibling RPs in the same file.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(process.cwd());
const COMMUNITY_DIR = path.join(ROOT, 'community-catalogs');
const STATE_PATH = path.join(ROOT, 'data/wp-submission-state.json');
// Committed export file (primary source): WordPress writes this via the GitHub
// Contents API; its push triggers the sync workflow, which reads the file
// locally — no ~65 KB repository_dispatch cap and no WAF-blocked HTTP pull.
const WP_EXPORT_FILE = process.env.FIDES_WP_EXPORT_FILE
  ? path.resolve(ROOT, process.env.FIDES_WP_EXPORT_FILE)
  : path.join(ROOT, 'data/wp-export/rp.json');
const MARKER_FILENAME = '.wordpress-source';
const COMMUNITY_FILENAME = 'rp-catalog.json';
const SECRET_HEADER = 'X-FIDES-Catalog-Secret';
const USER_AGENT = 'FIDES-Catalog-Automation/1.0';

function wpExportBlockHint(body: string, status: number): string | null {
  if (body.includes('sgcaptcha') || body.includes('.well-known/captcha')) {
    return [
      `SiteGround Anti-Bot AI blocked this request (HTTP ${status}).`,
      'GitHub Actions cannot solve the captcha challenge.',
      'Fix: enable GitHub push sync in WP Settings → FIDES Catalog SEO (PAT with repo + workflow scope),',
      'or ask SiteGround support to disable Anti-Bot AI for /wp-json/fides-catalog/.',
    ].join(' ');
  }
  return null;
}

export type WpExportEntry = {
  itemId: string;
  slug: string;
  filename: string;
  source: string;
  document: Record<string, unknown>;
  publishedAt?: string | null;
  updatedAt?: string | null;
};

export type WpExportPayload = {
  schemaVersion: string;
  catalogType: string;
  generatedAt: string;
  entries: WpExportEntry[];
};

export type ManagedRp = {
  slug: string;
  rpId: string;
};

export type WpSubmissionState = {
  schemaVersion: '1.0.0';
  catalogType: string;
  lastImportAt: string | null;
  managedRps: ManagedRp[];
};

type RpRecord = Record<string, unknown> & { id?: string };

type RpCatalogDoc = {
  $schema?: string;
  orgId?: string;
  relyingParties?: RpRecord[];
  lastUpdated?: string;
};

type SlugGroup = {
  slug: string;
  entries: WpExportEntry[];
};

type ImportPlan = {
  groups: SlugGroup[];
  prune: ManagedRp[];
  skipped: Array<{ slug: string; reason: string }>;
};

function parseArgs(argv: string[]) {
  const apply = argv.includes('--apply');
  const wpUrl =
    (() => {
      const idx = argv.indexOf('--wp-url');
      if (idx >= 0 && argv[idx + 1]) return argv[idx + 1];
      return (
        process.env.FIDES_WP_EXPORT_URL
        ?? 'http://utrecht-demo.local/wp-json/fides-catalog/v1/export/rp'
      );
    })();
  const secret =
    (() => {
      const idx = argv.indexOf('--secret');
      if (idx >= 0 && argv[idx + 1]) return argv[idx + 1];
      return process.env.FIDES_CATALOG_SECRET ?? process.env.WP_INVALIDATE_SECRET ?? '';
    })();
  return { apply, wpUrl, secret };
}

function isSafeSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug);
}

export function emptyState(catalogType = 'rp'): WpSubmissionState {
  return {
    schemaVersion: '1.0.0',
    catalogType,
    lastImportAt: null,
    managedRps: [],
  };
}

export async function readState(): Promise<WpSubmissionState> {
  try {
    const raw = await fs.readFile(STATE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as WpSubmissionState;
    if (!parsed || !Array.isArray(parsed.managedRps)) {
      return emptyState();
    }
    return parsed;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return emptyState();
    }
    throw err;
  }
}

export function rpFromEntry(entry: WpExportEntry): RpRecord | null {
  const relyingParties = entry.document.relyingParties;
  if (!Array.isArray(relyingParties) || !relyingParties.length) return null;
  const rp = relyingParties[0];
  if (!rp || typeof rp !== 'object') return null;
  const id = String((rp as RpRecord).id || entry.itemId || '').trim();
  if (!id) return null;
  return { ...(rp as RpRecord), id };
}

export function mergeRpIntoCatalog(
  base: RpCatalogDoc | null,
  entry: WpExportEntry,
): RpCatalogDoc {
  const rp = rpFromEntry(entry);
  if (!rp) {
    throw new Error(`Export entry ${entry.itemId} has no relying party object.`);
  }
  const orgId = String(entry.document.orgId || '').trim();
  const relyingParties = Array.isArray(base?.relyingParties) ? [...base.relyingParties] : [];
  const idx = relyingParties.findIndex((r) => String(r.id || '') === String(rp.id));
  if (idx >= 0) {
    relyingParties[idx] = { ...relyingParties[idx], ...rp };
  } else {
    relyingParties.push(rp);
  }
  // Use the real last-modification time WordPress puts on the export document
  // (submission updated_at) so lastUpdated reflects the actual last change and
  // stays stable across pushes, instead of stamping "now" on every import.
  const entryLastUpdated =
    typeof entry.document.lastUpdated === 'string' ? entry.document.lastUpdated.trim() : '';
  return {
    $schema: 'https://fides.community/schemas/rp-catalog/v1',
    orgId: orgId || base?.orgId,
    relyingParties,
    lastUpdated: entryLastUpdated || base?.lastUpdated || new Date().toISOString(),
  };
}

export function buildImportPlan(entries: WpExportEntry[], previous: WpSubmissionState): ImportPlan {
  const plan: ImportPlan = { groups: [], prune: [], skipped: [] };
  const groupMap = new Map<string, WpExportEntry[]>();
  const currentManaged = new Map<string, ManagedRp>();

  for (const entry of entries) {
    const slug = entry.slug.trim();
    const rpId = entry.itemId.trim();
    if (!slug || !rpId || entry.filename !== COMMUNITY_FILENAME) {
      plan.skipped.push({ slug: slug || '(missing)', reason: 'invalid entry metadata' });
      continue;
    }
    if (!isSafeSlug(slug)) {
      plan.skipped.push({ slug, reason: 'unsafe slug' });
      continue;
    }
    if (!rpFromEntry(entry)) {
      plan.skipped.push({ slug, reason: `missing relying party in document (${rpId})` });
      continue;
    }
    const list = groupMap.get(slug) ?? [];
    list.push(entry);
    groupMap.set(slug, list);
    currentManaged.set(`${slug}:${rpId}`, { slug, rpId });
  }

  for (const [, list] of groupMap) {
    plan.groups.push({ slug: list[0]!.slug, entries: list });
  }

  for (const managed of previous.managedRps) {
    const key = `${managed.slug}:${managed.rpId}`;
    if (!currentManaged.has(key)) {
      plan.prune.push(managed);
    }
  }

  return plan;
}

export async function fetchWpExport(wpUrl: string, secret: string): Promise<WpExportPayload> {
  if (!secret.trim()) {
    throw new Error('Missing catalog secret. Set FIDES_CATALOG_SECRET or WP_INVALIDATE_SECRET.');
  }
  const response = await fetch(wpUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      [SECRET_HEADER]: secret,
      'User-Agent': USER_AGENT,
    },
    signal: AbortSignal.timeout(60_000),
  });
  const contentType = response.headers.get('content-type') ?? '';
  const body = await response.text();
  const blockHint = wpExportBlockHint(body, response.status);
  if (blockHint) {
    throw new Error(`${blockHint} Body starts with: ${body.slice(0, 160).replace(/\s+/g, ' ')}`);
  }
  if (!response.ok) {
    throw new Error(
      `WP export failed (HTTP ${response.status}, ${contentType}): ${body.slice(0, 300)}`,
    );
  }
  if (!contentType.includes('json')) {
    throw new Error(
      `WP export returned non-JSON (HTTP ${response.status}, ${contentType}). `
      + `Body starts with: ${body.slice(0, 200).replace(/\s+/g, ' ')}`,
    );
  }
  let payload: WpExportPayload;
  try {
    payload = JSON.parse(body) as WpExportPayload;
  } catch {
    throw new Error(
      `WP export JSON parse failed (HTTP ${response.status}). Body starts with: ${body.slice(0, 200).replace(/\s+/g, ' ')}`,
    );
  }
  if (!payload?.entries) throw new Error('WP export response is missing entries array.');
  return payload;
}

export function loadInlineExportPayload(): WpExportPayload | null {
  const inline = process.env.FIDES_WP_EXPORT_JSON?.trim();
  if (!inline) return null;
  try {
    const payload = JSON.parse(inline) as WpExportPayload;
    if (!payload?.entries || !Array.isArray(payload.entries)) {
      throw new Error('export_json is missing entries array.');
    }
    return payload;
  } catch (err) {
    throw new Error(
      `Invalid FIDES_WP_EXPORT_JSON: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

export async function loadCommittedExportPayload(
  filePath: string = WP_EXPORT_FILE,
): Promise<WpExportPayload | null> {
  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw err;
  }
  try {
    const payload = JSON.parse(raw) as WpExportPayload;
    if (!payload?.entries || !Array.isArray(payload.entries)) {
      throw new Error('committed export is missing entries array.');
    }
    return payload;
  } catch (err) {
    throw new Error(
      `Invalid committed export ${path.relative(ROOT, filePath)}: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

export async function loadExportPayload(wpUrl: string, secret: string): Promise<WpExportPayload> {
  const inline = loadInlineExportPayload();
  if (inline) {
    console.log('Using inline export payload (WordPress push sync).');
    return inline;
  }

  // Primary: the export file WordPress committed via the Contents API.
  const committed = await loadCommittedExportPayload();
  if (committed) {
    console.log(`Using committed WordPress export ${path.relative(ROOT, WP_EXPORT_FILE)}.`);
    return committed;
  }

  const event = process.env.GITHUB_EVENT_NAME?.trim();
  if (event === 'repository_dispatch') {
    throw new Error(
      'Missing FIDES_WP_EXPORT_JSON on repository_dispatch. '
      + 'Enable GitHub push sync in WP Settings → FIDES Catalog SEO, or run recovery via workflow_dispatch.',
    );
  }

  console.log(
    event === 'workflow_dispatch'
      ? 'Recovery sync: pulling export via HTTP (manual workflow).'
      : 'Pulling export via HTTP.',
  );
  return fetchWpExport(wpUrl, secret);
}

async function readCatalogAt(slug: string): Promise<RpCatalogDoc | null> {
  const filePath = path.join(COMMUNITY_DIR, slug, COMMUNITY_FILENAME);
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8')) as RpCatalogDoc;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

async function markerExists(slug: string): Promise<boolean> {
  try {
    await fs.access(path.join(COMMUNITY_DIR, slug, MARKER_FILENAME));
    return true;
  } catch {
    return false;
  }
}

async function readMarker(slug: string): Promise<{ rps?: Record<string, unknown> } | null> {
  try {
    const raw = await fs.readFile(path.join(COMMUNITY_DIR, slug, MARKER_FILENAME), 'utf8');
    return JSON.parse(raw) as { rps?: Record<string, unknown> };
  } catch {
    return null;
  }
}

function removeRpFromCatalog(doc: RpCatalogDoc, rpId: string): RpCatalogDoc {
  const relyingParties = (doc.relyingParties ?? []).filter((r) => String(r.id || '') !== rpId);
  return { ...doc, relyingParties, lastUpdated: new Date().toISOString() };
}

export async function applyImportPlan(
  plan: ImportPlan,
  apply: boolean,
  catalogType = 'rp',
): Promise<WpSubmissionState> {
  const managedRps: ManagedRp[] = [];

  for (const group of plan.groups) {
    let doc = await readCatalogAt(group.slug);
    for (const entry of group.entries) {
      doc = mergeRpIntoCatalog(doc, entry);
      managedRps.push({ slug: group.slug, rpId: entry.itemId });
    }

    const dir = path.join(COMMUNITY_DIR, group.slug);
    const catalogPath = path.join(dir, COMMUNITY_FILENAME);
    const markerPath = path.join(dir, MARKER_FILENAME);
    const marker = {
      source: 'wordpress',
      slug: group.slug,
      rps: Object.fromEntries(
        group.entries.map((e) => [e.itemId, { itemId: e.itemId, publishedAt: e.publishedAt ?? null }]),
      ),
      importedAt: new Date().toISOString(),
    };

    if (apply) {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(catalogPath, `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
      const existingMarker = (await readMarker(group.slug)) ?? {};
      const mergedRps = { ...(existingMarker.rps ?? {}), ...marker.rps };
      await fs.writeFile(
        markerPath,
        `${JSON.stringify({ ...marker, rps: mergedRps }, null, 2)}\n`,
        'utf8',
      );
    }
    console.log(`${apply ? 'WRITE' : 'DRY '} ${group.slug} (${group.entries.length} RP(s))`);
  }

  for (const managed of plan.prune) {
    const hasMarker = await markerExists(managed.slug);
    if (!hasMarker) {
      console.log(`SKIP  prune ${managed.slug}/${managed.rpId} — not WP-managed`);
      continue;
    }
    const doc = await readCatalogAt(managed.slug);
    if (!doc) continue;
    const next = removeRpFromCatalog(doc, managed.rpId);
    const dir = path.join(COMMUNITY_DIR, managed.slug);
    if (apply) {
      if ((next.relyingParties ?? []).length === 0) {
        await fs.rm(dir, { recursive: true, force: true });
        console.log(`PRUNE ${managed.slug} (empty after removing ${managed.rpId})`);
      } else {
        await fs.writeFile(
          path.join(dir, COMMUNITY_FILENAME),
          `${JSON.stringify(next, null, 2)}\n`,
          'utf8',
        );
        const marker = await readMarker(managed.slug);
        if (marker?.rps && managed.rpId in marker.rps) {
          delete marker.rps[managed.rpId];
          await fs.writeFile(
            path.join(dir, MARKER_FILENAME),
            `${JSON.stringify(marker, null, 2)}\n`,
            'utf8',
          );
        }
        console.log(`UPDATE ${managed.slug} — removed RP ${managed.rpId}`);
      }
    } else {
      console.log(`DRY  prune RP ${managed.rpId} from ${managed.slug}`);
    }
  }

  for (const skipped of plan.skipped) {
    console.log(`SKIP  ${skipped.slug} — ${skipped.reason}`);
  }

  const unique = new Map<string, ManagedRp>();
  for (const m of managedRps) unique.set(`${m.slug}:${m.rpId}`, m);

  return {
    schemaVersion: '1.0.0',
    catalogType,
    lastImportAt: apply ? new Date().toISOString() : null,
    managedRps: apply ? [...unique.values()].sort((a, b) => a.slug.localeCompare(b.slug)) : [...unique.values()],
  };
}

async function main() {
  const { apply, wpUrl, secret } = parseArgs(process.argv.slice(2));
  console.log(`WP export: ${wpUrl}`);
  console.log(`Mode: ${apply ? 'apply' : 'dry-run (pass --apply to write)'}`);

  const previous = await readState();
  const payload = await loadExportPayload(wpUrl, secret);
  const plan = buildImportPlan(payload.entries, previous);

  console.log(`Export entries: ${payload.entries.length}`);
  console.log(`Would write: ${plan.groups.length} provider file(s), prune: ${plan.prune.length} RP(s)`);

  const nextState = await applyImportPlan(plan, apply, payload.catalogType || 'rp');
  if (apply) {
    await fs.mkdir(path.dirname(STATE_PATH), { recursive: true });
    await fs.writeFile(STATE_PATH, `${JSON.stringify(nextState, null, 2)}\n`, 'utf8');
    console.log(`State updated: ${path.relative(ROOT, STATE_PATH)}`);
  }
}

const isMain = process.argv[1]
  ? fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
  : false;
if (isMain) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
