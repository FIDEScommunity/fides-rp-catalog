/**
 * Type definitions for the FIDES Relying Party Catalog
 */

// Readiness level for relying parties
export type Readiness = 'technical-demo' | 'use-case-demo' | 'production-pilot' | 'production';

// Operational status
export type RPStatus = 'development' | 'beta' | 'live' | 'deprecated';

/**
 * Aggregated JSON uses canonical sector codes (credential / organization catalog).
 * Community rp-catalog.json files may still list legacy values until schema step 2.
 */
export type CanonicalSectorCode =
  | 'public_sector'
  | 'finance'
  | 'trade'
  | 'supply_chain'
  | 'manufacturing'
  | 'energy'
  | 'agriculture'
  | 'food'
  | 'retail'
  | 'healthcare'
  | 'education'
  | 'construction'
  | 'mobility'
  | 'digital';

// Credential format types
export type CredentialFormat = 
  | 'SD-JWT-VC'
  | 'JWT-VC'
  | 'JSON-LD VC'
  | 'AnonCreds'
  | 'Idemix'
  | 'mDL/mDoc'
  | 'X.509';

// Interoperability profiles
export type InteropProfile = 'DIIP v4' | 'DIIP v5' | 'EWC v3' | 'HAIP v1' | 'EUDI Wallet ARF';

// Supported wallet reference (string or object with deep link)
export type SupportedWallet = string | {
  name: string;
  walletCatalogId?: string;
};

/** Denormalized from FIDES Organization Catalog at crawl time (not present in source rp-catalog.json). */
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

// Relying Party definition
export interface RelyingParty {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  readiness: Readiness;
  status?: RPStatus;
  
  // Classification (canonical codes in aggregated output; legacy allowed in source JSON)
  sectors?: string[];
  useCases?: string[];
  
  // Technical capabilities
  /** Human-readable labels; sector linkage uses acceptedCredentialRefs + credential catalog. */
  acceptedCredentials?: string[];
  /** FIDES Credential Catalog ids (cred:…); source of truth for cross-catalog links and sector derivation. */
  acceptedCredentialRefs?: Array<{ credentialCatalogId: string }>;
  credentialFormats?: CredentialFormat[];
  presentationProtocols?: string[];
  interoperabilityProfiles?: InteropProfile[];
  
  // Compatibility
  supportedWallets?: SupportedWallet[];
  
  // Additional info
  features?: string[];
  documentation?: string;
  testCredentials?: string;
  apiEndpoint?: string;
  video?: string;
  
  // Geographic availability
  countries?: string[];
  languages?: string[];
  
  // Featured flag (added by crawler)
  isFeatured?: boolean;

  // Semantic dates (added by crawler; do not set in provider JSON)
  updatedAt?: string;
  firstSeenAt?: string;
}

// RP Catalog structure (source JSON — aligns with issuer / credential catalogs)
export interface RPCatalog {
  $schema: string;
  orgId: string;
  relyingParties: RelyingParty[];
  lastUpdated?: string;
}

// Normalized RP with metadata (after crawling)
export interface NormalizedRP extends RelyingParty {
  orgId: string;
  provider: RPProvider;
  catalogUrl: string;
  fetchedAt: string;
  source: 'did' | 'github' | 'local';
  updatedAt: string;
  firstSeenAt: string;
}

// Aggregated data structure
export interface AggregatedRPData {
  relyingParties: NormalizedRP[];
  providers: RPProvider[];
  lastUpdated: string;
  stats: {
    totalRPs: number;
    totalProviders: number;
    byReadiness: Record<Readiness, number>;
    bySector: Record<string, number>;
    byCredentialFormat: Record<string, number>;
  };
}



