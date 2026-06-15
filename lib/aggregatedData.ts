import fs from 'fs';
import path from 'path';

export type Readiness =
  | 'technical-demo'
  | 'use-case-demo'
  | 'production-pilot'
  | 'production';

export type RPStatus = 'development' | 'beta' | 'live' | 'deprecated';

export type InteractionMode = 'proximity' | 'remote' | 'both';

export type CredentialFormat =
  | 'sd_jwt_vc'
  | 'mdoc'
  | 'jwt_vc'
  | 'vcdm_1_1'
  | 'vcdm_2_0'
  | 'anoncreds'
  | 'idemix'
  | 'apple_wallet_pass'
  | 'google_wallet_pass'
  | 'acdc';

export interface RPProvider {
  name: string;
  did?: string;
  website?: string;
  logo?: string;
  contact?: {
    email?: string;
    support?: string;
  };
}

export interface AggregatedRP {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  readiness: Readiness;
  interactionMode: InteractionMode;
  status?: RPStatus;
  sectors?: string[];
  useCases?: string[];
  acceptedCredentials?: string[];
  acceptedCredentialRefs?: Array<{ credentialCatalogId: string }>;
  vcFormat?: CredentialFormat[];
  presentationProtocols?: string[];
  interoperabilityProfiles?: string[];
  supportedWallets?: Array<string | { name: string; walletCatalogId?: string }>;
  features?: string[];
  documentation?: string;
  testCredentials?: string;
  apiEndpoint?: string;
  video?: string;
  country?: string;
  countries?: string[];
  languages?: string[];
  isFeatured?: boolean;
  orgId: string;
  provider: RPProvider;
  catalogUrl?: string;
  fetchedAt?: string;
  source?: 'did' | 'github' | 'local';
  updatedAt: string;
  firstSeenAt?: string;
}

export interface AggregatedRPData {
  relyingParties: AggregatedRP[];
  providers?: RPProvider[];
  lastUpdated?: string;
  stats?: Record<string, unknown>;
}

let dataCache: AggregatedRPData | null = null;
let lastLoad = 0;
const CACHE_TTL_MS = 60_000;

export function loadRPData(): AggregatedRPData {
  const now = Date.now();
  if (dataCache && now - lastLoad < CACHE_TTL_MS) return dataCache;
  const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'aggregated.json'), 'utf-8');
  dataCache = JSON.parse(raw) as AggregatedRPData;
  lastLoad = now;
  return dataCache;
}
