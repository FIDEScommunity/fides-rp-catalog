/**
 * Linkcheck script for RP catalog.
 * Reads data/aggregated.json, collects all URLs from relyingParties + providers,
 * checks each unique URL with HEAD, and writes data/linkcheck-report.json + linkcheck-summary.md.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const AGGREGATED_PATH = join(process.cwd(), 'data/aggregated.json');
const REPORT_JSON_PATH = join(process.cwd(), 'data/linkcheck-report.json');
const REPORT_MD_PATH = join(process.cwd(), 'data/linkcheck-summary.md');
const REQUEST_TIMEOUT_MS = 10_000;
const DELAY_BETWEEN_REQUESTS_MS = 300;

function isHttpUrl(s: string): boolean {
  return typeof s === 'string' && (s.startsWith('http://') || s.startsWith('https://'));
}

function addUrl(
  map: Map<string, { contexts: Array<{ itemId: string; field: string; providerName: string; providerEmail?: string }> }>,
  url: string,
  context: { itemId: string; field: string; providerName: string; providerEmail?: string }
) {
  const normalized = url.trim();
  if (!isHttpUrl(normalized)) return;
  const existing = map.get(normalized);
  if (existing) {
    if (!existing.contexts.some(c => c.itemId === context.itemId && c.field === context.field)) {
      existing.contexts.push(context);
    }
  } else {
    map.set(normalized, { contexts: [context] });
  }
}

interface RPItem {
  id: string;
  provider: { name: string; contact?: { email?: string }; website?: string; logo?: string };
  website?: string;
  logo?: string;
  documentation?: string;
  testCredentials?: string;
  apiEndpoint?: string;
  video?: string;
}

interface AggregatedData {
  relyingParties: RPItem[];
}

function collectRPUrls(
  rps: RPItem[],
  urlToContexts: Map<string, { contexts: Array<{ itemId: string; field: string; providerName: string; providerEmail?: string }> }>
) {
  for (const rp of rps) {
    const providerName = rp.provider?.name ?? 'Unknown';
    const providerEmail = rp.provider?.contact?.email?.trim() || undefined;
    const ctx = (field: string) => ({ itemId: rp.id, field, providerName, providerEmail });

    if (rp.website) addUrl(urlToContexts, rp.website, ctx('website'));
    if (rp.logo) addUrl(urlToContexts, rp.logo, ctx('logo'));
    if (rp.documentation) addUrl(urlToContexts, rp.documentation, ctx('documentation'));
    if (rp.testCredentials) addUrl(urlToContexts, rp.testCredentials, ctx('testCredentials'));
    if (rp.apiEndpoint) addUrl(urlToContexts, rp.apiEndpoint, ctx('apiEndpoint'));
    if (rp.video) addUrl(urlToContexts, rp.video, ctx('video'));
    if (rp.provider?.website) addUrl(urlToContexts, rp.provider.website, ctx('provider.website'));
    if (rp.provider?.logo) addUrl(urlToContexts, rp.provider.logo, ctx('provider.logo'));
    if (rp.provider?.contact?.support) addUrl(urlToContexts, rp.provider.contact.support, ctx('provider.contact.support'));
  }
}

async function checkUrl(url: string): Promise<{ ok: boolean; status?: number; error?: string }> {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { 'User-Agent': 'FIDES-RP-Catalog-Linkcheck/1.0' },
    });
    const ok = res.status >= 200 && res.status < 400;
    return ok ? { ok: true, status: res.status } : { ok: false, status: res.status, error: `HTTP ${res.status}` };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, error: message };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

interface LinkContext {
  itemId: string;
  field: string;
  providerName: string;
  providerEmail?: string;
}

interface BrokenEntry {
  url: string;
  status?: number;
  error: string;
  contexts: LinkContext[];
}

interface ByProviderEntry {
  email?: string;
  brokenUrls: Array<{ url: string; error: string; status?: number }>;
}

interface LinkcheckReport {
  runAt: string;
  totalUrls: number;
  brokenCount: number;
  broken: BrokenEntry[];
  byProvider: Record<string, ByProviderEntry>;
}

async function main() {
  const raw = readFileSync(AGGREGATED_PATH, 'utf-8');
  const data: AggregatedData = JSON.parse(raw);
  const rps = data.relyingParties ?? [];

  const urlToContexts = new Map<string, { contexts: LinkContext[] }>();
  collectRPUrls(rps, urlToContexts);

  const uniqueUrls = [...urlToContexts.keys()];
  const totalUrls = uniqueUrls.length;
  console.log(`Checking ${totalUrls} unique URL(s)...`);

  const broken: BrokenEntry[] = [];
  let checked = 0;
  for (const url of uniqueUrls) {
    const result = await checkUrl(url);
    if (!result.ok) {
      const entry = urlToContexts.get(url)!;
      broken.push({
        url,
        status: result.status,
        error: result.error ?? 'Unknown error',
        contexts: entry.contexts,
      });
    }
    checked++;
    if (checked % 50 === 0) console.log(`  ${checked}/${totalUrls}`);
    await sleep(DELAY_BETWEEN_REQUESTS_MS);
  }

  const byProvider: Record<string, ByProviderEntry> = {};
  for (const b of broken) {
    for (const ctx of b.contexts) {
      const name = ctx.providerName;
      if (!byProvider[name]) {
        byProvider[name] = { email: ctx.providerEmail, brokenUrls: [] };
      } else if (ctx.providerEmail && !byProvider[name].email) {
        byProvider[name].email = ctx.providerEmail;
      }
      const exists = byProvider[name].brokenUrls.some((u) => u.url === b.url);
      if (!exists) {
        byProvider[name].brokenUrls.push({
          url: b.url,
          error: b.error,
          status: b.status,
        });
      }
    }
  }

  const report: LinkcheckReport = {
    runAt: new Date().toISOString(),
    totalUrls,
    brokenCount: broken.length,
    broken,
    byProvider,
  };

  writeFileSync(REPORT_JSON_PATH, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`Report written to ${REPORT_JSON_PATH}`);

  let md = `# RP catalog linkcheck – ${report.runAt.slice(0, 10)}\n\n`;
  md += `- **Total URLs checked:** ${totalUrls}\n`;
  md += `- **Broken:** ${broken.length}\n\n`;
  if (broken.length > 0) {
    md += `## Broken links by provider\n\n`;
    for (const [providerName, entry] of Object.entries(byProvider)) {
      md += `### ${providerName}\n`;
      if (entry.email) md += `Contact: ${entry.email}\n\n`;
      for (const u of entry.brokenUrls) {
        md += `- ${u.url} — ${u.error}\n`;
      }
      md += `\n`;
    }
  }
  writeFileSync(REPORT_MD_PATH, md, 'utf-8');
  console.log(`Summary written to ${REPORT_MD_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
