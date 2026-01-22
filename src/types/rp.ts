/**
 * Type definitions for the FIDES Relying Party Catalog
 */

// Readiness level for relying parties
export type Readiness = 'technical-demo' | 'use-case-demo' | 'production-pilot' | 'production';

// Operational status
export type RPStatus = 'development' | 'beta' | 'live' | 'deprecated';

// Industry sectors
export type Sector = 
  | 'government'
  | 'finance'
  | 'healthcare'
  | 'education'
  | 'retail'
  | 'travel'
  | 'hospitality'
  | 'employment'
  | 'telecom'
  | 'utilities'
  | 'insurance'
  | 'real-estate'
  | 'automotive'
  | 'entertainment'
  | 'other';

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
export type InteropProfile = 'DIIP v4' | 'EWC v3' | 'HAIP v1' | 'EUDI Wallet ARF';

// Supported wallet reference (string or object with deep link)
export type SupportedWallet = string | {
  name: string;
  walletCatalogId?: string;
};

// Provider/Organization information
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
  
  // Classification
  sectors?: Sector[];
  useCases?: string[];
  
  // Technical capabilities
  acceptedCredentials?: string[];
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
  
  // Geographic availability
  countries?: string[];
  languages?: string[];
}

// RP Catalog structure
export interface RPCatalog {
  $schema?: string;
  provider: RPProvider;
  relyingParties: RelyingParty[];
  lastUpdated?: string;
}

// Normalized RP with metadata (after crawling)
export interface NormalizedRP extends RelyingParty {
  provider: RPProvider;
  catalogUrl: string;
  fetchedAt: string;
  source: 'did' | 'github' | 'local';
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



