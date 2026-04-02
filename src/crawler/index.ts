/**
 * FIDES RP Catalog Crawler
 * 
 * Aggregates relying party data from:
 * 1. Community-contributed catalogs (local files)
 * 2. GitHub repository (for CI/CD)
 * 3. DID-registered providers (automatic resolution)
 */

import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { hostname } from 'os';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import type {
  RPCatalog,
  NormalizedRP,
  AggregatedRPData,
  RPProvider,
  Readiness
} from '../types/rp.js';
import { loadCredentialSectorMap, resolveCanonicalSectors } from '../credentialSectors.js';

// Configuration
const CONFIG = {
  localCommunityDir: path.join(process.cwd(), 'community-catalogs'),
  outputPath: path.join(process.cwd(), 'data/aggregated.json'),
  wpPluginDataPath: path.join(process.cwd(), 'wordpress-plugin/fides-rp-catalog/data/aggregated.json'),
  didRegistryPath: path.join(process.cwd(), 'data/did-registry.json'),
  schemaPath: path.join(process.cwd(), 'schemas/rp-catalog.schema.json'),
  rpHistoryStatePath: path.join(process.cwd(), 'data/rp-history-state.json'),
  githubRepo: {
    enabled: process.env.GITHUB_ACTIONS === 'true',
    owner: 'FIDEScommunity',
    repo: 'fides-rp-catalog',
    path: 'community-catalogs'
  }
};

const ORGANIZATION_CATALOG_URL =
  'https://raw.githubusercontent.com/FIDEScommunity/fides-organization-catalog/main/data/aggregated.json';
const ORGANIZATION_CATALOG_LOCAL_PATHS = [
  process.env.ORGANIZATION_CATALOG_AGGREGATED_PATH,
  path.join(process.cwd(), '..', 'organization-catalog', 'data', 'aggregated.json')
].filter(Boolean) as string[];

interface OrgCatalogEntry {
  id: string;
  name: string;
  identifiers?: { did?: string };
  website?: string;
  logoUri?: string;
  contact?: { email?: string; support?: string };
  legalName?: string;
}

function isLocalDevHost(): boolean {
  const host = hostname();
  return host !== '' && (host.endsWith('.local') || host === 'localhost');
}

function orgEntryToRPProvider(entry: OrgCatalogEntry): RPProvider {
  const p: RPProvider = { name: entry.name };
  if (entry.identifiers?.did) p.did = entry.identifiers.did;
  if (entry.website) p.website = entry.website;
  if (entry.logoUri) p.logo = entry.logoUri;
  if (entry.contact) p.contact = entry.contact;
  return p;
}

async function loadOrganizationCatalogMap(): Promise<Map<string, OrgCatalogEntry>> {
  const tryParse = (raw: string): Map<string, OrgCatalogEntry> => {
    const data = JSON.parse(raw) as { organizations?: OrgCatalogEntry[] };
    const map = new Map<string, OrgCatalogEntry>();
    for (const o of data.organizations || []) {
      if (o?.id) map.set(o.id, o);
    }
    return map;
  };

  if (isLocalDevHost()) {
    for (const localPath of ORGANIZATION_CATALOG_LOCAL_PATHS) {
      if (localPath && existsSync(localPath)) {
        try {
          const raw = await fs.readFile(localPath, 'utf-8');
          const map = tryParse(raw);
          console.log(`Using local organization catalog (${localPath}), ${map.size} org(s)`);
          return map;
        } catch (e) {
          console.warn('Could not parse local organization catalog:', (e as Error).message);
        }
      }
    }
  }

  try {
    const res = await fetch(ORGANIZATION_CATALOG_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { organizations?: OrgCatalogEntry[] };
    const map = new Map<string, OrgCatalogEntry>();
    for (const o of data.organizations || []) {
      if (o?.id) map.set(o.id, o);
    }
    console.log(`Using organization catalog from GitHub, ${map.size} org(s)`);
    return map;
  } catch (err) {
    console.warn('Could not fetch organization catalog:', (err as Error).message);
    for (const localPath of ORGANIZATION_CATALOG_LOCAL_PATHS) {
      if (localPath && existsSync(localPath)) {
        try {
          const raw = await fs.readFile(localPath, 'utf-8');
          const map = tryParse(raw);
          console.log(`Fallback local organization catalog (${localPath})`);
          return map;
        } catch (e) {
          console.warn('Could not parse local organization catalog:', (e as Error).message);
        }
      }
    }
    return new Map();
  }
}

interface RPHistoryEntry {
  firstSeenAt: string;
  lastSeenAt?: string;
}
type RPHistoryState = Record<string, RPHistoryEntry>;
const gitLastCommitDateCache = new Map<string, string | null>();

function toIsoString(value?: string): string | null {
  if (!value || typeof value !== 'string') return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

/**
 * Get last commit date for a repo-relative file path
 */
function getGitLastCommitDateForPath(repoRelativePath: string): string | null {
  if (!repoRelativePath) return null;
  const normalizedPath = repoRelativePath.replace(/\\/g, '/');
  if (gitLastCommitDateCache.has(normalizedPath)) {
    return gitLastCommitDateCache.get(normalizedPath) ?? null;
  }
  try {
    const output = execFileSync(
      'git',
      ['log', '-1', '--format=%aI', '--', normalizedPath],
      { cwd: process.cwd(), encoding: 'utf-8' }
    ).trim();
    const parsed = toIsoString(output || undefined);
    gitLastCommitDateCache.set(normalizedPath, parsed);
    return parsed;
  } catch {
    gitLastCommitDateCache.set(normalizedPath, null);
    return null;
  }
}

async function loadRPHistoryState(): Promise<RPHistoryState> {
  try {
    const data = await fs.readFile(CONFIG.rpHistoryStatePath, 'utf-8');
    const parsed = JSON.parse(data) as RPHistoryState;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch {
    return {};
  }
}

async function saveRPHistoryState(state: RPHistoryState): Promise<void> {
  await fs.mkdir(path.dirname(CONFIG.rpHistoryStatePath), { recursive: true });
  await fs.writeFile(CONFIG.rpHistoryStatePath, JSON.stringify(state, null, 2));
}

// Validator will be initialized asynchronously
let validateCatalog: ReturnType<typeof Ajv2020.prototype.compile>;

/**
 * Initialize the schema validator
 */
async function initValidator(): Promise<void> {
  const schema = JSON.parse(await fs.readFile(CONFIG.schemaPath, 'utf-8'));
  const ajv = new Ajv2020({ allErrors: true });
  addFormats(ajv);
  validateCatalog = ajv.compile(schema);
}

/**
 * Load featured configuration
 */
async function loadFeaturedConfig(): Promise<Set<string>> {
  const featuredSet = new Set<string>();
  
  try {
    const featuredPath = path.join(process.cwd(), 'data/featured.json');
    const content = await fs.readFile(featuredPath, 'utf-8');
    const config = JSON.parse(content);
    
    (config.featured || []).forEach((item: any) => {
      featuredSet.add(item.rpId);
    });
    
    console.log(`   ✨ Loaded ${featuredSet.size} featured RP(s)`);
  } catch (error) {
    console.log('   ℹ️  No featured configuration found (optional)');
  }
  
  return featuredSet;
}

/**
 * Normalize relying parties from a catalog (adds updatedAt, firstSeenAt; mutates rpHistoryState).
 * Like the wallet catalog: uses Git last-commit date of the source file as fallback for updatedAt
 * when the catalog does not provide it (requires fetch-depth: 0 in CI).
 */
function normalizeRPs(
  catalog: RPCatalog,
  provider: RPProvider,
  catalogUrl: string,
  source: 'did' | 'github' | 'local',
  featuredSet: Set<string>,
  rpHistoryState: RPHistoryState,
  gitLastCommitAt: string | null
): NormalizedRP[] {
  const fetchedAt = new Date().toISOString();
  return catalog.relyingParties.map(rp => {
    const rpAny = rp as unknown as Record<string, unknown>;
    const updatedAt =
      toIsoString(rpAny.updatedAt as string) ??
      toIsoString(rpAny.updated as string) ??
      toIsoString(catalog.lastUpdated) ??
      gitLastCommitAt ?? // Git last-commit date of catalog file (like wallet catalog)
      fetchedAt;

    const existingHistory = rpHistoryState[rp.id];
    const firstSeenAt =
      existingHistory?.firstSeenAt ??
      toIsoString(rpAny.firstSeenAt as string) ??
      toIsoString(rpAny.createdAt as string) ??
      toIsoString((rpAny.addedAt as string)) ??
      updatedAt ??
      fetchedAt;

    rpHistoryState[rp.id] = {
      firstSeenAt,
      lastSeenAt: fetchedAt
    };

    return {
      ...rp,
      orgId: catalog.orgId,
      provider,
      catalogUrl,
      fetchedAt,
      source,
      isFeatured: featuredSet.has(rp.id),
      updatedAt,
      firstSeenAt
    } as NormalizedRP;
  });
}

/**
 * Crawl local community catalogs
 */
async function crawlLocalCommunity(
  featuredSet: Set<string>,
  rpHistoryState: RPHistoryState,
  organizationById: Map<string, OrgCatalogEntry>
): Promise<{ rps: NormalizedRP[]; providers: Map<string, RPProvider> }> {
  const rps: NormalizedRP[] = [];
  const providers = new Map<string, RPProvider>();

  console.log('\n📁 Crawling community catalogs');

  try {
    const dirs = await fs.readdir(CONFIG.localCommunityDir);

    for (const dir of dirs) {
      const communityEntry = path.join(CONFIG.localCommunityDir, dir);
      try {
        const st = await fs.stat(communityEntry);
        if (!st.isDirectory()) continue;
      } catch {
        continue;
      }

      const catalogPath = path.join(communityEntry, 'rp-catalog.json');

      try {
        const content = await fs.readFile(catalogPath, 'utf-8');
        const catalog: RPCatalog = JSON.parse(content);

        if (!validateCatalog(catalog)) {
          console.error(`   ❌ Invalid catalog in ${dir}:`, validateCatalog.errors);
          continue;
        }

        const orgEntry = organizationById.get(catalog.orgId);
        if (!orgEntry) {
          console.error(
            `   ❌ Unknown orgId ${catalog.orgId} in ${dir} — add this organization to fides-organization-catalog first.`
          );
          continue;
        }
        const provider = orgEntryToRPProvider(orgEntry);

        const repoRelativePath = path.relative(process.cwd(), catalogPath);
        const gitLastCommitAt = getGitLastCommitDateForPath(repoRelativePath);

        console.log(`   📦 Processing: ${dir}`);
        const normalizedRPs = normalizeRPs(
          catalog,
          provider,
          catalogPath,
          'local',
          featuredSet,
          rpHistoryState,
          gitLastCommitAt
        );
        rps.push(...normalizedRPs);
        providers.set(catalog.orgId, provider);
        console.log(`      ✅ Found ${normalizedRPs.length} relying part${normalizedRPs.length === 1 ? 'y' : 'ies'}`);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          console.error(`   ❌ Error processing ${dir}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error reading community catalogs directory:', error);
  }

  return { rps, providers };
}

/**
 * Deduplicate RPs by ID, preferring certain sources
 */
function deduplicateRPs(rps: NormalizedRP[]): NormalizedRP[] {
  const rpMap = new Map<string, NormalizedRP>();
  
  // Priority: did > github > local
  const sourcePriority = { did: 3, github: 2, local: 1 };
  
  for (const rp of rps) {
    const existing = rpMap.get(rp.id);
    if (!existing || sourcePriority[rp.source] > sourcePriority[existing.source]) {
      rpMap.set(rp.id, rp);
    }
  }
  
  return Array.from(rpMap.values());
}

/**
 * Calculate statistics
 */
function calculateStats(rps: NormalizedRP[], providers: Map<string, RPProvider>): AggregatedRPData['stats'] {
  const byReadiness: Record<Readiness, number> = {
    'technical-demo': 0,
    'use-case-demo': 0,
    'production-pilot': 0,
    'production': 0
  };
  
  const bySector: Record<string, number> = {};
  const byCredentialFormat: Record<string, number> = {};

  for (const rp of rps) {
    // Count by readiness
    if (rp.readiness) {
      byReadiness[rp.readiness] = (byReadiness[rp.readiness] || 0) + 1;
    }

    // Count by sector
    if (rp.sectors) {
      for (const sector of rp.sectors) {
        bySector[sector] = (bySector[sector] || 0) + 1;
      }
    }

    // Count by credential format
    if (rp.credentialFormats) {
      for (const format of rp.credentialFormats) {
        byCredentialFormat[format] = (byCredentialFormat[format] || 0) + 1;
      }
    }
  }

  return {
    totalRPs: rps.length,
    totalProviders: providers.size,
    byReadiness,
    bySector,
    byCredentialFormat
  };
}

/**
 * Main crawl function
 */
async function crawl(): Promise<void> {
  console.log('🔍 Starting FIDES RP Catalog crawl...');

  await initValidator();
  const featuredSet = await loadFeaturedConfig();
  const rpHistoryState = await loadRPHistoryState();

  const organizationById = await loadOrganizationCatalogMap();

  const allRPs: NormalizedRP[] = [];
  const allProviders = new Map<string, RPProvider>();

  const community = await crawlLocalCommunity(featuredSet, rpHistoryState, organizationById);
  allRPs.push(...community.rps);
  community.providers.forEach((v, k) => allProviders.set(k, v));

  await saveRPHistoryState(rpHistoryState);

  const dedupedRPs = deduplicateRPs(allRPs);

  const credSectorMap = await loadCredentialSectorMap(process.cwd());
  const relyingPartiesWithSectors: NormalizedRP[] = dedupedRPs.map(rp => {
    const sectors = resolveCanonicalSectors(rp as unknown as Record<string, unknown>, credSectorMap);
    return { ...rp, sectors };
  });

  // Calculate stats
  const stats = calculateStats(relyingPartiesWithSectors, allProviders);

  // Build aggregated data
  const aggregated: AggregatedRPData = {
    relyingParties: relyingPartiesWithSectors,
    providers: Array.from(allProviders.values()),
    lastUpdated: new Date().toISOString(),
    stats
  };

  // Ensure output directory exists
  await fs.mkdir(path.dirname(CONFIG.outputPath), { recursive: true });
  
  // Write to data folder
  await fs.writeFile(CONFIG.outputPath, JSON.stringify(aggregated, null, 2));
  
  // Also copy to WordPress plugin data folder
  try {
    await fs.mkdir(path.dirname(CONFIG.wpPluginDataPath), { recursive: true });
    await fs.writeFile(CONFIG.wpPluginDataPath, JSON.stringify(aggregated, null, 2));
  } catch (error) {
    console.warn('Could not copy to WordPress plugin folder:', error);
  }

  console.log(`\n📊 Aggregation complete:`);
  console.log(`   Total relying parties: ${stats.totalRPs}`);
  console.log(`   Total providers: ${stats.totalProviders}`);
  console.log(`   Output: ${CONFIG.outputPath}`);
}

// Run crawler
crawl().catch(console.error);

