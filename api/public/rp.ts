import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loadRPData, type AggregatedRP } from '../../lib/aggregatedData';

function toNumber(val: unknown, fallback: number): number {
  const n = Number(val);
  return Number.isNaN(n) || n < 0 ? fallback : n;
}

function parseQueryArray(val: unknown): string[] {
  if (val == null) return [];
  if (Array.isArray(val)) {
    return val
      .flatMap((item) => String(item).split(','))
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
  return String(val)
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function acceptedCredentialsHaystack(rp: AggregatedRP): string {
  const parts: string[] = [];
  if (rp.acceptedCredentials?.length) parts.push(...rp.acceptedCredentials);
  if (rp.acceptedCredentialRefs?.length) {
    for (const ref of rp.acceptedCredentialRefs) parts.push(ref.credentialCatalogId);
  }
  return parts.join(' ').toLowerCase();
}

export default function handler(req: VercelRequest, res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  const data = loadRPData();
  let rps = [...data.relyingParties];

  const search = typeof req.query.search === 'string' ? req.query.search.toLowerCase() : undefined;
  const country = typeof req.query.country === 'string' ? req.query.country : undefined;
  const orgId = typeof req.query.orgId === 'string' ? req.query.orgId : undefined;
  const readiness = parseQueryArray(req.query.readiness);
  const status = parseQueryArray(req.query.status);
  const interactionMode =
    typeof req.query.interactionMode === 'string' ? req.query.interactionMode : undefined;
  const sectors = parseQueryArray(req.query.sector);
  const vcFormats = parseQueryArray(req.query.vcFormat);
  const interoperabilityProfiles = parseQueryArray(req.query.interoperabilityProfile);
  const featured =
    typeof req.query.featured === 'string'
      ? req.query.featured.toLowerCase() === 'true'
      : undefined;

  if (country) {
    const wanted = country.toUpperCase();
    rps = rps.filter((rp) => {
      if (rp.country && rp.country.toUpperCase() === wanted) return true;
      return (rp.countries || []).some((c) => c.toUpperCase() === wanted);
    });
  }

  if (orgId) {
    rps = rps.filter((rp) => rp.orgId === orgId);
  }

  if (readiness.length > 0) {
    const selected = new Set(readiness);
    rps = rps.filter((rp) => selected.has(rp.readiness));
  }

  if (status.length > 0) {
    const selected = new Set(status);
    rps = rps.filter((rp) => rp.status != null && selected.has(rp.status));
  }

  if (interactionMode) {
    rps = rps.filter((rp) => rp.interactionMode === interactionMode);
  }

  if (sectors.length > 0) {
    const selected = new Set(sectors);
    rps = rps.filter((rp) => (rp.sectors || []).some((s) => selected.has(s)));
  }

  if (vcFormats.length > 0) {
    const selected = new Set(vcFormats);
    rps = rps.filter((rp) => (rp.vcFormat || []).some((f) => selected.has(f)));
  }

  if (interoperabilityProfiles.length > 0) {
    const selected = new Set(interoperabilityProfiles);
    rps = rps.filter((rp) =>
      (rp.interoperabilityProfiles || []).some((p) => selected.has(p)),
    );
  }

  if (featured === true) {
    rps = rps.filter((rp) => rp.isFeatured === true);
  }

  if (search) {
    rps = rps.filter((rp) => {
      return (
        rp.name.toLowerCase().includes(search) ||
        rp.id.toLowerCase().includes(search) ||
        (rp.description && rp.description.toLowerCase().includes(search)) ||
        (rp.provider?.name && rp.provider.name.toLowerCase().includes(search)) ||
        (rp.website && rp.website.toLowerCase().includes(search)) ||
        acceptedCredentialsHaystack(rp).includes(search)
      );
    });
  }

  const sortField = typeof req.query.sort === 'string' ? req.query.sort : 'name';
  const sortDir = req.query.direction === 'desc' ? -1 : 1;

  const readinessRank: Record<string, number> = {
    'technical-demo': 0,
    'use-case-demo': 1,
    'production-pilot': 2,
    production: 3,
  };

  rps.sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case 'readiness':
        cmp = (readinessRank[a.readiness] ?? 0) - (readinessRank[b.readiness] ?? 0);
        break;
      case 'country':
        cmp = (a.country || '').localeCompare(b.country || '');
        break;
      case 'updatedAt':
        cmp = (a.updatedAt || '').localeCompare(b.updatedAt || '');
        break;
      default:
        cmp = a.name.localeCompare(b.name);
    }
    return cmp * sortDir;
  });

  const page = toNumber(req.query.page, 0);
  const size = toNumber(req.query.size, 20);
  const start = page * size;
  const paged = rps.slice(start, start + size);

  res.status(200).json({
    content: paged,
    totalElements: rps.length,
    totalPages: Math.ceil(rps.length / size),
    number: page,
    size,
  });
}
