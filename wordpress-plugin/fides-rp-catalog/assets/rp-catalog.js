/**
 * FIDES RP Catalog - WordPress Plugin JavaScript
 */

(function() {
  'use strict';

  // Icons (inline SVG)
  const icons = {
    search: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>',
    globe: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>',
    filter: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>',
    x: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>',
    xSmall: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>',
    xLarge: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>',
    externalLink: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" x2="21" y1="14" y2="3"></line></svg>',
    building: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
    shield: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
    fileCheck: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/></svg>',
    book: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    wallet: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>',
    laptop: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>',
    eye: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    externalLinkSmall: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" x2="21" y1="14" y2="3"></line></svg>',
    video: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>',
    play: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    link: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    share: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>',
    viewGrid: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    viewList: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>'
  };
  
  // Wallet catalog base URL for deep links (configurable via WordPress settings)
  const WALLET_CATALOG_URL = (window.fidesRPCatalog && window.fidesRPCatalog.walletCatalogUrl) 
    || 'https://wallets.fides.community';

  // Blue Pages base URL for DID lookups (configurable via WordPress settings)
  const BLUE_PAGES_URL = (window.fidesRPCatalog && window.fidesRPCatalog.bluePagesUrl)
    || 'https://fides.community/community-tools/blue-pages';

  // Map page URL for "Show on map" link (configurable via WordPress)
  const MAP_PAGE_URL = (window.fidesRPCatalog && window.fidesRPCatalog.mapPageUrl)
    || 'https://fides.community/community-tools/map/';

  // Credential catalog page for ?credential=cred:… deep links (configurable via WordPress)
  const CREDENTIAL_CATALOG_PAGE_URL = (window.fidesRPCatalog && window.fidesRPCatalog.credentialCatalogUrl)
    || 'https://fides.community/ecosystem-explorer/credential-catalog/';

  const ORGANIZATION_CATALOG_PAGE_URL = (window.fidesRPCatalog && window.fidesRPCatalog.organizationCatalogUrl)
    || 'https://fides.community/ecosystem-explorer/organization-catalog/';

  const USE_CASE_CATALOG_PAGE_URL = (window.fidesRPCatalog && window.fidesRPCatalog.useCaseCatalogUrl)
    || 'https://fides.community/use-cases/';

  const ECOSYSTEM_EXPLORER_URL = (window.fidesRPCatalog && window.fidesRPCatalog.ecosystemExplorerUrl)
    || 'https://fides.community/topics/ecosystem-explorer/';
  const RATINGS_API_BASE = (window.fidesRPCatalog && window.fidesRPCatalog.ratingsApiBase)
    ? String(window.fidesRPCatalog.ratingsApiBase).trim().replace(/\/$/, '')
    : '';
  const RATINGS_NONCE = (window.fidesRPCatalog && window.fidesRPCatalog.ratingsNonce)
    ? String(window.fidesRPCatalog.ratingsNonce)
    : '';
  const RATINGS_IS_LOGGED_IN = !!(window.fidesRPCatalog && window.fidesRPCatalog.ratingsIsLoggedIn);
  const RATINGS_LOGIN_URL = (window.fidesRPCatalog && window.fidesRPCatalog.ratingsLoginUrl)
    ? String(window.fidesRPCatalog.ratingsLoginUrl)
    : '';
  const UPDATE_FORM_URL = (window.fidesRPCatalog && window.fidesRPCatalog.updateFormUrl)
    ? String(window.fidesRPCatalog.updateFormUrl).trim()
    : '';
  const EDIT_ACCESS = (window.fidesRPCatalog && window.fidesRPCatalog.editAccess
    && typeof window.fidesRPCatalog.editAccess === 'object')
    ? window.fidesRPCatalog.editAccess
    : { isLoggedIn: false, isAdmin: false, ownedOrgIds: [], proOrgIds: [] };
  const TIER_UI_ENABLED = !!(window.fidesRPCatalog && window.fidesRPCatalog.tierUiEnabled);
  const OFFICIAL_FILTER_LABEL = 'Official listings only';
  const RATINGS_BATCH_LIMIT = 100;

  // Selected RP for modal
  let selectedRP = null;

  // Configuration
  const config = window.fidesRPCatalog || {
    pluginUrl: '',
    githubDataUrl: 'https://raw.githubusercontent.com/FIDEScommunity/fides-rp-catalog/main/data/aggregated.json',
    credentialAggregatedDataUrl: 'https://raw.githubusercontent.com/FIDEScommunity/fides-credential-catalog/main/data/aggregated.json',
    issuerAggregatedDataUrl: 'https://raw.githubusercontent.com/FIDEScommunity/fides-issuer-catalog/main/data/aggregated.json',
    walletAggregatedDataUrl: 'https://raw.githubusercontent.com/FIDEScommunity/fides-wallet-catalog/main/data/aggregated.json',
    useCaseAggregatedDataUrl: 'https://raw.githubusercontent.com/FIDEScommunity/fides-use-case-catalog/main/data/aggregated.json'
  };

  // Country code to name mapping
  const countryNames = {
    'NL': 'Netherlands',
    'FR': 'France',
    'DE': 'Germany',
    'IN': 'India',
    'US': 'United States',
    'GB': 'United Kingdom',
    'ES': 'Spain',
    'IT': 'Italy',
    'BE': 'Belgium',
    'AT': 'Austria',
    'CH': 'Switzerland',
    'SE': 'Sweden',
    'FI': 'Finland',
    'DK': 'Denmark',
    'NO': 'Norway',
    'PL': 'Poland',
    'PT': 'Portugal',
    'IE': 'Ireland',
    'AU': 'Australia',
    'CA': 'Canada',
    'JP': 'Japan'
  };

  /** English labels — same codes as credential / organization catalog. */
  const SECTOR_LABELS = {
    public_sector: 'Public Sector',
    finance: 'Finance',
    trade: 'Trade',
    supply_chain: 'Supply Chain',
    manufacturing: 'Manufacturing',
    energy: 'Energy',
    agriculture: 'Agriculture',
    food: 'Food',
    retail: 'Retail',
    healthcare: 'Healthcare',
    education: 'Education',
    construction: 'Construction',
    mobility: 'Mobility',
    digital: 'Digital',
  };

  const SECTOR_CODES_ALPHABETIC = Object.keys(SECTOR_LABELS).sort((a, b) =>
    SECTOR_LABELS[a].localeCompare(SECTOR_LABELS[b], 'en', { sensitivity: 'base' })
  );

  /** Display labels for `interactionMode` on relying parties (schema: proximity | remote | both). */
  const INTERACTION_MODE_LABELS = {
    proximity: 'Proximity',
    remote: 'Remote',
    both: 'Both'
  };
  const INTERACTION_MODE_ORDER = ['proximity', 'remote', 'both'];

  const READINESS_LABELS = {
    'technical-demo': 'Technical Demo',
    'use-case-demo': 'Use Case Demo',
    'production-pilot': 'Production Pilot',
    'production': 'Production'
  };

  function getRpInteractionMode(rp) {
    const m = rp && rp.interactionMode;
    if (m === 'proximity' || m === 'remote' || m === 'both') return m;
    return 'remote';
  }

  function resolveRpOrgIdForTier(rp) {
    const orgId = rp && rp.orgId ? String(rp.orgId).trim() : '';
    if (orgId) return orgId;
    return rp && rp.provider && rp.provider.orgId ? String(rp.provider.orgId).trim() : '';
  }

  function rpCatalogTierIsCommunity(rp) {
    if (!TIER_UI_ENABLED) return false;
    if (!rp || !rp.catalogTier) return false;
    const tier = String(rp.catalogTier).toLowerCase();
    return tier === 'gratis' || tier === 'community';
  }

  function rpCatalogTierIsPro(rp) {
    if (!TIER_UI_ENABLED) return false;
    if (!rp) return false;
    if (rp.catalogTier) {
      return !rpCatalogTierIsCommunity(rp);
    }
    const orgId = resolveRpOrgIdForTier(rp);
    const proOrgIds = Array.isArray(EDIT_ACCESS.proOrgIds) ? EDIT_ACCESS.proOrgIds : [];
    return orgId !== '' && proOrgIds.indexOf(orgId) >= 0;
  }

  function rpPrimaryVideoUrl(rp) {
    if (!rp || !rp.media || !Array.isArray(rp.media.videos) || !rp.media.videos.length) return '';
    return String(rp.media.videos[0] || '').trim();
  }

  function rpHasVideo(rp) {
    return Boolean(rpPrimaryVideoUrl(rp));
  }

  /** Same codes as credential catalog (English labels). */
  const THEME_LABELS = {
    person_identity: 'Person identity',
    organizational_identity: 'Organizational identity',
    payments: 'Payments',
    compliance_reporting: 'Compliance & reporting',
    trade_documents: 'Trade documents',
    education: 'Education',
    digital_product_passports: 'Digital product passports',
    dataspaces: 'Data spaces',
    agentic_ai: 'Agentic AI',
  };

  const THEME_CODES_ALPHABETIC = Object.keys(THEME_LABELS).sort((a, b) =>
    THEME_LABELS[a].localeCompare(THEME_LABELS[b], 'en', { sensitivity: 'base' })
  );

  const CREDENTIAL_FORMAT_ORDER = [
    'sd_jwt_vc',
    'mdoc',
    'jwt_vc',
    'vcdm_1_1',
    'vcdm_2_0',
    'anoncreds',
    'idemix',
    'apple_wallet_pass',
    'google_wallet_pass',
    'acdc',
  ];
  const CREDENTIAL_FORMAT_DISPLAY = {
    sd_jwt_vc: 'SD-JWT VC',
    mdoc: 'ISO mDoc',
    jwt_vc: 'JWT VC',
    vcdm_1_1: 'VCDM1.1',
    vcdm_2_0: 'VCDM2.0',
    anoncreds: 'AnonCreds',
    idemix: 'Idemix',
    apple_wallet_pass: 'Apple Wallet Pass',
    google_wallet_pass: 'Google Wallet Pass',
    acdc: 'ACDC',
  };
  function credentialFormatDisplayLabel(code) {
    return CREDENTIAL_FORMAT_DISPLAY[code] || code;
  }
  function sortCredentialFormats(formats) {
    if (!formats || !Array.isArray(formats)) return [];
    return formats.slice().sort((a, b) => {
      const indexA = CREDENTIAL_FORMAT_ORDER.indexOf(a);
      const indexB = CREDENTIAL_FORMAT_ORDER.indexOf(b);
      const orderA = indexA === -1 ? 999 : indexA;
      const orderB = indexB === -1 ? 999 : indexB;
      return orderA - orderB;
    });
  }

  /** Same codes as credential catalog (English labels). */
  const ECOSYSTEM_LABELS = {
    eudi_wallet: 'EUDI Wallet',
    uncefact: 'UN/CEFACT',
    gaia_x: 'Gaia-X',
    open_badges: 'Open Badges',
    iso_mdl: 'ISO mDL',
    india_stack: 'India Stack',
  };

  const ECOSYSTEM_CODES_ALPHABETIC = Object.keys(ECOSYSTEM_LABELS).sort((a, b) =>
    ECOSYSTEM_LABELS[a].localeCompare(ECOSYSTEM_LABELS[b], 'en', { sensitivity: 'base' })
  );

  /** Legacy shortcode / old RP schema values → canonical code (Step 1 compatibility). */
  const LEGACY_SECTOR_TO_CANONICAL = {
    government: 'public_sector',
    finance: 'finance',
    healthcare: 'healthcare',
    education: 'education',
    retail: 'retail',
    travel: 'mobility',
    hospitality: 'retail',
    employment: 'digital',
    telecom: 'digital',
    utilities: 'energy',
    insurance: 'finance',
    'real-estate': 'construction',
    automotive: 'mobility',
    entertainment: 'retail',
    other: 'digital'
  };

  function normalizeSectorFilterCode(code) {
    if (!code || typeof code !== 'string') return '';
    const t = code.trim().toLowerCase();
    if (!t) return '';
    if (Object.prototype.hasOwnProperty.call(SECTOR_LABELS, t)) return t;
    const mapped = LEGACY_SECTOR_TO_CANONICAL[t];
    if (mapped && Object.prototype.hasOwnProperty.call(SECTOR_LABELS, mapped)) return mapped;
    return '';
  }

  /** ISO 3166-1 alpha-2 for ?country= deep links (aligned with country explorer). */
  function normalizeCountryFilterCode(raw) {
    if (raw == null || typeof raw !== 'string') return '';
    const s = String(raw).trim().replace(/[^a-z]/gi, '').toUpperCase();
    return s.length === 2 ? s : '';
  }

  /** Taxonomy theme for ?theme= / data-taxonomy-theme (not UI color). */
  function normalizeCredentialThemeCode(code) {
    if (!code || typeof code !== 'string') return '';
    const t = code.trim();
    return Object.prototype.hasOwnProperty.call(THEME_LABELS, t) ? t : '';
  }

  // State
  let relyingParties = [];
  let ratingSummariesByRpId = Object.create(null);
  /** cred:… id → theme / ecosystem codes from credential catalog aggregated.json */
  let credentialThemesById = Object.create(null);
  let credentialEcosystemsById = Object.create(null);
  /** cred:… id → { displayName, authorityName } */
  let credentialById = Object.create(null);
  /** wallet id → { displayName, providerName } */
  let walletById = Object.create(null);
  /** cred:… id → issuers[] from issuer catalog aggregated.json */
  let issuerUsageByCredentialId = new Map();
  /** rp id → use cases[] reverse-linked from use case catalog aggregated.json */
  let useCasesByRpId = Object.create(null);
  /** Precomputed counts per filter option (set once after data load) */
  let filterFacets = null;
  // Vocabulary for [i] info popups (loaded from interop-profiles)
  let vocabulary = null;

  const RP_FILTER_TO_VOCAB = {
    type: 'readiness',
    interactionMode: 'interactionMode',
    supportedWallets: 'supportedWallet',
    sectors: 'sector',
    credentialEcosystems: 'ecosystem',
    credentialThemes: 'credentialTheme',
    country: 'country',
    vcFormat: 'vcFormat',
    presentationProtocols: 'presentationProtocol',
    interoperabilityProfiles: 'interopProfile'
  };
  /** Groups that do not show the [i] info button (empty: all groups can show category description from vocabulary) */
  const RP_VOCAB_NO_INFO = new Set([]);

  const SORT_PREFERENCE_STORAGE_KEY = 'fidesRPCatalogSortBy';
  const VIEW_PREFERENCE_STORAGE_KEY = 'fidesRPCatalogViewMode';
  const LIST_BREAKPOINT = 1024;
  let sortBy = 'rating';
  let viewMode = 'grid';

  let filters = {
    search: '',
    type: [],
    sectors: [],
    credentialEcosystems: [],
    credentialThemes: [],
    country: [],
    vcFormat: [],
    presentationProtocols: [],
    interoperabilityProfiles: [],
    interactionMode: [],
    supportedWallets: [],
    addedLast30Days: false,
    includesVideo: false,
    officialOnly: false,
    ids: []
  };

  // IDs from ?rps= URL param; preserved so the filter can be toggled back on
  let originalIds = [];

  // Track which filter groups are expanded (true = expanded, false = collapsed)
  const filterGroupState = {
    type: true,
    interactionMode: true,
    sectors: false,
    credentialEcosystems: false,
    credentialThemes: false,
    supportedWallets: true,
    country: false,
    vcFormat: false,
    presentationProtocols: false,
    interoperabilityProfiles: false
  };

  // Chevron icon for collapsible filters
  const chevronDown = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>';

  // DOM Elements
  let container;
  let settings;

  function effectiveView() {
    return window.innerWidth < LIST_BREAKPOINT ? 'grid' : viewMode;
  }
  let _lastEffective = effectiveView();
  window.addEventListener('resize', debounce(() => {
    const cur = effectiveView();
    if (cur !== _lastEffective) {
      _lastEffective = cur;
      if (container) renderRPGridOnly();
    }
  }, 120));

  /**
   * Initialize the catalog
   */
  function init() {
    container = document.getElementById('fides-rp-catalog-root');
    if (!container) return;

    // Read settings from data attributes
    settings = {
      type: container.dataset.type || '',
      sector: container.dataset.sector || '',
      showFilters: container.dataset.showFilters !== 'false',
      showSearch: container.dataset.showSearch !== 'false',
      columns: container.dataset.columns || '3',
      theme: container.dataset.theme || 'dark'
    };

    // Set theme
    container.setAttribute('data-theme', settings.theme);

    // Pre-filter by type if specified
    if (settings.type) {
      filters.type = [settings.type];
    }
    if (settings.sector) {
      settings.sector = normalizeSectorFilterCode(settings.sector);
      filters.sectors = settings.sector ? [settings.sector] : [];
    }

    // Restore persisted sort and view preference
    try {
      const stored = window.localStorage.getItem(SORT_PREFERENCE_STORAGE_KEY);
      if (stored === 'lastUpdated' || stored === 'name' || stored === 'rating') sortBy = stored;
      const storedView = window.localStorage.getItem(VIEW_PREFERENCE_STORAGE_KEY);
      if (storedView === 'grid' || storedView === 'list') viewMode = storedView;
    } catch (e) { /* ignore */ }
    _lastEffective = effectiveView();

    if (window.FidesCatalogUI && window.FidesCatalogUI.initMatomoLinkTracking) {
      window.FidesCatalogUI.initMatomoLinkTracking({ category: 'RP Catalog', containerSelector: '#fides-rp-catalog-root', modalOverlayId: 'fides-modal-overlay' });
    }

    // Load data
    loadRelyingParties();
  }

  /**
   * Get the "visible" set for facet computation (shortcode pre-filter only: type and/or sector)
   */
  function getRPsForFacets(rps) {
    let list = rps;
    if (settings.type) {
      list = list.filter(rp => rp.readiness === settings.type);
    }
    if (settings.sector) {
      list = list.filter(rp => (rp.sectors || []).includes(settings.sector));
    }
    return list;
  }

  /**
   * Parse ISO or date-like string; return ISO string or null
   */
  function parseRPDate(rp, keys) {
    for (let i = 0; i < keys.length; i++) {
      const v = rp[keys[i]];
      if (!v || typeof v !== 'string') continue;
      const d = new Date(v);
      if (!Number.isNaN(d.getTime())) return d.toISOString();
    }
    return null;
  }

  /**
   * Best-effort "added" date for display and quick filter.
   * Uses firstSeenAt, createdAt, addedAt only (not fetchedAt – that is crawl time, same for all).
   */
  function getRPAddedDate(rp) {
    return parseRPDate(rp, ['firstSeenAt', 'createdAt', 'addedAt']) || null;
  }

  /**
   * Best-effort "updated" date for sort, quick filter and display.
   * updatedAt is set by the crawler (Git last-commit date of catalog file as fallback, like wallet catalog); else fetchedAt.
   */
  function getRPUpdatedDate(rp) {
    return parseRPDate(rp, ['updatedAt', 'fetchedAt']) || null;
  }

  /**
   * Check if ISO date string is within the last N days
   */
  function isWithinLastDays(isoString, days) {
    if (!isoString) return false;
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return false;
    const now = Date.now();
    const limit = now - days * 24 * 60 * 60 * 1000;
    return d.getTime() >= limit;
  }

  function isFidesLocalDevHost() {
    try {
      const h = window.location.hostname || '';
      const href = window.location.href || '';
      return h.includes('.local') || href.includes('.local');
    } catch {
      return false;
    }
  }

  /**
   * Build cred:… id → themes[] and ecosystems[] from credential catalog aggregated.json
   */
  async function loadCredentialTaxonomyIndex() {
    credentialThemesById = Object.create(null);
    credentialEcosystemsById = Object.create(null);
    credentialById = Object.create(null);
    const url = (config.credentialAggregatedDataUrl || '').trim();
    if (!url) return;
    try {
      const response = await fetch(url);
      if (!response.ok) return;
      const data = await response.json();
      const creds = Array.isArray(data.credentials) ? data.credentials : [];
      creds.forEach(c => {
        if (!c || typeof c.id !== 'string') return;
        credentialById[c.id] = {
          displayName: (c.displayName || '').trim(),
          authorityName: c.authority && c.authority.name ? String(c.authority.name).trim() : ''
        };
        const themes = Array.isArray(c.themes) ? c.themes : [];
        credentialThemesById[c.id] = themes.filter(
          t => typeof t === 'string' && Object.prototype.hasOwnProperty.call(THEME_LABELS, t)
        );
        const ecosystems = Array.isArray(c.ecosystems) ? c.ecosystems : [];
        credentialEcosystemsById[c.id] = ecosystems.filter(
          e => typeof e === 'string' && Object.prototype.hasOwnProperty.call(ECOSYSTEM_LABELS, e)
        );
      });
    } catch (e) {
      console.warn('Credential catalog taxonomy index load failed:', e.message);
    }
  }

  /**
   * Build cred:… id → issuers[] from issuer catalog aggregated.json (for ecosystem model).
   */
  async function loadIssuerUsageIndex() {
    issuerUsageByCredentialId = new Map();
    const url = (config.issuerAggregatedDataUrl || '').trim();
    if (!url) return;
    try {
      const response = await fetch(url);
      if (!response.ok) return;
      const data = await response.json();
      const issuers = Array.isArray(data.issuers) ? data.issuers : [];
      issuers.forEach(function(issuer) {
        if (!issuer || !issuer.id) return;
        const configs = Array.isArray(issuer.credentialConfigurations) ? issuer.credentialConfigurations : [];
        configs.forEach(function(conf) {
          const credId = conf && conf.credentialCatalogRef && conf.credentialCatalogRef.id;
          if (!credId || typeof credId !== 'string') return;
          const entry = {
            id: issuer.id,
            displayName: (issuer.displayName || issuer.id || '').trim(),
            organizationName: (issuer.organization && issuer.organization.name) ? String(issuer.organization.name) : '',
            logoUri: issuer.logoUri || (issuer.organization && issuer.organization.logoUri) || ''
          };
          const existing = issuerUsageByCredentialId.get(credId) || [];
          if (!existing.some(function(e) { return e.id === entry.id; })) {
            existing.push(entry);
            issuerUsageByCredentialId.set(credId, existing);
          }
        });
      });
    } catch (e) {
      console.warn('Issuer catalog usage index load failed:', e.message);
    }
  }

  async function loadWalletIndex() {
    walletById = Object.create(null);
    const url = (config.walletAggregatedDataUrl || '').trim();
    if (!url) return;
    try {
      const response = await fetch(url);
      if (!response.ok) return;
      const data = await response.json();
      const wallets = Array.isArray(data.wallets) ? data.wallets : [];
      wallets.forEach(function(w) {
        if (!w || typeof w.id !== 'string') return;
        walletById[w.id] = {
          displayName: (w.name || '').trim(),
          providerName: w.provider && w.provider.name ? String(w.provider.name).trim() : ''
        };
      });
    } catch (e) {
      console.warn('Wallet catalog index load failed:', e.message);
    }
  }

  /**
   * Build rp id → use cases[] from use case catalog aggregated.json (links.rps[].refId).
   */
  async function loadUseCaseIndex() {
    useCasesByRpId = Object.create(null);
    const url = (config.useCaseAggregatedDataUrl || '').trim();
    if (!url) return;
    try {
      const response = await fetch(url);
      if (!response.ok) return;
      const data = await response.json();
      const useCases = Array.isArray(data.useCases) ? data.useCases : [];
      useCases.forEach(function(uc) {
        if (!uc || typeof uc.id !== 'string') return;
        const links = uc.links && typeof uc.links === 'object' ? uc.links : {};
        const rps = Array.isArray(links.rps) ? links.rps : [];
        const entry = {
          id: uc.id,
          title: (uc.title || '').trim() || uc.id,
          organizationName: (uc.organizationName || '').trim()
        };
        rps.forEach(function(link) {
          if (!link || typeof link !== 'object') return;
          const rpId = link.refId ? String(link.refId).trim() : '';
          if (!rpId) return;
          if (!useCasesByRpId[rpId]) useCasesByRpId[rpId] = [];
          if (!useCasesByRpId[rpId].some(function(e) { return e.id === entry.id; })) {
            useCasesByRpId[rpId].push(entry);
          }
        });
      });
      Object.keys(useCasesByRpId).forEach(function(rpId) {
        useCasesByRpId[rpId].sort(function(a, b) {
          return String(a.title || a.id).localeCompare(String(b.title || b.id), undefined, { sensitivity: 'base' });
        });
      });
    } catch (e) {
      console.warn('Use case catalog index load failed:', e.message);
    }
  }

  function getDerivedUseCasesForRp(rp) {
    if (!rp || !rp.id) return [];
    return useCasesByRpId[rp.id] || [];
  }

  function getEcosystemIssuersForRp(rp) {
    if (!rp) return [];
    const refs = Array.isArray(rp.acceptedCredentialRefs) ? rp.acceptedCredentialRefs : [];
    const byId = new Map();
    refs.forEach(function(ref) {
      const credId = getCredentialRefCatalogId(ref);
      if (!credId) return;
      const issuers = issuerUsageByCredentialId.get(credId) || [];
      issuers.forEach(function(issuer) {
        if (issuer && issuer.id && !byId.has(issuer.id)) byId.set(issuer.id, issuer);
      });
    });
    return Array.from(byId.values()).sort(function(a, b) {
      return String(a.displayName || a.id).localeCompare(String(b.displayName || b.id), undefined, { sensitivity: 'base' });
    });
  }

  /**
   * Union themes and ecosystems from all acceptedCredentialRefs (cred:…) in the credential index.
   */
  function enrichRelyingPartiesCredentialTaxonomy(rps) {
    rps.forEach(rp => {
      const refs = Array.isArray(rp.acceptedCredentialRefs) ? rp.acceptedCredentialRefs : [];
      const themeSet = new Set();
      const ecosystemSet = new Set();
      refs.forEach(ref => {
        const id = getCredentialRefCatalogId(ref);
        if (!id) return;
        const th = credentialThemesById[id];
        if (th) th.forEach(t => themeSet.add(t));
        const ec = credentialEcosystemsById[id];
        if (ec) ec.forEach(e => ecosystemSet.add(e));
      });
      rp.derivedCredentialThemes = Array.from(themeSet);
      rp.derivedCredentialEcosystems = Array.from(ecosystemSet);
    });
  }

  /**
   * Load relying parties from multiple sources.
   * Default: GitHub first, then local plugin. Hostname/URL contains ".local": local first, then GitHub.
   */
  async function loadRelyingParties() {
    const remote = { name: 'GitHub', url: config.githubDataUrl, transform: (d) => d.relyingParties || [] };
    const local = { name: 'Local', url: `${config.pluginUrl}data/aggregated.json`, transform: (d) => d.relyingParties || [] };
    const sources = isFidesLocalDevHost() ? [local, remote] : [remote, local];

    for (const source of sources) {
      if (!source.url) continue;

      try {
        const response = await fetch(source.url);
        if (response.ok) {
          const data = await response.json();
          relyingParties = source.transform(data);
          await loadCredentialTaxonomyIndex();
          await loadIssuerUsageIndex();
          await loadWalletIndex();
          await loadUseCaseIndex();
          enrichRelyingPartiesCredentialTaxonomy(relyingParties);
          try {
            await loadRPRatingSummaries(relyingParties);
          } catch (ratingsError) {
            console.warn('Failed to load RP likes:', ratingsError.message);
          }
          const rpsForFacets = getRPsForFacets(relyingParties);
          filterFacets = computeFilterFacets(rpsForFacets);
          console.log(`✅ Loaded ${relyingParties.length} relying parties from ${source.name}`);
          break;
        }
      } catch (error) {
        console.warn(`Failed to load from ${source.name}:`, error.message);
      }
    }

    if (relyingParties.length === 0) {
      console.error('Failed to load relying parties from any source');
    }

    // Read query parameters for filtering
    readQueryParams();
    
    render();
    
    // Check for deep link after render
    checkDeepLink();

    // Load vocabulary after first render so the catalog appears faster.
    if (config.vocabularyUrl || config.vocabularyFallbackUrl) {
      loadVocabulary(config.vocabularyUrl, config.vocabularyFallbackUrl)
        .then((terms) => {
          vocabulary = terms;
          if (vocabulary) initVocabularyInfo(container);
        })
        .catch((vocabError) => {
          console.warn('RP vocabulary load failed:', vocabError.message);
        });
    }
  }

  /**
   * Load vocabulary JSON (primary = GitHub, fallback = local plugin assets when GitHub unreachable)
   */
  async function loadVocabulary(primaryUrl, fallbackUrl) {
    let first = primaryUrl;
    let second = fallbackUrl;
    if (isFidesLocalDevHost() && primaryUrl && fallbackUrl) {
      first = fallbackUrl;
      second = primaryUrl;
    }
    const tryLoad = async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      return data.terms || null;
    };
    if (first) {
      try {
        return await tryLoad(first);
      } catch (e) {
        console.warn('Vocabulary load failed (first):', e.message);
      }
    }
    if (second) {
      try {
        const terms = await tryLoad(second);
        if (terms) console.log('Vocabulary loaded from second source');
        return terms;
      } catch (e) {
        console.warn('Vocabulary load failed (second):', e.message);
      }
    }
    return null;
  }

  /**
   * Read and apply query parameters for filtering
   * Supports: ?profile=Profile Name
   */
  function readQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const profileParam = urlParams.get('profile');
    
    if (profileParam && !filters.interoperabilityProfiles.includes(profileParam)) {
      filters.interoperabilityProfiles.push(profileParam);
      document.body.classList.add('filters-visible');
      console.log(`🔗 Profile filter applied: ${profileParam}`);
    }

    const sectorParam = urlParams.get('sector');
    if (sectorParam) {
      const sectorCode = normalizeSectorFilterCode(sectorParam);
      if (sectorCode) {
        filters.sectors = [sectorCode];
        // URL deep link must not set settings.sector: that hides the Sector filter group and
        // skips sector in getActiveFilterCount(), so the filter looked inactive. Clear shortcode
        // sector lock when the URL explicitly requests a sector (URL wins over data-sector).
        settings.sector = '';
        document.body.classList.add('filters-visible');
      }
    }

    const rpsParam = urlParams.get('rps');
    if (rpsParam) {
      originalIds = rpsParam.split(',').map(s => s.trim()).filter(Boolean);
      filters.ids = [...originalIds];
    }

    const countryCode = normalizeCountryFilterCode(urlParams.get('country') || '');
    if (countryCode) {
      filters.country = [countryCode];
      document.body.classList.add('filters-visible');
    }

    const themeFromUrl = normalizeCredentialThemeCode(urlParams.get('theme') || '');
    const themeFromData = container ? normalizeCredentialThemeCode(container.dataset.taxonomyTheme || '') : '';
    const themeCode = themeFromUrl || themeFromData;
    if (themeCode) {
      filters.credentialThemes = [themeCode];
      document.body.classList.add('filters-visible');
    }
  }

  /**
   * Check URL for RP deep link parameter
   * Supports: ?rp=rp-id or #rp-id
   */
  function checkDeepLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const rpId = urlParams.get('rp') || window.location.hash.replace('#', '');
    
    if (rpId) {
      const rp = relyingParties.find(r => r.id === rpId);
      if (rp) {
        console.log(`🔗 Deep link found: opening RP "${rp.name}"`);
        // Small delay to ensure DOM is fully ready
        setTimeout(() => {
          openRPDetail(rpId);
        }, 150);
      } else {
        console.warn(`Deep link RP not found: ${rpId}`);
      }
    }
  }

  /**
   * Filter and sort relying parties based on current filters
   */
  function getFilteredAndSortedRPs() {
    let filtered = relyingParties.filter(rp => {
      // ID pre-filter (from ?rps= URL param)
      if (filters.ids && filters.ids.length > 0) {
        if (!filters.ids.includes(rp.id)) return false;
      }

      // Search
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const themeLabelMatch = (rp.derivedCredentialThemes || []).some(t => {
          const lab = THEME_LABELS[t];
          return lab && lab.toLowerCase().includes(search);
        });
        const ecosystemLabelMatch = (rp.derivedCredentialEcosystems || []).some(e => {
          const lab = ECOSYSTEM_LABELS[e];
          return lab && lab.toLowerCase().includes(search);
        });
        const imLabel = INTERACTION_MODE_LABELS[getRpInteractionMode(rp)] || '';
        const matches =
          rp.name.toLowerCase().includes(search) ||
          (rp.description || '').toLowerCase().includes(search) ||
          rp.provider.name.toLowerCase().includes(search) ||
          (imLabel && imLabel.toLowerCase().includes(search)) ||
          themeLabelMatch ||
          ecosystemLabelMatch;
        if (!matches) return false;
      }

      // Readiness
      if (filters.type.length > 0) {
        if (!filters.type.includes(rp.readiness)) return false;
      }

      // Interaction mode (proximity / remote / both)
      if (filters.interactionMode.length > 0) {
        const im = getRpInteractionMode(rp);
        if (!filters.interactionMode.includes(im)) return false;
      }

      // Sectors
      if (filters.sectors.length > 0) {
        const hasMatch = filters.sectors.some(s => (rp.sectors || []).includes(s));
        if (!hasMatch) return false;
      }

      // Credential ecosystems (from linked credentials in catalog)
      if (filters.credentialEcosystems.length > 0) {
        const hasEco = filters.credentialEcosystems.some(e => (rp.derivedCredentialEcosystems || []).includes(e));
        if (!hasEco) return false;
      }

      // Credential themes (from linked credentials in catalog)
      if (filters.credentialThemes.length > 0) {
        const hasTheme = filters.credentialThemes.some(t => (rp.derivedCredentialThemes || []).includes(t));
        if (!hasTheme) return false;
      }

      // Country (normalize RP field so URL ?country=nl matches JSON "NL" or "nl")
      if (filters.country.length > 0) {
        const rpCc = normalizeCountryFilterCode(rp.country || '');
        if (!rpCc || !filters.country.includes(rpCc)) return false;
      }

      // Credential formats
      if (filters.vcFormat.length > 0) {
        const hasMatch = filters.vcFormat.some(f => (rp.vcFormat || []).includes(f));
        if (!hasMatch) return false;
      }

      // Presentation protocols
      if (filters.presentationProtocols.length > 0) {
        const hasMatch = filters.presentationProtocols.some(filterProtocol => {
          if (filterProtocol === '...other') {
            // Match any protocol that is NOT OpenID4VP or ISO 18013-5
            return (rp.presentationProtocols || []).some(p => 
              p !== 'OpenID4VP' && p !== 'ISO 18013-5'
            );
          } else {
            // Exact match for OpenID4VP or ISO 18013-5
            return (rp.presentationProtocols || []).includes(filterProtocol);
          }
        });
        if (!hasMatch) return false;
      }

      // Interoperability profiles
      if (filters.interoperabilityProfiles.length > 0) {
        const hasMatch = filters.interoperabilityProfiles.some(p => (rp.interoperabilityProfiles || []).includes(p));
        if (!hasMatch) return false;
      }

      // Supported wallets
      if (filters.supportedWallets.length > 0) {
        const hasMatch = filters.supportedWallets.some(walletId => {
          return (rp.supportedWallets || []).some(w => {
            // Handle both string and object format
            const wId = typeof w === 'object' ? w.walletCatalogId : null;
            return wId === walletId;
          });
        });
        if (!hasMatch) return false;
      }

      // Quick filters
      if (filters.addedLast30Days && !isWithinLastDays(getRPAddedDate(rp), 30)) return false;
      if (filters.includesVideo && !rpHasVideo(rp)) return false;
      if (TIER_UI_ENABLED && filters.officialOnly && !rpCatalogTierIsPro(rp)) return false;

      return true;
    });

    const compareSecondary = (a, b) => {
      const providerCompare = a.provider.name.localeCompare(b.provider.name);
      if (providerCompare !== 0) return providerCompare;
      return a.name.localeCompare(b.name);
    };
    if (sortBy === 'lastUpdated') {
      filtered.sort((a, b) => {
        const dateA = getRPUpdatedDate(a);
        const dateB = getRPUpdatedDate(b);
        const tA = new Date(dateA || 0).getTime();
        const tB = new Date(dateB || 0).getTime();
        if (tB !== tA) return tB - tA;
        return compareSecondary(a, b);
      });
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => {
        const aRating = rpRatingSortValue(a);
        const bRating = rpRatingSortValue(b);
        if (bRating.stars !== aRating.stars) return bRating.stars - aRating.stars;
        return compareSecondary(a, b);
      });
    } else {
      filtered.sort((a, b) => compareSecondary(a, b));
    }

    return filtered;
  }

  /**
   * Get KPI metrics for the current filtered result set
   */
  function getCatalogMetrics(rps) {
    const list = Array.isArray(rps) ? rps : [];
    let newLast30Days = 0;
    let updatedLast30Days = 0;
    const countries = new Set();
    list.forEach(rp => {
      if (isWithinLastDays(getRPAddedDate(rp), 30)) newLast30Days += 1;
      if (isWithinLastDays(getRPUpdatedDate(rp), 30)) updatedLast30Days += 1;
      if (rp.country) countries.add(rp.country);
    });
    return {
      total: list.length,
      newLast30Days,
      updatedLast30Days,
      countryCount: countries.size
    };
  }

  /**
   * Count active filters
   */
  function getActiveFilterCount() {
    let count = 0;
    if (!settings.type) count += filters.type.length;
    if (!settings.sector) count += filters.sectors.length;
    count += filters.country.length;
    count += filters.credentialEcosystems.length;
    count += filters.credentialThemes.length;
    count += filters.vcFormat.length;
    count += filters.presentationProtocols.length;
    count += filters.interoperabilityProfiles.length;
    count += filters.interactionMode.length;
    count += filters.supportedWallets.length;
    if (filters.addedLast30Days) count += 1;
    if (filters.includesVideo) count += 1;
    if (TIER_UI_ENABLED && filters.officialOnly) count += 1;
    if (filters.ids && filters.ids.length > 0) count += 1;
    return count;
  }

  /**
   * Compute filter facets (counts per option) in one pass over RPs.
   * Called once after data load. Result is used for sidebar options and (n) counters.
   */
  function computeFilterFacets(rps) {
    const typeCount = {};
    const sectorCount = {};
    const credentialThemeCount = {};
    const credentialEcosystemCount = {};
    const countryCount = {};
    const credentialFormatCount = {};
    const presentationProtocolCount = { OpenID4VP: 0, 'ISO 18013-5': 0, '...other': 0 };
    const interopProfileCount = {};
    const interactionModeCount = {};
    const walletMap = new Map(); // id -> { name, count }
    let addedLast30Days = 0;
    let updatedLast30Days = 0;
    let includesVideo = 0;
    let officialOnly = 0;

    rps.forEach(rp => {
      if (rp.readiness) {
        typeCount[rp.readiness] = (typeCount[rp.readiness] || 0) + 1;
      }
      (rp.sectors || []).forEach(s => {
        if (typeof s === 'string' && Object.prototype.hasOwnProperty.call(SECTOR_LABELS, s)) {
          sectorCount[s] = (sectorCount[s] || 0) + 1;
        }
      });
      (rp.derivedCredentialThemes || []).forEach(t => {
        if (typeof t === 'string' && Object.prototype.hasOwnProperty.call(THEME_LABELS, t)) {
          credentialThemeCount[t] = (credentialThemeCount[t] || 0) + 1;
        }
      });
      (rp.derivedCredentialEcosystems || []).forEach(e => {
        if (typeof e === 'string' && Object.prototype.hasOwnProperty.call(ECOSYSTEM_LABELS, e)) {
          credentialEcosystemCount[e] = (credentialEcosystemCount[e] || 0) + 1;
        }
      });
      if (rp.country) {
        countryCount[rp.country] = (countryCount[rp.country] || 0) + 1;
      }
      (rp.vcFormat || []).forEach(f => {
        credentialFormatCount[f] = (credentialFormatCount[f] || 0) + 1;
      });
      const protocols = rp.presentationProtocols || [];
      if (protocols.includes('OpenID4VP')) presentationProtocolCount['OpenID4VP'] += 1;
      if (protocols.includes('ISO 18013-5')) presentationProtocolCount['ISO 18013-5'] += 1;
      if (protocols.some(p => p !== 'OpenID4VP' && p !== 'ISO 18013-5')) presentationProtocolCount['...other'] += 1;
      (rp.interoperabilityProfiles || []).forEach(p => {
        interopProfileCount[p] = (interopProfileCount[p] || 0) + 1;
      });
      const im = getRpInteractionMode(rp);
      interactionModeCount[im] = (interactionModeCount[im] || 0) + 1;
      (rp.supportedWallets || []).forEach(w => {
        if (typeof w === 'object' && w.walletCatalogId) {
          const id = w.walletCatalogId;
          if (!walletMap.has(id)) walletMap.set(id, { name: w.name, count: 0 });
          walletMap.get(id).count += 1;
        }
      });
      if (isWithinLastDays(getRPAddedDate(rp), 30)) addedLast30Days += 1;
      if (isWithinLastDays(getRPUpdatedDate(rp), 30)) updatedLast30Days += 1;
      if (rpHasVideo(rp)) includesVideo += 1;
      if (TIER_UI_ENABLED && rpCatalogTierIsPro(rp)) officialOnly += 1;
    });

    const supportedWallets = Array.from(walletMap.entries())
      .map(([id, o]) => ({ id, name: o.name, count: o.count }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const country = Object.entries(countryCount)
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => (countryNames[a.code] || a.code).localeCompare(countryNames[b.code] || b.code));
    const presentationProtocols = [];
    if (presentationProtocolCount['OpenID4VP'] > 0) presentationProtocols.push({ value: 'OpenID4VP', count: presentationProtocolCount['OpenID4VP'] });
    if (presentationProtocolCount['ISO 18013-5'] > 0) presentationProtocols.push({ value: 'ISO 18013-5', count: presentationProtocolCount['ISO 18013-5'] });
    if (presentationProtocolCount['...other'] > 0) presentationProtocols.push({ value: '...other', count: presentationProtocolCount['...other'] });

    return {
      type: typeCount,
      sectors: sectorCount,
      credentialEcosystems: credentialEcosystemCount,
      credentialThemes: credentialThemeCount,
      vcFormat: credentialFormatCount,
      interoperabilityProfiles: interopProfileCount,
      interactionMode: interactionModeCount,
      supportedWallets,
      country,
      presentationProtocols,
      addedLast30Days,
      updatedLast30Days,
      includesVideo,
      officialOnly
    };
  }

  /**
   * Get unique countries from loaded RPs (uses filterFacets when available)
   */
  function getAvailableCountries() {
    const countries = new Set();
    relyingParties.forEach(rp => {
      if (rp.country) countries.add(rp.country);
    });
    return Array.from(countries).sort((a, b) => {
      const nameA = countryNames[a] || a;
      const nameB = countryNames[b] || b;
      return nameA.localeCompare(nameB);
    });
  }

  /**
   * Get unique presentation protocols from loaded RPs
   * Simplified to: OpenID4VP, ISO 18013-5, and ...other
   */
  function getAvailablePresentationProtocols() {
    const hasOpenID4VP = relyingParties.some(rp => 
      (rp.presentationProtocols || []).includes('OpenID4VP')
    );
    const hasISO18013 = relyingParties.some(rp => 
      (rp.presentationProtocols || []).includes('ISO 18013-5')
    );
    const hasOther = relyingParties.some(rp => {
      const protocols = rp.presentationProtocols || [];
      return protocols.some(p => p !== 'OpenID4VP' && p !== 'ISO 18013-5');
    });
    
    const available = [];
    if (hasOpenID4VP) available.push('OpenID4VP');
    if (hasISO18013) available.push('ISO 18013-5');
    if (hasOther) available.push('...other');
    return available;
  }

  /**
   * Get unique supported wallets from loaded RPs (only those with walletCatalogId)
   */
  function getAvailableSupportedWallets() {
    const wallets = new Map(); // Map walletId -> name
    relyingParties.forEach(rp => {
      if (rp.supportedWallets) {
        rp.supportedWallets.forEach(w => {
          if (typeof w === 'object' && w.walletCatalogId) {
            wallets.set(w.walletCatalogId, w.name);
          }
        });
      }
    });
    // Return array of {id, name} sorted by name
    return Array.from(wallets.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function getRPDisplayData(rp) {
    const displayName = (rp && rp.name ? String(rp.name) : String(rp && rp.id ? rp.id : 'Unknown RP')).trim();
    const providerName = (rp && rp.provider && rp.provider.name ? String(rp.provider.name) : '—').trim();
    const addedDate = getRPAddedDate(rp);
    const updatedDate = getRPUpdatedDate(rp);
    let activityLabel = '—';
    let activityDateLabel = '—';
    if (addedDate && isWithinLastDays(new Date(addedDate), 30)) {
      activityLabel = `Added ${new Date(addedDate).toLocaleDateString('en-US')}`;
      activityDateLabel = new Date(addedDate).toLocaleDateString('en-US');
    } else if (updatedDate) {
      activityLabel = `Updated ${new Date(updatedDate).toLocaleDateString('en-US')}`;
      activityDateLabel = new Date(updatedDate).toLocaleDateString('en-US');
    } else if (addedDate) {
      activityLabel = `Added ${new Date(addedDate).toLocaleDateString('en-US')}`;
      activityDateLabel = new Date(addedDate).toLocaleDateString('en-US');
    }
    return {
      displayName,
      providerName: providerName || '—',
      activityLabel,
      activityDateLabel,
      isFeatured: !!(rp && rp.isFeatured),
      logoUrl: rp && (rp.logo || (rp.country ? `https://flagcdn.com/w80/${String(rp.country).toLowerCase()}.png` : null))
    };
  }

  function renderRPListHeader() {
    return `
      <div class="fides-rp-list-header" aria-hidden="true">
        <div></div>
        <div>Name</div>
        <div class="fides-list-col-likes"></div>
        <div>Provider</div>
        <div class="fides-list-col-links">Links</div>
        <div class="fides-list-col-updated">Updated</div>
      </div>
    `;
  }

  function renderRPRowLinks(rp) {
    const websiteUrl = (rp && typeof rp.website === 'string' ? rp.website.trim() : '');
    const videoUrl = rpPrimaryVideoUrl(rp);
    const websiteNode = websiteUrl
      ? `<a href="${escapeHtml(websiteUrl)}" target="_blank" rel="noopener" class="fides-rp-row-link" title="Visit website" aria-label="Visit website" onclick="event.stopPropagation();">${icons.externalLinkSmall}</a>`
      : `<span class="fides-rp-row-link fides-rp-row-link-muted" title="No website" aria-label="No website">${icons.externalLinkSmall}</span>`;
    const videoNode = videoUrl
      ? `<a href="${escapeHtml(videoUrl)}" target="_blank" rel="noopener" class="fides-rp-row-link" title="Watch video" aria-label="Watch video" onclick="event.stopPropagation();">${icons.play}</a>`
      : `<span class="fides-rp-row-link fides-rp-row-link-muted" title="No video" aria-label="No video">${icons.play}</span>`;
    return `${websiteNode}${videoNode}`;
  }

  function renderRPRow(rp) {
    const d = getRPDisplayData(rp);
    return `
      <div class="fides-rp-card${d.isFeatured ? ' fides-rp-row-featured' : ''}" data-rp-id="${escapeHtml(rp.id)}" role="button" tabindex="0" aria-label="${escapeHtml(d.providerName)} – ${escapeHtml(d.displayName)}">
        <div class="fides-rp-row-icon" aria-hidden="true">
          ${d.logoUrl
            ? `<img src="${escapeHtml(d.logoUrl)}" alt="${escapeHtml(d.displayName)}" style="width:22px;height:22px;object-fit:contain;border-radius:3px;">`
            : icons.globe
          }
        </div>
        <div class="fides-rp-row-name">
          <span class="fides-rp-row-name-text" title="${escapeHtml(d.displayName)}">${escapeHtml(d.displayName)}</span>
          ${d.isFeatured ? '<span class="fides-rp-row-featured-icon" title="Featured" aria-label="Featured">★</span>' : ''}
        </div>
        <div class="fides-rp-row-likes">${renderRPListLikeSummary(rp.id)}</div>
        <div class="fides-rp-row-provider" title="${escapeHtml(d.providerName)}">${escapeHtml(d.providerName)}</div>
        <div class="fides-rp-row-links">${renderRPRowLinks(rp)}</div>
        <div class="fides-rp-row-updated">${escapeHtml(d.activityDateLabel)}</div>
      </div>
    `;
  }

  function renderViewToggle() {
    return `
      <div class="fides-view-toggle" role="group" aria-label="View mode">
        <button class="fides-view-btn${viewMode === 'grid' ? ' active' : ''}" data-view="grid"
                aria-label="Grid view" aria-pressed="${viewMode === 'grid'}" title="Grid view">
          ${icons.viewGrid}
        </button>
        <button class="fides-view-btn${viewMode === 'list' ? ' active' : ''}" data-view="list"
                aria-label="List view" aria-pressed="${viewMode === 'list'}" title="List view">
          ${icons.viewList}
        </button>
      </div>
    `;
  }

  /**
   * Render the catalog
   */
  function render() {
    const filtered = getFilteredAndSortedRPs();
    const metrics = getCatalogMetrics(filtered);
    const activeFilterCount = getActiveFilterCount();
    
    // Save focus state
    const searchInput = document.getElementById('fides-search-input');
    const wasSearchFocused = searchInput && document.activeElement === searchInput;
    const cursorPosition = wasSearchFocused ? searchInput.selectionStart : 0;
    
    let html = '';

    // Main layout with sidebar
    html += `<div class="fides-main-layout fides-main ${settings.showFilters ? '' : 'no-filters'}">`;

    // Sidebar with search and filters
    if (settings.showFilters) {
      html += `
        <aside class="fides-sidebar">
          <div class="fides-sidebar-header">
            <div class="fides-sidebar-title">
              ${icons.filter}
              <span>Filters</span>
              <span class="fides-filter-count ${activeFilterCount > 0 ? '' : 'hidden'}">${activeFilterCount || 0}</span>
            </div>
            <div class="fides-sidebar-actions">
              <button class="fides-clear-all ${activeFilterCount > 0 ? '' : 'hidden'}" id="fides-clear">
                ${icons.x} Clear
              </button>
              <button class="fides-sidebar-close" id="fides-sidebar-close" aria-label="Close filters">
                ${icons.xLarge}
              </button>
            </div>
          </div>
          <div class="fides-sidebar-content">
            <div class="fides-quick-filters">
              <span class="fides-quick-filters-title">Quick filters</span>
              <label class="fides-filter-checkbox">
                <input type="checkbox" data-filter="addedLast30Days" data-value="true" ${filters.addedLast30Days ? 'checked' : ''}>
                <span>Added last 30 days<span class="fides-filter-option-count">(${filterFacets ? filterFacets.addedLast30Days : ''})</span></span>
              </label>
              <label class="fides-filter-checkbox">
                <input type="checkbox" data-filter="includesVideo" data-value="true" ${filters.includesVideo ? 'checked' : ''}>
                <span>Includes video<span class="fides-filter-option-count">(${filterFacets ? filterFacets.includesVideo : ''})</span></span>
              </label>
              ${TIER_UI_ENABLED ? `
              <label class="fides-filter-checkbox">
                <input type="checkbox" data-filter="officialOnly" data-value="true" ${filters.officialOnly ? 'checked' : ''}>
                <span>${OFFICIAL_FILTER_LABEL}<span class="fides-filter-option-count">(${filterFacets ? filterFacets.officialOnly : ''})</span></span>
              </label>
              ` : ''}
              ${originalIds.length > 0 ? `
              <label class="fides-filter-checkbox">
                <input type="checkbox" data-filter="linkedRPs" data-value="true" ${filters.ids.length > 0 ? 'checked' : ''}>
                <span>Linked relying parties<span class="fides-filter-option-count">(${originalIds.length})</span></span>
              </label>` : ''}
            </div>
            ${!settings.type ? `
              <div class="fides-filter-group collapsible ${!filterGroupState.type ? 'collapsed' : ''} ${filters.type.length > 0 ? 'has-active' : ''}" data-filter-group="type">
                <button class="fides-filter-label-toggle" type="button" aria-expanded="${filterGroupState.type}">
                  <span class="fides-filter-label">Readiness</span>
                  <span class="fides-filter-active-indicator"></span>
                  ${chevronDown}
                </button>
                <div class="fides-filter-options">
                  <label class="fides-filter-checkbox">
                    <input type="checkbox" data-filter="type" data-value="technical-demo" ${filters.type.includes('technical-demo') ? 'checked' : ''}>
                    <span>Technical Demo<span class="fides-filter-option-count">(${filterFacets ? (filterFacets.type['technical-demo'] || 0) : ''})</span></span>
                  </label>
                  <label class="fides-filter-checkbox">
                    <input type="checkbox" data-filter="type" data-value="use-case-demo" ${filters.type.includes('use-case-demo') ? 'checked' : ''}>
                    <span>Use Case Demo<span class="fides-filter-option-count">(${filterFacets ? (filterFacets.type['use-case-demo'] || 0) : ''})</span></span>
                  </label>
                  <label class="fides-filter-checkbox">
                    <input type="checkbox" data-filter="type" data-value="production-pilot" ${filters.type.includes('production-pilot') ? 'checked' : ''}>
                    <span>Production Pilot<span class="fides-filter-option-count">(${filterFacets ? (filterFacets.type['production-pilot'] || 0) : ''})</span></span>
                  </label>
                  <label class="fides-filter-checkbox">
                    <input type="checkbox" data-filter="type" data-value="production" ${filters.type.includes('production') ? 'checked' : ''}>
                    <span>Production<span class="fides-filter-option-count">(${filterFacets ? (filterFacets.type['production'] || 0) : ''})</span></span>
                  </label>
                </div>
              </div>
            ` : ''}
            <div class="fides-filter-group collapsible ${!filterGroupState.interactionMode ? 'collapsed' : ''} ${filters.interactionMode.length > 0 ? 'has-active' : ''}" data-filter-group="interactionMode">
                <button class="fides-filter-label-toggle" type="button" aria-expanded="${filterGroupState.interactionMode}">
                  <span class="fides-filter-label">Interaction mode</span>
                  <span class="fides-filter-active-indicator"></span>
                  ${chevronDown}
                </button>
                <div class="fides-filter-options">
                  ${INTERACTION_MODE_ORDER.map(code => `
                  <label class="fides-filter-checkbox">
                    <input type="checkbox" data-filter="interactionMode" data-value="${code}" ${filters.interactionMode.includes(code) ? 'checked' : ''}>
                    <span>${escapeHtml(INTERACTION_MODE_LABELS[code])}<span class="fides-filter-option-count">(${filterFacets ? (filterFacets.interactionMode[code] || 0) : ''})</span></span>
                  </label>
                  `).join('')}
                </div>
              </div>
            ${(filterFacets ? filterFacets.supportedWallets : getAvailableSupportedWallets()).length > 0 ? `
              <div class="fides-filter-group collapsible ${!filterGroupState.supportedWallets ? 'collapsed' : ''} ${filters.supportedWallets.length > 0 ? 'has-active' : ''}" data-filter-group="supportedWallets">
                <button class="fides-filter-label-toggle" type="button" aria-expanded="${filterGroupState.supportedWallets}">
                  <span class="fides-filter-label">Supported Wallet</span>
                  <span class="fides-filter-active-indicator"></span>
                  ${chevronDown}
                </button>
                <div class="fides-filter-options">
                  ${(filterFacets ? filterFacets.supportedWallets : getAvailableSupportedWallets().map(w => ({ id: w.id, name: w.name, count: 0 }))).map(wallet => `
                    <label class="fides-filter-checkbox">
                      <input type="checkbox" data-filter="supportedWallets" data-value="${wallet.id}" ${filters.supportedWallets.includes(wallet.id) ? 'checked' : ''}>
                      <span>${escapeHtml(wallet.name)}<span class="fides-filter-option-count">(${wallet.count != null ? wallet.count : ''})</span></span>
                    </label>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            ${!settings.sector ? `
              <div class="fides-filter-group collapsible ${!filterGroupState.sectors ? 'collapsed' : ''} ${filters.sectors.length > 0 ? 'has-active' : ''}" data-filter-group="sectors">
                <button class="fides-filter-label-toggle" type="button" aria-expanded="${filterGroupState.sectors}">
                  <span class="fides-filter-label">Sector</span>
                  <span class="fides-filter-active-indicator"></span>
                  ${chevronDown}
                </button>
                <div class="fides-filter-options">
                  ${SECTOR_CODES_ALPHABETIC.map(code => `
                  <label class="fides-filter-checkbox">
                    <input type="checkbox" data-filter="sectors" data-value="${code}" ${filters.sectors.includes(code) ? 'checked' : ''}>
                    <span>${escapeHtml(SECTOR_LABELS[code])}<span class="fides-filter-option-count">(${filterFacets ? (filterFacets.sectors[code] || 0) : ''})</span></span>
                  </label>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            <div class="fides-filter-group collapsible ${!filterGroupState.credentialEcosystems ? 'collapsed' : ''} ${filters.credentialEcosystems.length > 0 ? 'has-active' : ''}" data-filter-group="credentialEcosystems">
                <button class="fides-filter-label-toggle" type="button" aria-expanded="${filterGroupState.credentialEcosystems}">
                  <span class="fides-filter-label">Ecosystem</span>
                  <span class="fides-filter-active-indicator"></span>
                  ${chevronDown}
                </button>
                <div class="fides-filter-options">
                  ${ECOSYSTEM_CODES_ALPHABETIC.map(code => `
                  <label class="fides-filter-checkbox">
                    <input type="checkbox" data-filter="credentialEcosystems" data-value="${code}" ${filters.credentialEcosystems.includes(code) ? 'checked' : ''}>
                    <span>${escapeHtml(ECOSYSTEM_LABELS[code])}<span class="fides-filter-option-count">(${filterFacets ? (filterFacets.credentialEcosystems[code] || 0) : ''})</span></span>
                  </label>
                  `).join('')}
                </div>
              </div>
            <div class="fides-filter-group collapsible ${!filterGroupState.credentialThemes ? 'collapsed' : ''} ${filters.credentialThemes.length > 0 ? 'has-active' : ''}" data-filter-group="credentialThemes">
                <button class="fides-filter-label-toggle" type="button" aria-expanded="${filterGroupState.credentialThemes}">
                  <span class="fides-filter-label">Theme</span>
                  <span class="fides-filter-active-indicator"></span>
                  ${chevronDown}
                </button>
                <div class="fides-filter-options">
                  ${THEME_CODES_ALPHABETIC.map(code => `
                  <label class="fides-filter-checkbox">
                    <input type="checkbox" data-filter="credentialThemes" data-value="${code}" ${filters.credentialThemes.includes(code) ? 'checked' : ''}>
                    <span>${escapeHtml(THEME_LABELS[code])}<span class="fides-filter-option-count">(${filterFacets ? (filterFacets.credentialThemes[code] || 0) : ''})</span></span>
                  </label>
                  `).join('')}
                </div>
              </div>
            ${(filterFacets ? filterFacets.country : getAvailableCountries()).length > 0 ? `
              <div class="fides-filter-group collapsible ${!filterGroupState.country ? 'collapsed' : ''} ${filters.country.length > 0 ? 'has-active' : ''}" data-filter-group="country">
                <button class="fides-filter-label-toggle" type="button" aria-expanded="${filterGroupState.country}">
                  <span class="fides-filter-label">Country</span>
                  <span class="fides-filter-active-indicator"></span>
                  ${chevronDown}
                </button>
                <div class="fides-filter-options">
                  ${(filterFacets ? filterFacets.country : getAvailableCountries().map(code => ({ code, count: 0 }))).map(({ code, count }) => `
                    <label class="fides-filter-checkbox">
                      <input type="checkbox" data-filter="country" data-value="${code}" ${filters.country.includes(code) ? 'checked' : ''}>
                      <span><img src="https://flagcdn.com/w20/${code.toLowerCase()}.png" alt="" class="fides-country-flag"> ${countryNames[code] || code}<span class="fides-filter-option-count">(${count != null ? count : ''})</span></span>
                    </label>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            <div class="fides-filter-group collapsible ${!filterGroupState.vcFormat ? 'collapsed' : ''} ${filters.vcFormat.length > 0 ? 'has-active' : ''}" data-filter-group="vcFormat">
              <button class="fides-filter-label-toggle" type="button" aria-expanded="${filterGroupState.vcFormat}">
                <span class="fides-filter-label">VC format</span>
                <span class="fides-filter-active-indicator"></span>
                ${chevronDown}
              </button>
              <div class="fides-filter-options">
                ${CREDENTIAL_FORMAT_ORDER.map((code) => `
                <label class="fides-filter-checkbox">
                  <input type="checkbox" data-filter="vcFormat" data-value="${escapeHtml(code)}" ${filters.vcFormat.includes(code) ? 'checked' : ''}>
                  <span>${escapeHtml(credentialFormatDisplayLabel(code))}<span class="fides-filter-option-count">(${filterFacets ? (filterFacets.vcFormat[code] || 0) : ''})</span></span>
                </label>`).join('')}
              </div>
            </div>
            ${(filterFacets ? filterFacets.presentationProtocols : getAvailablePresentationProtocols()).length > 0 ? `
              <div class="fides-filter-group collapsible ${!filterGroupState.presentationProtocols ? 'collapsed' : ''} ${filters.presentationProtocols.length > 0 ? 'has-active' : ''}" data-filter-group="presentationProtocols">
                <button class="fides-filter-label-toggle" type="button" aria-expanded="${filterGroupState.presentationProtocols}">
                  <span class="fides-filter-label">Presentation Protocol</span>
                  <span class="fides-filter-active-indicator"></span>
                  ${chevronDown}
                </button>
                <div class="fides-filter-options">
                  ${(filterFacets ? filterFacets.presentationProtocols : getAvailablePresentationProtocols().map(v => ({ value: v, count: 0 }))).map(({ value: protocol, count }) => `
                    <label class="fides-filter-checkbox">
                      <input type="checkbox" data-filter="presentationProtocols" data-value="${protocol}" ${filters.presentationProtocols.includes(protocol) ? 'checked' : ''}>
                      <span>${protocol === '...other' ? '<em>...other</em>' : escapeHtml(protocol)}<span class="fides-filter-option-count">(${count != null ? count : ''})</span></span>
                    </label>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            <div class="fides-filter-group collapsible ${!filterGroupState.interoperabilityProfiles ? 'collapsed' : ''} ${filters.interoperabilityProfiles.length > 0 ? 'has-active' : ''}" data-filter-group="interoperabilityProfiles">
              <button class="fides-filter-label-toggle" type="button" aria-expanded="${filterGroupState.interoperabilityProfiles}">
                <span class="fides-filter-label">Interop Profile</span>
                <span class="fides-filter-active-indicator"></span>
                ${chevronDown}
              </button>
              <div class="fides-filter-options">
                <label class="fides-filter-checkbox">
                  <input type="checkbox" data-filter="interoperabilityProfiles" data-value="DIIP v4" ${filters.interoperabilityProfiles.includes('DIIP v4') ? 'checked' : ''}>
                  <span>DIIP v4<span class="fides-filter-option-count">(${filterFacets ? (filterFacets.interoperabilityProfiles['DIIP v4'] || 0) : ''})</span></span>
                </label>
                <label class="fides-filter-checkbox">
                  <input type="checkbox" data-filter="interoperabilityProfiles" data-value="DIIP v5" ${filters.interoperabilityProfiles.includes('DIIP v5') ? 'checked' : ''}>
                  <span>DIIP v5<span class="fides-filter-option-count">(${filterFacets ? (filterFacets.interoperabilityProfiles['DIIP v5'] || 0) : ''})</span></span>
                </label>
                <label class="fides-filter-checkbox">
                  <input type="checkbox" data-filter="interoperabilityProfiles" data-value="EWC v3" ${filters.interoperabilityProfiles.includes('EWC v3') ? 'checked' : ''}>
                  <span>EWC v3<span class="fides-filter-option-count">(${filterFacets ? (filterFacets.interoperabilityProfiles['EWC v3'] || 0) : ''})</span></span>
                </label>
                <label class="fides-filter-checkbox">
                  <input type="checkbox" data-filter="interoperabilityProfiles" data-value="HAIP v1" ${filters.interoperabilityProfiles.includes('HAIP v1') ? 'checked' : ''}>
                  <span>HAIP v1<span class="fides-filter-option-count">(${filterFacets ? (filterFacets.interoperabilityProfiles['HAIP v1'] || 0) : ''})</span></span>
                </label>
                <label class="fides-filter-checkbox">
                  <input type="checkbox" data-filter="interoperabilityProfiles" data-value="EUDI Wallet ARF" ${filters.interoperabilityProfiles.includes('EUDI Wallet ARF') ? 'checked' : ''}>
                  <span>EUDI Wallet ARF<span class="fides-filter-option-count">(${filterFacets ? (filterFacets.interoperabilityProfiles['EUDI Wallet ARF'] || 0) : ''})</span></span>
                </label>
              </div>
            </div>
          </div>
        </aside>
      `;
    }

    // Content area
    html += `<div class="fides-content">`;

    // Results bar: search + sort + map (+ mobile filter) — same pattern as wallet catalog
    html += `
      <div class="fides-results-bar">
        ${settings.showSearch ? `
          <div class="fides-topbar-search">
            <div class="fides-search-wrapper">
              <span class="fides-search-icon">${icons.search}</span>
              <input
                type="text"
                class="fides-search-input"
                placeholder="Search..."
                value="${escapeHtml(filters.search)}"
                id="fides-search-input"
                autocomplete="off"
              >
              <button class="fides-search-clear ${filters.search ? '' : 'hidden'}" id="fides-search-clear" type="button" aria-label="Clear search">
                ${icons.xSmall}
              </button>
            </div>
          </div>
        ` : ''}
        <div class="fides-results-bar-actions">
          ${settings.showFilters ? `
            <button class="fides-mobile-filter-toggle" id="fides-mobile-filter-toggle">
              ${icons.filter}
              <span>Filters</span>
              <span class="fides-filter-count ${activeFilterCount > 0 ? '' : 'hidden'}">${activeFilterCount || 0}</span>
            </button>
          ` : ''}
          <label class="fides-sort-label" for="fides-sort-select">
            <span class="fides-sort-text">Sort by</span>
            <select class="fides-sort-select" id="fides-sort-select" aria-label="Sort order">
              <option value="lastUpdated" ${sortBy === 'lastUpdated' ? 'selected' : ''}>Last updated</option>
              <option value="rating" ${sortBy === 'rating' ? 'selected' : ''}>Likes</option>
              <option value="name" ${sortBy === 'name' ? 'selected' : ''}>Provider</option>
            </select>
          </label>
        </div>
        <a href="${MAP_PAGE_URL}" class="fides-show-on-map" target="_blank" rel="noopener" aria-label="Show on map (opens in new tab)">${icons.externalLink}<span class="fides-show-on-map-label fides-show-on-map-label--full">Show on map</span><span class="fides-show-on-map-label fides-show-on-map-label--short" aria-hidden="true">Map</span></a>
        ${renderViewToggle()}
      </div>
      <div class="fides-kpi-row">
        <div class="fides-kpi-card" data-kpi-action="clear-added-filter">
          <span class="fides-kpi-value">${metrics.total}</span>
          <span class="fides-kpi-label fides-kpi-label-long">Relying party websites</span><span class="fides-kpi-label fides-kpi-label-short" aria-hidden="true">Relying parties</span>
        </div>
        <div class="fides-kpi-card ${filters.addedLast30Days ? 'active' : ''}" data-kpi-action="toggle-added-filter">
          <span class="fides-kpi-value">${metrics.newLast30Days}</span>
          <span class="fides-kpi-label">New<span class="fides-kpi-label-extra"> last 30 days</span></span>
        </div>
        <div class="fides-kpi-card" data-kpi-action="set-last-updated-sort">
          <span class="fides-kpi-value">${metrics.updatedLast30Days}</span>
          <span class="fides-kpi-label">Updated<span class="fides-kpi-label-extra"> last 30 days</span></span>
        </div>
        <div class="fides-kpi-card ${filters.country.length > 0 ? 'active' : ''}" data-kpi-action="clear-country-filter">
          <span class="fides-kpi-value">${metrics.countryCount}</span>
          <span class="fides-kpi-label">Countries</span>
        </div>
      </div>
    `;

    // RP grid/list
    if (filtered.length > 0) {
      const ev = effectiveView();
      html += `<div class="fides-rp-grid" data-view="${ev}" data-columns="${settings.columns}">`;
      if (ev === 'list') {
        html += renderRPListHeader();
      }
      filtered.forEach(rp => {
        html += ev === 'list' ? renderRPRow(rp) : renderRPCard(rp);
      });
      html += '</div>';
    } else {
      html += `
        <div class="fides-empty">
          <div class="fides-empty-icon">${icons.laptop}</div>
          <h3 class="fides-empty-title">No relying party websites found</h3>
          <p class="fides-empty-text">Adjust your filters or try a different search query.</p>
        </div>
      `;
    }

    html += '</div>'; // Close fides-content
    html += '</div>'; // Close fides-main-layout

    container.innerHTML = html;
    attachEventListeners();
    
    // Restore focus
    if (wasSearchFocused) {
      const newSearchInput = document.getElementById('fides-search-input');
      if (newSearchInput) {
        newSearchInput.focus();
        newSearchInput.setSelectionRange(cursorPosition, cursorPosition);
      }
    }
  }

  /**
   * Update only the RP grid and results count (for search without losing focus)
   * This avoids re-rendering the search input which causes keyboard to close on mobile
   */
  function renderRPGridOnly() {
    const filtered = getFilteredAndSortedRPs();
    const metrics = getCatalogMetrics(filtered);

    const kpiTotal = container.querySelector('.fides-kpi-card[data-kpi-action="clear-added-filter"] .fides-kpi-value');
    const kpiNew = container.querySelector('.fides-kpi-card[data-kpi-action="toggle-added-filter"] .fides-kpi-value');
    const kpiUpdated = container.querySelector('.fides-kpi-card[data-kpi-action="set-last-updated-sort"] .fides-kpi-value');
    const kpiCountries = container.querySelector('.fides-kpi-card[data-kpi-action="clear-country-filter"] .fides-kpi-value');
    const kpiAddedCard = container.querySelector('.fides-kpi-card[data-kpi-action="toggle-added-filter"]');
    const kpiCountryCard = container.querySelector('.fides-kpi-card[data-kpi-action="clear-country-filter"]');
    if (kpiTotal) kpiTotal.textContent = String(metrics.total);
    if (kpiNew) kpiNew.textContent = String(metrics.newLast30Days);
    if (kpiUpdated) kpiUpdated.textContent = String(metrics.updatedLast30Days);
    if (kpiCountries) kpiCountries.textContent = String(metrics.countryCount);
    if (kpiAddedCard) kpiAddedCard.classList.toggle('active', filters.addedLast30Days);
    if (kpiCountryCard) kpiCountryCard.classList.toggle('active', filters.country.length > 0);

    const searchClear = document.getElementById('fides-search-clear');
    if (searchClear) {
      searchClear.classList.toggle('hidden', !filters.search);
    }

    const gridContainer = container.querySelector('.fides-rp-grid');
    const emptyContainer = container.querySelector('.fides-empty');
    const contentArea = container.querySelector('.fides-content');

    if (filtered.length > 0) {
      if (emptyContainer) {
        emptyContainer.remove();
      }

      let grid = gridContainer;
      if (!grid) {
        grid = document.createElement('div');
        grid.className = 'fides-rp-grid';
        grid.setAttribute('data-columns', settings.columns);
        grid.setAttribute('data-view', effectiveView());
        const kpiRow = contentArea.querySelector('.fides-kpi-row');
        if (kpiRow) {
          kpiRow.after(grid);
        } else {
          const resultsBar = contentArea.querySelector('.fides-results-bar');
          if (resultsBar) resultsBar.after(grid);
          else contentArea.appendChild(grid);
        }
      }
      
      // Render RP cards/list rows
      const ev = effectiveView();
      grid.setAttribute('data-view', ev);
      let html = '';
      if (ev === 'list') {
        html += renderRPListHeader();
      }
      filtered.forEach(rp => {
        html += ev === 'list' ? renderRPRow(rp) : renderRPCard(rp);
      });
      grid.innerHTML = html;
      
      // Attach RP card click listeners
      attachRPCardListeners();
    } else {
      // Remove grid if present
      if (gridContainer) {
        gridContainer.remove();
      }
      
      // Show empty state if not present
      if (!emptyContainer) {
        const empty = document.createElement('div');
        empty.className = 'fides-empty';
        empty.innerHTML = `
          <div class="fides-empty-icon">${icons.laptop}</div>
          <h3 class="fides-empty-title">No relying party websites found</h3>
          <p class="fides-empty-text">Adjust your filters or try a different search query.</p>
        `;
        contentArea.appendChild(empty);
      }
    }
  }

  /**
   * Attach click listeners to RP cards (for use after grid-only updates)
   */
  function attachRPCardListeners() {
    const rpCards = container.querySelectorAll('.fides-rp-card');
    rpCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        openRPDetail(card.dataset.rpId);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openRPDetail(card.dataset.rpId);
        }
      });
    });
  }

  function renderRPCountryFlag(rp) {
    const code = rp && rp.country ? String(rp.country).trim().toUpperCase() : '';
    if (!code || code.length !== 2) return '';
    const label = countryNames[code] || code;
    return '<span class="fides-rp-country" title="' + escapeHtml(label) + '" aria-label="' + escapeHtml(label) + '">' +
      '<img src="https://flagcdn.com/w40/' + encodeURIComponent(code.toLowerCase()) + '.png" alt="" class="fides-rp-country-flag" width="16" height="12" loading="lazy" decoding="async" />' +
      '</span>';
  }

  function renderRPCardLogoMain(rp) {
    const logoUrl = rp.logo || (rp.country ? `https://flagcdn.com/w80/${String(rp.country).toLowerCase()}.png` : null);
    if (logoUrl) {
      return '<img src="' + escapeHtml(logoUrl) + '" alt="" width="64" height="64" loading="lazy" decoding="async">';
    }
    return icons.globe;
  }

  function renderRPCardFooterBadges(rp) {
    if (TIER_UI_ENABLED && window.FidesCatalogUI && typeof window.FidesCatalogUI.buildCatalogListingHeaderBadgeHtml === 'function') {
      const badge = window.FidesCatalogUI.buildCatalogListingHeaderBadgeHtml(rp, {
        tierUiEnabled: TIER_UI_ENABLED,
        editAccess: EDIT_ACCESS,
        isLoggedIn: RATINGS_IS_LOGGED_IN,
      });
      if (badge) {
        return '<div class="fides-rp-card-footer-badges fides-rp-card-footer-listing">' + badge + '</div>';
      }
    }
    if (rp.isFeatured) {
      return '<div class="fides-rp-card-footer-badges"><span class="fides-featured-badge">⭐ Featured</span></div>';
    }
    return '';
  }

  function getRpCountryDisplayLabel(rp) {
    const code = normalizeCountryFilterCode(rp && rp.country ? rp.country : '');
    if (!code) return '';
    return countryNames[code] || code;
  }

  function getRpPrimarySectorLabel(rp) {
    const sectors = Array.isArray(rp && rp.sectors) ? rp.sectors : [];
    for (let i = 0; i < sectors.length; i++) {
      const code = normalizeSectorFilterCode(sectors[i]);
      if (code && SECTOR_LABELS[code]) return SECTOR_LABELS[code];
    }
    return '';
  }

  function renderRPCardMetaCountryIcon(rp) {
    const code = normalizeCountryFilterCode(rp && rp.country ? rp.country : '');
    if (code.length === 2) {
      return '<img src="https://flagcdn.com/w20/' + encodeURIComponent(code.toLowerCase()) + '.png" alt="" class="fides-country-flag" width="20" height="15" loading="lazy" />';
    }
    return icons.globe;
  }

  function renderRPCardMetaStripItem(icon, label, value) {
    const displayValue = value || '—';
    const titleAttr = displayValue !== '—' ? ' title="' + escapeHtml(displayValue) + '"' : '';
    return '<div class="fides-rp-meta-item">' +
      '<div class="fides-rp-meta-heading">' +
      '<span class="fides-rp-meta-icon" aria-hidden="true">' + icon + '</span>' +
      '<span class="fides-rp-meta-label">' + escapeHtml(label) + '</span>' +
      '</div>' +
      '<p class="fides-rp-meta-value"' + titleAttr + '>' + escapeHtml(displayValue) + '</p>' +
      '</div>';
  }

  function renderRPCardMetaStrip(rp) {
    const countryValue = getRpCountryDisplayLabel(rp);
    const readinessValue = rp && rp.readiness
      ? (READINESS_LABELS[rp.readiness] || String(rp.readiness))
      : '';
    const sectorValue = getRpPrimarySectorLabel(rp);
    return '<div class="fides-rp-meta-strip" aria-label="Relying party summary">' +
      renderRPCardMetaStripItem(renderRPCardMetaCountryIcon(rp), 'Country', countryValue) +
      renderRPCardMetaStripItem(icons.check, 'Readiness', readinessValue) +
      renderRPCardMetaStripItem(icons.building, 'Sector', sectorValue) +
      '</div>';
  }

  function rpCardAriaLabel(rp) {
    const d = getRPDisplayData(rp);
    return escapeHtml(d.displayName);
  }

  /**
   * Render a single RP card (grid view — aligned with wallet catalog layout).
   */
  function renderRPCard(rp) {
    const d = getRPDisplayData(rp);
    const featuredClass = rp.isFeatured ? ' fides-rp-card-featured' : '';
    const readinessClass = rp.readiness ? ` readiness-${rp.readiness}` : '';
    const logoMain = renderRPCardLogoMain(rp);

    return `
      <div class="fides-rp-card${featuredClass}" data-rp-id="${escapeHtml(rp.id)}" role="button" tabindex="0" aria-label="${rpCardAriaLabel(rp)}">
        <header class="fides-rp-header fides-rp-card-header--text-only${readinessClass}">
          <div class="fides-rp-info">
            <h3 class="fides-rp-name" title="${escapeHtml(d.displayName)}">${escapeHtml(d.displayName)}</h3>
            <p class="fides-rp-provider"><span class="fides-rp-provider-text">${escapeHtml(d.providerName)}</span></p>
          </div>
        </header>
        <div class="fides-rp-body">
          <p class="fides-rp-rating-summary">${renderRPRatingSummary(rp.id)}</p>
          <div class="fides-rp-card-logo-panel" aria-hidden="true">
            <div class="fides-rp-card-logo-main">${logoMain}</div>
          </div>
        </div>
        ${renderRPCardMetaStrip(rp)}
        <div class="fides-rp-footer">
          <div class="fides-rp-card-footer-start">
            ${renderRPCardFooterBadges(rp)}
          </div>
          <span class="fides-view-details">${icons.eye} View details</span>
        </div>
      </div>
    `;
  }

  function setRPRatingSummary(rpId, rawSummary) {
    if (!rpId || !rawSummary) return;
    const likeCount = Number(rawSummary.likes);
    ratingSummariesByRpId[rpId] = {
      avg: Number(rawSummary.avg) || 0,
      count: isFinite(likeCount) ? likeCount : (Number(rawSummary.count) || 0),
      myRating: Number(rawSummary.my_like) > 0 || Number(rawSummary.my_rating) > 0 ? 1 : null
    };
  }

  function renderRPRatingSummary(rpId) {
    const summary = ratingSummariesByRpId[rpId];
    if (!summary || summary.count < 1) {
      return '<span class="fides-item-rating fides-item-rating-empty"><span class="fides-item-rating-text">No likes yet</span></span>';
    }
    const label = summary.count + ' like' + (summary.count === 1 ? '' : 's');
    const likedClass = summary.myRating === 1 ? ' is-liked' : '';
    return '<span class="fides-item-rating' + likedClass + '" title="Community likes">' +
      '<span class="fides-item-rating-star">★</span><span class="fides-item-rating-text">' + escapeHtml(label) + '</span>' +
      '</span>';
  }

  function renderRPListLikeSummary(rpId) {
    const summary = ratingSummariesByRpId[rpId];
    const count = summary ? (Number(summary.count) || 0) : 0;
    if (count < 1) return '';
    const likedClass = summary && summary.myRating === 1 ? ' is-liked' : '';
    return '<span class="fides-list-like' + likedClass + '" title="Community likes">' +
      '<span class="fides-list-like-star">★</span><span class="fides-list-like-count">' + escapeHtml(count) + '</span>' +
      '</span>';
  }

  function updateRPLikeInPlace(rpId) {
    if (!rpId || !container) return;
    const cards = container.querySelectorAll('.fides-rp-card[data-rp-id]');
    if (!cards.length) return;
    cards.forEach((card) => {
      if ((card.getAttribute('data-rp-id') || '') !== rpId) return;
      const cardSummary = card.querySelector('.fides-rp-rating-summary');
      if (cardSummary) cardSummary.innerHTML = renderRPRatingSummary(rpId);
      const rowSummary = card.querySelector('.fides-rp-row-likes');
      if (rowSummary) rowSummary.innerHTML = renderRPListLikeSummary(rpId);
    });
  }

  function rpRatingSortValue(rp) {
    const summary = rp && rp.id ? ratingSummariesByRpId[rp.id] : null;
    return {
      stars: summary ? (Number(summary.count) || 0) : 0
    };
  }

  function buildRatingsEndpoint(baseUrl, path, queryParams) {
    const rawBase = String(baseUrl || '').trim();
    const safePath = String(path || '').replace(/^\/+/, '');
    if (!rawBase) return '';
    try {
      const url = new URL(rawBase, window.location.origin);
      if (url.origin !== window.location.origin) {
        url.protocol = window.location.protocol;
        url.host = window.location.host;
      }
      if (url.searchParams.has('rest_route')) {
        const currentRoute = String(url.searchParams.get('rest_route') || '').replace(/\/+$/, '');
        url.searchParams.set('rest_route', currentRoute + '/' + safePath);
      } else {
        const basePath = url.pathname.replace(/\/+$/, '');
        url.pathname = basePath + '/' + safePath;
      }
      if (queryParams && typeof queryParams === 'object') {
        Object.keys(queryParams).forEach((key) => {
          const value = queryParams[key];
          if (value === null || value === undefined || value === '') return;
          url.searchParams.set(key, String(value));
        });
      }
      return url.toString();
    } catch (e) {
      return '';
    }
  }

  async function loadRPRatingSummaries(items) {
    ratingSummariesByRpId = Object.create(null);
    if (!RATINGS_API_BASE || !Array.isArray(items) || items.length === 0) return;
    const ids = Array.from(new Set(items.map((rp) => rp && rp.id).filter(Boolean)));
    for (let i = 0; i < ids.length; i += RATINGS_BATCH_LIMIT) {
      const chunk = ids.slice(i, i + RATINGS_BATCH_LIMIT);
      const url = buildRatingsEndpoint(RATINGS_API_BASE, 'ratings/batch', {
        type: 'rp',
        ids: chunk.join(','),
        _wpnonce: RATINGS_NONCE || ''
      });
      if (!url) continue;
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'X-WP-Nonce': RATINGS_NONCE || ''
        }
      });
      if (!response.ok) continue;
      const data = await response.json();
      const results = data && data.results ? data.results : {};
      Object.keys(results).forEach((rpId) => setRPRatingSummary(rpId, results[rpId]));
    }
  }

  /**
   * Render the RP detail modal
   */
  function renderModal(rp) {
    const readinessLabels = {
      'technical-demo': 'Technical Demo',
      'use-case-demo': 'Use Case Demo',
      'production-pilot': 'Production Pilot',
      'production': 'Production'
    };

    const interactionMode = getRpInteractionMode(rp);

    const statusLabels = {
      development: 'In Development',
      beta: 'Beta',
      live: 'Live',
      deprecated: 'Deprecated'
    };

    const currentTheme = container.getAttribute('data-theme') || 'dark';
    
    // Use country flag as fallback logo
    const modalLogoUrl = rp.logo || (rp.country ? `https://flagcdn.com/w80/${rp.country.toLowerCase()}.png` : null);

    const orgCatalogHref = getOrganizationCatalogDeepLinkHref(
      rp.orgId,
      ORGANIZATION_CATALOG_PAGE_URL
    );
    const providerName = rp.provider && rp.provider.name ? String(rp.provider.name) : '';
    const providerNameHtml = orgCatalogHref && providerName
      ? `<a href="${escapeHtml(orgCatalogHref)}" class="fides-modal-link-inline" aria-label="View organization in organization catalog" title="Organization catalog" onclick="event.stopPropagation();"><span>${escapeHtml(providerName)}</span></a>`
      : escapeHtml(providerName);

    const modalHtml = `
      <div class="fides-modal-overlay" id="fides-modal-overlay" data-theme="${currentTheme}">
        <div class="fides-modal" role="dialog" aria-modal="true" aria-labelledby="fides-modal-title">
          <div class="fides-modal-header">
            <div class="fides-modal-header-content">
              ${modalLogoUrl 
                ? `<img src="${escapeHtml(modalLogoUrl)}" alt="${escapeHtml(rp.name)}" class="fides-modal-logo">`
                : `<div class="fides-modal-logo-placeholder">${icons.globe}</div>`
              }
              <div class="fides-modal-title-wrap">
                <h2 class="fides-modal-title" id="fides-modal-title">${escapeHtml(rp.name)}</h2>
                <p class="fides-modal-provider">${icons.building} ${providerNameHtml}</p>
              </div>
            </div>
            <div class="fides-modal-header-actions">
              <button type="button" class="fides-modal-copy-link" id="fides-modal-copy-link" aria-label="Copy link to this relying party" title="Copy link to this relying party">
                ${icons.share}
              </button>
              <button class="fides-modal-close" id="fides-modal-close" aria-label="Close modal">
                ${icons.xLarge}
              </button>
            </div>
          </div>
          
          <div class="fides-modal-body">
            ${rp.description ? `
              <div class="fides-modal-section">
                <p class="fides-modal-description">${escapeHtml(rp.description)}</p>
              </div>
            ` : ''}

            <!-- Video embed (if available) -->
            ${rpPrimaryVideoUrl(rp) ? getVideoEmbedHtml(rpPrimaryVideoUrl(rp)) : ''}

            <!-- Quick info grid -->
            <div class="fides-modal-grid">
              <div class="fides-modal-grid-item">
                <div class="fides-modal-grid-label">
                  ${icons.laptop} Interaction mode
                </div>
                <div class="fides-modal-grid-value">
                  <span class="fides-tag interaction-mode-tag interaction-${interactionMode}">${escapeHtml(INTERACTION_MODE_LABELS[interactionMode])}</span>
                </div>
              </div>
              <!-- Sectors (canonical codes → English labels like credential catalog) -->
              ${(() => {
                const sc = (rp.sectors || []).filter(s => typeof s === 'string' && Object.prototype.hasOwnProperty.call(SECTOR_LABELS, s));
                if (!sc.length) return '';
                const inner = sc
                  .sort((a, b) => SECTOR_LABELS[a].localeCompare(SECTOR_LABELS[b], 'en', { sensitivity: 'base' }))
                  .map(s => `<span class="fides-tag sector">${escapeHtml(SECTOR_LABELS[s])}</span>`)
                  .join('');
                return `
                <div class="fides-modal-grid-item">
                  <div class="fides-modal-grid-label">
                    ${icons.building} Sectors
                  </div>
                  <div class="fides-modal-grid-value">
                    ${inner}
                  </div>
                </div>`;
              })()}

              <!-- Accepted Credentials -->
              ${getAcceptedCredentialRows(rp).length > 0 ? `
                <div class="fides-modal-grid-item">
                  <div class="fides-modal-grid-label">
                    ${icons.fileCheck} Accepted Credentials
                  </div>
                  <div class="fides-modal-grid-value">
                    ${renderAcceptedCredentialTagsHtml(rp)}
                  </div>
                </div>
              ` : ''}

              <!-- VC formats -->
              ${rp.vcFormat && rp.vcFormat.length > 0 ? `
                <div class="fides-modal-grid-item">
                  <div class="fides-modal-grid-label">
                    ${icons.fileCheck} VC formats
                  </div>
                  <div class="fides-modal-grid-value">
                    ${sortCredentialFormats(rp.vcFormat).map(f => `<span class="fides-tag">${escapeHtml(credentialFormatDisplayLabel(f))}</span>`).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Presentation Protocols -->
              ${rp.presentationProtocols && rp.presentationProtocols.length > 0 ? `
                <div class="fides-modal-grid-item">
                  <div class="fides-modal-grid-label">
                    ${icons.shield} Presentation Protocols
                  </div>
                  <div class="fides-modal-grid-value">
                    ${rp.presentationProtocols.map(p => `<span class="fides-tag">${escapeHtml(p)}</span>`).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Interop Profiles -->
              ${rp.interoperabilityProfiles && rp.interoperabilityProfiles.length > 0 ? `
                <div class="fides-modal-grid-item">
                  <div class="fides-modal-grid-label">
                    ${icons.shield} Interop Profiles
                  </div>
                  <div class="fides-modal-grid-value">
                    ${rp.interoperabilityProfiles.map(p => `<span class="fides-tag interop">${escapeHtml(p)}</span>`).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Supported Wallets -->
              ${rp.supportedWallets && rp.supportedWallets.length > 0 ? `
                <div class="fides-modal-grid-item">
                  <div class="fides-modal-grid-label">
                    ${icons.wallet} Supported Wallets
                  </div>
                  <div class="fides-modal-grid-value">
                    ${rp.supportedWallets.map(w => {
                      // Handle both string and object format
                      const name = typeof w === 'string' ? w : w.name;
                      const walletId = typeof w === 'object' ? w.walletCatalogId : null;
                      
                      if (walletId) {
                        // Render as clickable link to wallet catalog
                        const walletUrl = WALLET_CATALOG_URL + '/?wallet=' + encodeURIComponent(walletId);
                        return '<a href="' + walletUrl + '" target="_blank" rel="noopener" class="fides-tag wallet-link">' + escapeHtml(name) + ' ' + icons.externalLinkSmall + '</a>';
                      } else {
                        // Render as plain tag
                        return '<span class="fides-tag">' + escapeHtml(name) + '</span>';
                      }
                    }).join('')}
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Use Cases -->
            ${(() => {
              const derivedUseCases = getDerivedUseCasesForRp(rp);
              return derivedUseCases.length > 0 ? `
              <div class="fides-modal-features">
                <h4 class="fides-modal-section-title">Use Cases</h4>
                <ul class="fides-features-list">
                  ${derivedUseCases.map(u => `
                    <li>${icons.check} ${escapeHtml(u.title || u.id)}</li>
                  `).join('')}
                </ul>
              </div>
            ` : '';
            })()}

            <!-- Links -->
            <div class="fides-modal-links">
              ${rp.documentation ? `
                <a href="${escapeHtml(rp.documentation)}" target="_blank" rel="noopener" class="fides-modal-link" data-matomo-name="Documentation">
                  ${icons.book} Documentation
                </a>
              ` : ''}
              ${rp.testCredentials ? `
                <a href="${escapeHtml(rp.testCredentials)}" target="_blank" rel="noopener" class="fides-modal-link" data-matomo-name="Test credentials">
                  ${icons.fileCheck} Test Credentials
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.body.style.overflow = 'hidden';
    attachModalListeners();
  }

  /**
   * Show toast notification
   */
  function showToast(message, type = 'success') {
    // Get theme from container
    const containerTheme = container ? container.getAttribute('data-theme') : 'dark';
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'fides-toast';
    toast.setAttribute('data-theme', containerTheme);
    
    // Add icon
    const iconEl = document.createElement('div');
    iconEl.className = 'fides-toast-icon';
    iconEl.innerHTML = type === 'success' ? icons.check : icons.x;
    
    // Add message
    const messageEl = document.createElement('div');
    messageEl.className = 'fides-toast-message';
    messageEl.textContent = message;
    
    toast.appendChild(iconEl);
    toast.appendChild(messageEl);
    
    // Add to body
    document.body.appendChild(toast);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('fides-toast-out');
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  /**
   * Get the direct link URL for the currently selected RP (opens in modal when visited)
   */
  function getRPDirectLink() {
    if (!selectedRP) return '';
    const url = new URL(window.location.href);
    url.searchParams.set('rp', selectedRP.id);
    return url.toString();
  }

  /**
   * Copy RP direct link to clipboard and show feedback
   */
  function copyRPLink() {
    const url = getRPDirectLink();
    if (!url) return;
    const btn = document.getElementById('fides-modal-copy-link');
    const originalTitle = btn ? btn.getAttribute('title') : '';
    const originalAriaLabel = btn ? btn.getAttribute('aria-label') : '';
    
    const showSuccess = () => {
      if (btn) {
        btn.setAttribute('title', 'Link copied!');
        btn.setAttribute('aria-label', 'Link copied!');
        btn.classList.add('copied');
      }
      showToast('Link copied to clipboard', 'success');
      setTimeout(() => {
        if (btn) {
          btn.setAttribute('title', originalTitle);
          btn.setAttribute('aria-label', originalAriaLabel);
          btn.classList.remove('copied');
        }
      }, 2000);
    };
    
    const showError = () => {
      if (btn) {
        btn.setAttribute('title', 'Copy failed');
        setTimeout(() => {
          if (btn) {
            btn.setAttribute('title', originalTitle);
            btn.setAttribute('aria-label', originalAriaLabel);
          }
        }, 2000);
      }
      showToast('Failed to copy link', 'error');
    };
    
    // Try modern clipboard API first (requires HTTPS or localhost)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(showSuccess).catch(showError);
    } else {
      // Fallback for HTTP or older browsers
      try {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.top = '0';
        textarea.style.left = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (success) {
          showSuccess();
        } else {
          showError();
        }
      } catch (err) {
        showError();
      }
    }
  }

  /**
   * Close the modal
   */
  function closeModal() {
    const overlay = document.getElementById('fides-modal-overlay');
    if (overlay) {
      overlay.classList.add('closing');
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
        selectedRP = null;
      }, 200);
    }
  }

  /**
   * Attach modal event listeners
   */
  function attachModalListeners() {
    const overlay = document.getElementById('fides-modal-overlay');
    const closeBtn = document.getElementById('fides-modal-close');
    const copyLinkBtn = document.getElementById('fides-modal-copy-link');
    const modal = overlay.querySelector('.fides-modal');

    // Copy link button
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyRPLink();
      });
    }

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeModal();
        }
      });
    }

    document.addEventListener('keydown', function escapeHandler(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escapeHandler);
      }
    });

    if (modal) {
      modal.focus();
    }
  }

  /**
   * Open RP detail modal
   */
  function openRPDetail(rpId) {
    const rp = relyingParties.find(r => r.id === rpId);
    if (rp) {
      if (window.FidesCatalogUI && typeof window.FidesCatalogUI.openRpModal === 'function') {
        window.FidesCatalogUI.openRpModal(rp, {
          theme: container ? (container.getAttribute('data-theme') || 'dark') : 'dark',
          vocabulary: vocabulary,
          walletCatalogUrl: WALLET_CATALOG_URL,
          bluePagesUrl: BLUE_PAGES_URL,
          credentialCatalogUrl: CREDENTIAL_CATALOG_PAGE_URL,
          organizationCatalogUrl: ORGANIZATION_CATALOG_PAGE_URL,
          useCaseCatalogUrl: USE_CASE_CATALOG_PAGE_URL,
          ecosystemExplorerUrl: ECOSYSTEM_EXPLORER_URL,
          ecosystemIssuers: getEcosystemIssuersForRp(rp),
          derivedUseCases: getDerivedUseCasesForRp(rp),
          credentialById: credentialById,
          walletById: walletById,
          ratingsApiBase: RATINGS_API_BASE,
          ratingsNonce: RATINGS_NONCE,
          ratingsIsLoggedIn: RATINGS_IS_LOGGED_IN,
          ratingsLoginUrl: RATINGS_LOGIN_URL,
          updateFormUrl: UPDATE_FORM_URL,
          editAccess: EDIT_ACCESS,
          tierUiEnabled: TIER_UI_ENABLED,
          onOpen: function(openedRP) {
            (window.FidesCatalogUI && window.FidesCatalogUI.trackMatomoEvent) && window.FidesCatalogUI.trackMatomoEvent('RP Catalog', 'Modal Open', openedRP.name);
          },
          onRatingUpdate: function(updated) {
            if (!updated || updated.itemId !== rp.id) return;
            setRPRatingSummary(rp.id, {
              avg: updated.avg,
              count: updated.count,
              my_rating: updated.myRating
            });
            if (sortBy === 'rating') renderRPGridOnly();
            else updateRPLikeInPlace(rp.id);
          }
        });
        return;
      }
      selectedRP = rp;
      
      // Track modal open in Matomo
      (window.FidesCatalogUI && window.FidesCatalogUI.trackMatomoEvent) && window.FidesCatalogUI.trackMatomoEvent('RP Catalog', 'Modal Open', rp.name);
      
      renderModal(rp);
    }
  }

  /**
   * Attach event listeners
   */
  function attachEventListeners() {
    // Search input
    const searchInput = document.getElementById('fides-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        filters.search = e.target.value;
        // Use grid-only render to avoid losing focus/keyboard on mobile
        renderRPGridOnly();
      }, 300));
    }

    // Search clear button
    const searchClear = document.getElementById('fides-search-clear');
    if (searchClear) {
      searchClear.addEventListener('click', () => {
        filters.search = '';
        // Clear input
        const input = document.getElementById('fides-search-input');
        if (input) input.value = '';
        // Use grid-only render
        renderRPGridOnly();
      });
    }

    container.querySelectorAll('.fides-view-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const newView = btn.getAttribute('data-view') || 'grid';
        if (newView !== 'grid' && newView !== 'list') return;
        viewMode = newView;
        _lastEffective = effectiveView();
        try {
          window.localStorage.setItem(VIEW_PREFERENCE_STORAGE_KEY, viewMode);
        } catch (err) { /* ignore */ }
        container.querySelectorAll('.fides-view-btn').forEach((b) => {
          const active = b.getAttribute('data-view') === viewMode;
          b.classList.toggle('active', active);
          b.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        renderRPGridOnly();
      });
    });

    // Mobile filter toggle
    const mobileFilterToggle = document.getElementById('fides-mobile-filter-toggle');
    if (mobileFilterToggle) {
      mobileFilterToggle.addEventListener('click', () => {
        const sidebar = container.querySelector('.fides-sidebar');
        if (sidebar) {
          sidebar.classList.add('mobile-open');
          document.body.style.overflow = 'hidden';
        }
      });
    }

    // Sidebar close button
    const sidebarClose = document.getElementById('fides-sidebar-close');
    if (sidebarClose) {
      sidebarClose.addEventListener('click', () => {
        const sidebar = container.querySelector('.fides-sidebar');
        if (sidebar) {
          sidebar.classList.remove('mobile-open');
          document.body.style.overflow = '';
        }
      });
    }

    // Close sidebar when clicking overlay (mobile)
    const sidebar = container.querySelector('.fides-sidebar');
    if (sidebar) {
      sidebar.addEventListener('click', (e) => {
        if (e.target === sidebar && sidebar.classList.contains('mobile-open')) {
          sidebar.classList.remove('mobile-open');
          document.body.style.overflow = '';
        }
      });
    }

    // Collapsible filter toggles
    container.querySelectorAll('.fides-filter-label-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        if (e.target.closest('.fides-vocab-info')) return;
        const filterGroup = toggle.closest('.fides-filter-group');
        if (filterGroup) {
          filterGroup.classList.toggle('collapsed');
          const isCollapsed = filterGroup.classList.contains('collapsed');
          toggle.setAttribute('aria-expanded', !isCollapsed);
          filterGroupState[filterGroup.dataset.filterGroup] = !isCollapsed;
        }
      });
    });

    initVocabularyInfo(container);

    // Filter checkboxes
    const quickFilterKeys = ['addedLast30Days', 'includesVideo', 'officialOnly'];
    container.querySelectorAll('.fides-filter-checkbox input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const filterType = checkbox.dataset.filter;
        const value = checkbox.dataset.value;
        if (filterType === 'linkedRPs') {
          filters.ids = checkbox.checked ? [...originalIds] : [];
        } else if (quickFilterKeys.includes(filterType)) {
          filters[filterType] = checkbox.checked;
        } else {
          if (checkbox.checked) {
            if (!filters[filterType].includes(value)) {
              filters[filterType].push(value);
            }
          } else {
            filters[filterType] = filters[filterType].filter(v => v !== value);
          }
        }
        render();
      });
    });

    // Sort select
    const sortSelect = document.getElementById('fides-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        try {
          window.localStorage.setItem(SORT_PREFERENCE_STORAGE_KEY, sortBy);
        } catch (err) { /* ignore */ }
        render();
      });
    }

    // Clear filters
    const clearBtn = document.getElementById('fides-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        filters = {
          search: filters.search,
          type: settings.type ? [settings.type] : [],
          sectors: settings.sector ? [settings.sector] : [],
          credentialEcosystems: [],
          credentialThemes: [],
          country: [],
          vcFormat: [],
          presentationProtocols: [],
          interoperabilityProfiles: [],
          interactionMode: [],
          supportedWallets: [],
          addedLast30Days: false,
          includesVideo: false,
          officialOnly: false,
          ids: []
        };
        originalIds = [];
        const url = new URL(window.location.href);
        url.searchParams.delete('rps');
        url.searchParams.delete('sector');
        url.searchParams.delete('country');
        url.searchParams.delete('theme');
        history.replaceState(null, '', url.toString());
        render();
      });
    }

    // RP card click - open detail modal
    container.querySelectorAll('.fides-rp-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        const rpId = card.dataset.rpId;
        openRPDetail(rpId);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const rpId = card.dataset.rpId;
          openRPDetail(rpId);
        }
      });
    });
  }

  /**
   * Initialize [i] vocabulary info buttons on filter groups
   */
  function initVocabularyInfo(containerEl) {
    if (!vocabulary) return;
    hideVocabularyPopup();
    containerEl.querySelectorAll('.fides-vocab-info').forEach(btn => btn.remove());
    containerEl.querySelectorAll('.fides-filter-group').forEach(groupEl => {
      const toggle = groupEl.querySelector('.fides-filter-label-toggle');
      const labelSpan = toggle && toggle.querySelector('.fides-filter-label');
      if (!toggle || !labelSpan) return;
      const filterGroup = groupEl.dataset.filterGroup;
      const vocabKey = RP_FILTER_TO_VOCAB[filterGroup] || filterGroup;
      if (RP_VOCAB_NO_INFO.has(vocabKey)) return;
      const infoBtn = document.createElement('button');
      infoBtn.type = 'button';
      infoBtn.className = 'fides-vocab-info';
      infoBtn.dataset.group = vocabKey;
      infoBtn.setAttribute('aria-label', 'Explain filter');
      infoBtn.textContent = 'i';
      infoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showVocabularyPopup(e.currentTarget, groupEl, vocabKey);
      });
      const parent = labelSpan.parentNode;
      if (parent.classList && parent.classList.contains('fides-filter-label-with-info')) {
        parent.appendChild(infoBtn);
        return;
      }
      const wrapper = document.createElement('div');
      wrapper.className = 'fides-filter-label-with-info';
      parent.insertBefore(wrapper, labelSpan);
      wrapper.appendChild(labelSpan);
      wrapper.appendChild(infoBtn);
      const spacer = document.createElement('span');
      spacer.className = 'fides-filter-toggle-spacer';
      spacer.setAttribute('aria-hidden', 'true');
      parent.insertBefore(spacer, wrapper.nextSibling);
    });
  }

  /** Label text for a filter row, without the facet count span. */
  function filterCheckboxLabelTextWithoutCount(label) {
    const span = label.querySelector('span');
    if (!span) return label.textContent.trim();
    const clone = span.cloneNode(true);
    clone.querySelectorAll('.fides-filter-option-count').forEach((el) => el.remove());
    return clone.textContent.trim();
  }

  function showVocabularyPopup(button, groupEl, vocabKey) {
    hideVocabularyPopup();
    const groupTerm = vocabulary[vocabKey];
    const categoryName = (groupEl.querySelector('.fides-filter-label') && groupEl.querySelector('.fides-filter-label').textContent) ? groupEl.querySelector('.fides-filter-label').textContent.trim() : '';
    let html = '';
    if (categoryName) {
      html += '<p class="fides-vocab-popup-title"><strong>' + escapeHtml(categoryName) + '</strong></p>';
    }
    if (groupTerm && groupTerm.description) {
      html += '<p class="fides-vocab-popup-intro">' + escapeHtml(groupTerm.description) + '</p>';
    }
    const optionsEl = groupEl.querySelector('.fides-filter-options');
    if (optionsEl) {
      const labels = optionsEl.querySelectorAll('label.fides-filter-checkbox');
      if (labels.length > 0) {
        const listItems = [];
        labels.forEach(label => {
          const input = label.querySelector('input[data-value]');
          const value = input ? input.dataset.value : '';
          const labelText = filterCheckboxLabelTextWithoutCount(label);
          const term = value ? vocabulary[value] : null;
          const desc = term && term.description ? escapeHtml(term.description) : '';
          listItems.push({ labelText, desc });
        });
        const hasAnyOptionDesc = listItems.some(item => item.desc);
        if (hasAnyOptionDesc) {
          html += '<ul class="fides-vocab-popup-list">';
          listItems.forEach(item => {
            html += '<li><strong>' + escapeHtml(item.labelText) + '</strong>' + (item.desc ? ': ' + item.desc : '') + '</li>';
          });
          html += '</ul>';
        }
      }
    }
    if (!html) html = '<p>No description available.</p>';

    const popup = document.createElement('div');
    popup.className = 'fides-vocab-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-label', 'Filter explanation');
    popup.innerHTML = html;

    // Create overlay backdrop
    const overlay = document.createElement('div');
    overlay.className = 'fides-vocab-overlay';
    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    // Position popup: more to the right (over first column), vertically centered; clamp to viewport
    const margin = 20;
    const rect = button.getBoundingClientRect();
    const w = window.innerWidth;
    const h = window.innerHeight;
    const pw = popup.offsetWidth;
    const ph = popup.offsetHeight;
    const popupLeft = Math.min(rect.right + 40, w - pw - margin);
    const left = Math.max(margin, Math.min(popupLeft, w - pw - margin));
    const top = Math.max(margin, Math.min((h - ph) / 2, h - ph - margin));
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    
    setTimeout(() => {
      overlay.classList.add('visible');
      popup.classList.add('visible');
    }, 10);

    const close = (e) => {
      if (e && e.target.closest('.fides-vocab-popup')) return; // Don't close if clicking inside popup
      hideVocabularyPopup();
      document.removeEventListener('click', close, true);
      document.removeEventListener('keydown', onKeydown);
    };
    function onKeydown(e) {
      if (e.key === 'Escape') close();
    }
    document.addEventListener('keydown', onKeydown);
    // Use capture phase to intercept clicks before they reach links
    setTimeout(() => document.addEventListener('click', close, true), 0);
  }

  function hideVocabularyPopup() {
    const overlay = document.querySelector('.fides-vocab-overlay');
    const popup = document.querySelector('.fides-vocab-popup');
    if (overlay) overlay.remove();
    if (popup) popup.remove();
  }

  /**
   * Utility: Escape HTML
   */
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * ============================================================================
   * VIDEO HELPER FUNCTIONS
   * ============================================================================
   * 
   * IMPORTANT - CODE DUPLICATION WARNING:
   * These functions are duplicated between:
   * - wordpress-plugin/fides-rp-catalog/assets/rp-catalog.js
   * - wordpress-plugin/fides-wallet-catalog/assets/wallet-catalog.js
   * 
   * When making changes (adding providers, fixing bugs), UPDATE BOTH FILES!
   * ============================================================================
   */

  /**
   * Video provider configuration
   * Add new providers here - automatically supported in all functions
   */
  const VIDEO_PROVIDERS = [
    {
      name: 'youtube',
      patterns: [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?\/]+)/,
        /youtube\.com\/embed\/([^&\?\/]+)/,
        /youtube\.com\/shorts\/([^&\?\/]+)/
      ],
      embedUrl: (videoId) => `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`,
      privacy: 'Uses youtube-nocookie.com for GDPR compliance'
    },
    {
      name: 'vimeo',
      patterns: [
        /vimeo\.com\/(\d+)/,
        /player\.vimeo\.com\/video\/(\d+)/
      ],
      embedUrl: (videoId) => `https://player.vimeo.com/video/${videoId}`,
      privacy: 'Privacy-friendly by default'
    }
    // To add Loom support in the future, uncomment:
    // {
    //   name: 'loom',
    //   patterns: [/loom\.com\/share\/([a-f0-9]+)/],
    //   embedUrl: (videoId) => `https://www.loom.com/embed/${videoId}`,
    //   privacy: 'Reasonably privacy-friendly'
    // }
  ];

  /**
   * Detect video provider from URL
   * @param {string} url - Video URL
   * @returns {string|null} - Provider name or null if not recognized
   */
  function detectVideoProvider(url) {
    if (!url) return null;
    
    for (const provider of VIDEO_PROVIDERS) {
      for (const pattern of provider.patterns) {
        if (url.match(pattern)) {
          return provider.name;
        }
      }
    }
    
    return null;
  }

  /**
   * Convert video URL to embed URL
   * @param {string} videoUrl - Original video URL
   * @returns {string|null} - Embed URL or null if provider not supported
   */
  function getVideoEmbedUrl(videoUrl) {
    if (!videoUrl) return null;
    
    // Try each provider
    for (const provider of VIDEO_PROVIDERS) {
      for (const pattern of provider.patterns) {
        const match = videoUrl.match(pattern);
        if (match && match[1]) {
          return provider.embedUrl(match[1]);
        }
      }
    }
    
    return null;
  }

  /**
   * Generate video embed HTML
   * @param {string} videoUrl - Original video URL
   * @returns {string} - HTML for embedded video or fallback button
   */
  function getVideoEmbedHtml(videoUrl) {
    const embedUrl = getVideoEmbedUrl(videoUrl);
    
    if (embedUrl) {
      return `
        <div class="fides-video-container">
          <iframe 
            src="${embedUrl}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            class="fides-video-iframe"
            title="Video player">
          </iframe>
        </div>
      `;
    }
    
    // Fallback: external link button if provider not supported
    return `
      <div class="fides-video-fallback">
        <a href="${escapeHtml(videoUrl)}" target="_blank" rel="noopener" class="fides-modal-link primary" data-matomo-name="Video">
          ${icons.play} Watch Video (External)
        </a>
      </div>
    `;
  }

  /**
   * Generate Blue Pages URL for provider DID
   */
  function getCredentialRefCatalogId(ref) {
    if (!ref || typeof ref !== 'object') return null;
    const id = ref.credentialCatalogId != null ? ref.credentialCatalogId : ref.id;
    return typeof id === 'string' && id.indexOf('cred:') === 0 ? id : null;
  }

  /**
   * Pair acceptedCredentials labels with acceptedCredentialRefs by index (same as aggregated data).
   */
  function getAcceptedCredentialRows(rp) {
    const labels = Array.isArray(rp.acceptedCredentials) ? rp.acceptedCredentials : [];
    const refs = Array.isArray(rp.acceptedCredentialRefs) ? rp.acceptedCredentialRefs : [];
    const n = Math.max(labels.length, refs.length);
    const rows = [];
    for (let i = 0; i < n; i++) {
      const credentialId = getCredentialRefCatalogId(refs[i]);
      const raw = typeof labels[i] === 'string' ? labels[i].trim() : '';
      let label = raw;
      if (!label && credentialId) {
        const segs = credentialId.split(':');
        const tail = segs.length ? segs[segs.length - 1] : credentialId;
        label = tail.replace(/-/g, ' ');
      }
      if (!label) continue;
      rows.push({ label, credentialId });
    }
    return rows;
  }

  function getCredentialCatalogDeepLink(credentialId) {
    if (!credentialId || typeof credentialId !== 'string' || credentialId.indexOf('cred:') !== 0) {
      return null;
    }
    const base = (CREDENTIAL_CATALOG_PAGE_URL || '').trim();
    if (!base) return null;
    try {
      const u = new URL(base);
      u.searchParams.set('credential', credentialId);
      return u.toString();
    } catch (e) {
      return null;
    }
  }

  /**
   * @param {object} rp - Relying party
   * @param {number} [maxCount] - Max tags; remainder shown as +N
   * @param {boolean} [stopPropagationOnClick] - For card tiles: avoid opening modal when following link
   */
  function renderAcceptedCredentialTagsHtml(rp, maxCount, stopPropagationOnClick) {
    const rows = getAcceptedCredentialRows(rp);
    if (rows.length === 0) return '';
    const limit = typeof maxCount === 'number' ? maxCount : rows.length;
    const slice = rows.slice(0, limit);
    const linkIcon = stopPropagationOnClick ? icons.externalLinkSmall : icons.externalLink;
    const parts = slice.map((row) => {
      const href = row.credentialId ? getCredentialCatalogDeepLink(row.credentialId) : null;
      const safe = escapeHtml(row.label);
      if (href) {
        const stop = stopPropagationOnClick ? ' onclick="event.stopPropagation();"' : '';
        return `<a href="${escapeHtml(href)}" class="fides-tag accepted-credential credential-catalog-link"${stop}>${linkIcon} ${safe}</a>`;
      }
      return `<span class="fides-tag accepted-credential">${safe}</span>`;
    });
    let html = parts.join('');
    if (rows.length > limit) {
      html += `<span class="fides-tag">+${rows.length - limit}</span>`;
    }
    return html;
  }

  function getBluePagesUrl(did) {
    if (!did) return null;
    const encodedDid = encodeURIComponent(did);
    return `${BLUE_PAGES_URL}/${encodedDid}/`;
  }

  function getOrganizationCatalogDeepLinkHref(orgId, catalogBase) {
    const id = String(orgId || '').trim();
    if (!id || id.indexOf('org:') !== 0) return null;
    const base = (catalogBase || '').trim();
    if (!base) return null;
    try {
      const u = new URL(base);
      u.searchParams.set('org', id);
      return u.toString();
    } catch (e) {
      return null;
    }
  }

  /**
   * Utility: Debounce
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

