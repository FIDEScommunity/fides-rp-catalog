/**
 * FIDES RP Catalog Crawler
 * 
 * Aggregates relying party data from:
 * 1. Community-contributed catalogs (local files)
 * 2. GitHub repository (for CI/CD)
 * 3. DID-registered providers (automatic resolution)
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import type { 
  RPCatalog, 
  NormalizedRP, 
  AggregatedRPData, 
  RPProvider,
  Readiness 
} from '../types/rp.js';

// Configuration
const CONFIG = {
  localCommunityDir: path.join(process.cwd(), 'community-catalogs'),
  outputPath: path.join(process.cwd(), 'data/aggregated.json'),
  wpPluginDataPath: path.join(process.cwd(), 'wordpress-plugin/fides-rp-catalog/data/aggregated.json'),
  didRegistryPath: path.join(process.cwd(), 'data/did-registry.json'),
  schemaPath: path.join(process.cwd(), 'schemas/rp-catalog.schema.json'),
  githubRepo: {
    enabled: process.env.GITHUB_ACTIONS === 'true',
    owner: 'FIDEScommunity',
    repo: 'fides-rp-catalog',
    path: 'community-catalogs'
  }
};

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
 * Normalize relying parties from a catalog
 */
function normalizeRPs(
  catalog: RPCatalog, 
  catalogUrl: string,
  source: 'did' | 'github' | 'local'
): NormalizedRP[] {
  return catalog.relyingParties.map(rp => ({
    ...rp,
    provider: catalog.provider,
    catalogUrl,
    fetchedAt: new Date().toISOString(),
    source
  }));
}

/**
 * Crawl local community catalogs
 */
async function crawlLocalCommunity(): Promise<{ rps: NormalizedRP[], providers: Map<string, RPProvider> }> {
  const rps: NormalizedRP[] = [];
  const providers = new Map<string, RPProvider>();

  console.log('\n📁 Crawling community catalogs');

  try {
    const dirs = await fs.readdir(CONFIG.localCommunityDir);
    
    for (const dir of dirs) {
      const catalogPath = path.join(CONFIG.localCommunityDir, dir, 'rp-catalog.json');
      
      try {
        const content = await fs.readFile(catalogPath, 'utf-8');
        const catalog: RPCatalog = JSON.parse(content);
        
        // Validate
        if (!validateCatalog(catalog)) {
          console.error(`   ❌ Invalid catalog in ${dir}:`, validateCatalog.errors);
          continue;
        }
        
        console.log(`   📦 Processing: ${dir}`);
        const normalizedRPs = normalizeRPs(catalog, catalogPath, 'local');
        rps.push(...normalizedRPs);
        providers.set(catalog.provider.did || catalog.provider.name, catalog.provider);
        console.log(`      ✅ Found ${normalizedRPs.length} relying part${normalizedRPs.length === 1 ? 'y' : 'ies'}`);
        
      } catch (error) {
        // Skip directories without rp-catalog.json
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
  
  // Initialize validator
  await initValidator();

  const allRPs: NormalizedRP[] = [];
  const allProviders = new Map<string, RPProvider>();

  // 1. Crawl local community catalogs
  const community = await crawlLocalCommunity();
  allRPs.push(...community.rps);
  community.providers.forEach((v, k) => allProviders.set(k, v));

  // Deduplicate
  const dedupedRPs = deduplicateRPs(allRPs);

  // Calculate stats
  const stats = calculateStats(dedupedRPs, allProviders);

  // Build aggregated data
  const aggregated: AggregatedRPData = {
    relyingParties: dedupedRPs,
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

