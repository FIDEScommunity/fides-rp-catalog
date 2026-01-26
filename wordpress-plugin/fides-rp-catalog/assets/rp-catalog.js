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
    play: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
  };
  
  // Wallet catalog base URL for deep links (configurable via WordPress settings)
  const WALLET_CATALOG_URL = (window.fidesRPCatalog && window.fidesRPCatalog.walletCatalogUrl) 
    || 'https://wallets.fides.community';

  // Blue Pages base URL for DID lookups (configurable via WordPress settings)
  const BLUE_PAGES_URL = (window.fidesRPCatalog && window.fidesRPCatalog.bluePagesUrl)
    || 'https://fides.community/community-tools/blue-pages';

  // Selected RP for modal
  let selectedRP = null;

  // Configuration
  const config = window.fidesRPCatalog || {
    pluginUrl: '',
    githubDataUrl: 'https://raw.githubusercontent.com/FIDEScommunity/fides-rp-catalog/main/data/aggregated.json'
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

  // State
  let relyingParties = [];
  let filters = {
    search: '',
    type: [],
    sectors: [],
    country: [],
    credentialFormats: [],
    presentationProtocols: [],
    interoperabilityProfiles: [],
    supportedWallets: []
  };

  // Track which filter groups are expanded (true = expanded, false = collapsed)
  const filterGroupState = {
    type: true,
    sectors: false,
    supportedWallets: true,
    country: false,
    credentialFormats: false,
    presentationProtocols: false,
    interoperabilityProfiles: false
  };

  // Chevron icon for collapsible filters
  const chevronDown = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>';

  // DOM Elements
  let container;
  let settings;

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
      filters.sectors = [settings.sector];
    }

    // Load data
    loadRelyingParties();
  }

  /**
   * Load relying parties from multiple sources
   */
  async function loadRelyingParties() {
    const sources = [
      { name: 'GitHub', url: config.githubDataUrl, transform: (d) => d.relyingParties || [] },
      { name: 'Local', url: `${config.pluginUrl}data/aggregated.json`, transform: (d) => d.relyingParties || [] }
    ];

    for (const source of sources) {
      if (!source.url) continue;
      
      try {
        const response = await fetch(source.url);
        if (response.ok) {
          const data = await response.json();
          relyingParties = source.transform(data);
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

    render();
  }

  /**
   * Filter and sort relying parties based on current filters
   */
  function getFilteredAndSortedRPs() {
    let filtered = relyingParties.filter(rp => {
      // Search
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matches = 
          rp.name.toLowerCase().includes(search) ||
          (rp.description || '').toLowerCase().includes(search) ||
          rp.provider.name.toLowerCase().includes(search);
        if (!matches) return false;
      }

      // Readiness
      if (filters.type.length > 0) {
        if (!filters.type.includes(rp.readiness)) return false;
      }

      // Sectors
      if (filters.sectors.length > 0) {
        const hasMatch = filters.sectors.some(s => (rp.sectors || []).includes(s));
        if (!hasMatch) return false;
      }

      // Country
      if (filters.country.length > 0) {
        if (!filters.country.includes(rp.country)) return false;
      }

      // Credential formats
      if (filters.credentialFormats.length > 0) {
        const hasMatch = filters.credentialFormats.some(f => (rp.credentialFormats || []).includes(f));
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

      return true;
    });

    // Sort: Featured first (alphabetically), then regular (alphabetically)
    filtered.sort((a, b) => {
      // Featured items come first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      
      // Within same group (featured or regular), sort by provider name first
      const providerCompare = a.provider.name.localeCompare(b.provider.name);
      if (providerCompare !== 0) return providerCompare;
      
      // Within same provider, sort by RP name
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }

  /**
   * Count active filters
   */
  function getActiveFilterCount() {
    let count = 0;
    if (!settings.type) count += filters.type.length;
    if (!settings.sector) count += filters.sectors.length;
    count += filters.country.length;
    count += filters.credentialFormats.length;
    count += filters.presentationProtocols.length;
    count += filters.interoperabilityProfiles.length;
    count += filters.supportedWallets.length;
    return count;
  }

  /**
   * Get unique countries from loaded RPs
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

  /**
   * Render the catalog
   */
  function render() {
    const filtered = getFilteredAndSortedRPs();
    const activeFilterCount = getActiveFilterCount();
    
    // Save focus state
    const searchInput = document.getElementById('fides-search');
    const wasSearchFocused = searchInput && document.activeElement === searchInput;
    const cursorPosition = wasSearchFocused ? searchInput.selectionStart : 0;
    
    let html = '';

    // Mobile filter toggle button
    html += `
      <button class="fides-mobile-filter-toggle" id="fides-mobile-filter-toggle">
        ${icons.filter}
        <span>Filters</span>
        <span class="fides-filter-count ${activeFilterCount > 0 ? '' : 'hidden'}">${activeFilterCount || 0}</span>
      </button>
    `;

    // Main layout with sidebar
    html += `<div class="fides-main-layout">`;

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
            ${settings.showSearch ? `
              <div class="fides-sidebar-search">
                <div class="fides-search-wrapper">
                  <span class="fides-search-icon">${icons.search}</span>
                  <input 
                    type="text" 
                    class="fides-search-input" 
                    placeholder="Search..."
                    value="${escapeHtml(filters.search)}"
                    id="fides-search"
                  >
                  <button class="fides-search-clear ${filters.search ? '' : 'hidden'}" id="fides-search-clear" type="button">
                    ${icons.xSmall}
                  </button>
                </div>
              </div>
            ` : ''}
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
                    <span>Technical Demo</span>
                  </label>
                  <label class="fides-filter-checkbox">
                    <input type="checkbox" data-filter="type" data-value="use-case-demo" ${filters.type.includes('use-case-demo') ? 'checked' : ''}>
                    <span>Use Case Demo</span>
                  </label>
                  <label class="fides-filter-checkbox">
                    <input type="checkbox" data-filter="type" data-value="production-pilot" ${filters.type.includes('production-pilot') ? 'checked' : ''}>
                    <span>Production Pilot</span>
                  </label>
                  <label class="fides-filter-checkbox">
                    <input type="checkbox" data-filter="type" data-value="production" ${filters.type.includes('production') ? 'checked' : ''}>
                    <span>Production</span>
                  </label>
                </div>
              </div>
            ` : ''}
            ${getAvailableSupportedWallets().length > 0 ? `
              <div class="fides-filter-group collapsible ${!filterGroupState.supportedWallets ? 'collapsed' : ''} ${filters.supportedWallets.length > 0 ? 'has-active' : ''}" data-filter-group="supportedWallets">
                <button class="fides-filter-label-toggle" type="button" aria-expanded="${filterGroupState.supportedWallets}">
                  <span class="fides-filter-label">Supported Wallet</span>
                  <span class="fides-filter-active-indicator"></span>
                  ${chevronDown}
                </button>
                <div class="fides-filter-options">
                  ${getAvailableSupportedWallets().map(wallet => `
                    <label class="fides-filter-checkbox">
                      <input type="checkbox" data-filter="supportedWallets" data-value="${wallet.id}" ${filters.supportedWallets.includes(wallet.id) ? 'checked' : ''}>
                      <span>${escapeHtml(wallet.name)}</span>
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
                  <label class="fides-filter-checkbox">
                    <input type="checkbox" data-filter="sectors" data-value="government" ${filters.sectors.includes('government') ? 'checked' : ''}>
                    <span>Government</span>
                  </label>
                  <label class="fides-filter-checkbox">
                    <input type="checkbox" data-filter="sectors" data-value="finance" ${filters.sectors.includes('finance') ? 'checked' : ''}>
                    <span>Finance</span>
                  </label>
                  <label class="fides-filter-checkbox">
                    <input type="checkbox" data-filter="sectors" data-value="healthcare" ${filters.sectors.includes('healthcare') ? 'checked' : ''}>
                    <span>Healthcare</span>
                  </label>
                  <label class="fides-filter-checkbox">
                    <input type="checkbox" data-filter="sectors" data-value="education" ${filters.sectors.includes('education') ? 'checked' : ''}>
                    <span>Education</span>
                  </label>
                  <label class="fides-filter-checkbox">
                    <input type="checkbox" data-filter="sectors" data-value="retail" ${filters.sectors.includes('retail') ? 'checked' : ''}>
                    <span>Retail</span>
                  </label>
                </div>
              </div>
            ` : ''}
            ${getAvailableCountries().length > 0 ? `
              <div class="fides-filter-group collapsible ${!filterGroupState.country ? 'collapsed' : ''} ${filters.country.length > 0 ? 'has-active' : ''}" data-filter-group="country">
                <button class="fides-filter-label-toggle" type="button" aria-expanded="${filterGroupState.country}">
                  <span class="fides-filter-label">Country</span>
                  <span class="fides-filter-active-indicator"></span>
                  ${chevronDown}
                </button>
                <div class="fides-filter-options">
                  ${getAvailableCountries().map(code => `
                    <label class="fides-filter-checkbox">
                      <input type="checkbox" data-filter="country" data-value="${code}" ${filters.country.includes(code) ? 'checked' : ''}>
                      <span><img src="https://flagcdn.com/w20/${code.toLowerCase()}.png" alt="" class="fides-country-flag"> ${countryNames[code] || code}</span>
                    </label>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            <div class="fides-filter-group collapsible ${!filterGroupState.credentialFormats ? 'collapsed' : ''} ${filters.credentialFormats.length > 0 ? 'has-active' : ''}" data-filter-group="credentialFormats">
              <button class="fides-filter-label-toggle" type="button" aria-expanded="${filterGroupState.credentialFormats}">
                <span class="fides-filter-label">Credential Format</span>
                <span class="fides-filter-active-indicator"></span>
                ${chevronDown}
              </button>
              <div class="fides-filter-options">
                <label class="fides-filter-checkbox">
                  <input type="checkbox" data-filter="credentialFormats" data-value="SD-JWT-VC" ${filters.credentialFormats.includes('SD-JWT-VC') ? 'checked' : ''}>
                  <span>SD-JWT-VC</span>
                </label>
                <label class="fides-filter-checkbox">
                  <input type="checkbox" data-filter="credentialFormats" data-value="JWT-VC" ${filters.credentialFormats.includes('JWT-VC') ? 'checked' : ''}>
                  <span>JWT-VC</span>
                </label>
                <label class="fides-filter-checkbox">
                  <input type="checkbox" data-filter="credentialFormats" data-value="JSON-LD VC" ${filters.credentialFormats.includes('JSON-LD VC') ? 'checked' : ''}>
                  <span>JSON-LD VC</span>
                </label>
                <label class="fides-filter-checkbox">
                  <input type="checkbox" data-filter="credentialFormats" data-value="AnonCreds" ${filters.credentialFormats.includes('AnonCreds') ? 'checked' : ''}>
                  <span>AnonCreds</span>
                </label>
                <label class="fides-filter-checkbox">
                  <input type="checkbox" data-filter="credentialFormats" data-value="Idemix" ${filters.credentialFormats.includes('Idemix') ? 'checked' : ''}>
                  <span>Idemix</span>
                </label>
                <label class="fides-filter-checkbox">
                  <input type="checkbox" data-filter="credentialFormats" data-value="mDL/mDoc" ${filters.credentialFormats.includes('mDL/mDoc') ? 'checked' : ''}>
                  <span>mDL/mDoc</span>
                </label>
                <label class="fides-filter-checkbox">
                  <input type="checkbox" data-filter="credentialFormats" data-value="X.509" ${filters.credentialFormats.includes('X.509') ? 'checked' : ''}>
                  <span>X.509</span>
                </label>
              </div>
            </div>
            ${getAvailablePresentationProtocols().length > 0 ? `
              <div class="fides-filter-group collapsible ${!filterGroupState.presentationProtocols ? 'collapsed' : ''} ${filters.presentationProtocols.length > 0 ? 'has-active' : ''}" data-filter-group="presentationProtocols">
                <button class="fides-filter-label-toggle" type="button" aria-expanded="${filterGroupState.presentationProtocols}">
                  <span class="fides-filter-label">Presentation Protocol</span>
                  <span class="fides-filter-active-indicator"></span>
                  ${chevronDown}
                </button>
                <div class="fides-filter-options">
                  ${getAvailablePresentationProtocols().map(protocol => `
                    <label class="fides-filter-checkbox">
                      <input type="checkbox" data-filter="presentationProtocols" data-value="${protocol}" ${filters.presentationProtocols.includes(protocol) ? 'checked' : ''}>
                      <span>${protocol === '...other' ? '<em>...other</em>' : escapeHtml(protocol)}</span>
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
                  <span>DIIP v4</span>
                </label>
                <label class="fides-filter-checkbox">
                  <input type="checkbox" data-filter="interoperabilityProfiles" data-value="DIIP v5" ${filters.interoperabilityProfiles.includes('DIIP v5') ? 'checked' : ''}>
                  <span>DIIP v5</span>
                </label>
                <label class="fides-filter-checkbox">
                  <input type="checkbox" data-filter="interoperabilityProfiles" data-value="EWC v3" ${filters.interoperabilityProfiles.includes('EWC v3') ? 'checked' : ''}>
                  <span>EWC v3</span>
                </label>
                <label class="fides-filter-checkbox">
                  <input type="checkbox" data-filter="interoperabilityProfiles" data-value="HAIP v1" ${filters.interoperabilityProfiles.includes('HAIP v1') ? 'checked' : ''}>
                  <span>HAIP v1</span>
                </label>
                <label class="fides-filter-checkbox">
                  <input type="checkbox" data-filter="interoperabilityProfiles" data-value="EUDI Wallet ARF" ${filters.interoperabilityProfiles.includes('EUDI Wallet ARF') ? 'checked' : ''}>
                  <span>EUDI Wallet ARF</span>
                </label>
              </div>
            </div>
          </div>
        </aside>
      `;
    }

    // Content area
    html += `<div class="fides-content">`;

    // Results count
    html += `
      <div class="fides-results-bar">
        <span class="fides-results-count">${filtered.length} relying party website${filtered.length !== 1 ? 's' : ''} found</span>
      </div>
    `;

    // RP grid
    if (filtered.length > 0) {
      html += `<div class="fides-rp-grid" data-columns="${settings.columns}">`;
      filtered.forEach(rp => {
        html += renderRPCard(rp);
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
      const newSearchInput = document.getElementById('fides-search');
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
    
    // Update results count
    const resultsCount = container.querySelector('.fides-results-count');
    if (resultsCount) {
      resultsCount.textContent = `${filtered.length} relying party website${filtered.length !== 1 ? 's' : ''} found`;
    }
    
    // Update search clear button visibility
    const searchClear = document.getElementById('fides-search-clear');
    if (searchClear) {
      searchClear.classList.toggle('hidden', !filters.search);
    }
    
    // Update RP grid
    const gridContainer = container.querySelector('.fides-rp-grid');
    const emptyContainer = container.querySelector('.fides-empty');
    const contentArea = container.querySelector('.fides-content');
    
    if (filtered.length > 0) {
      // Remove empty state if present
      if (emptyContainer) {
        emptyContainer.remove();
      }
      
      // Create or update grid
      let grid = gridContainer;
      if (!grid) {
        grid = document.createElement('div');
        grid.className = 'fides-rp-grid';
        grid.setAttribute('data-columns', settings.columns);
        // Insert after results bar
        const resultsBar = contentArea.querySelector('.fides-results-bar');
        if (resultsBar) {
          resultsBar.after(grid);
        } else {
          contentArea.appendChild(grid);
        }
      }
      
      // Render RP cards
      let html = '';
      filtered.forEach(rp => {
        html += renderRPCard(rp);
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

  /**
   * Render a single RP card
   */
  function renderRPCard(rp) {
    const readinessLabels = {
      'technical-demo': 'Technical Demo',
      'use-case-demo': 'Use Case Demo',
      'production-pilot': 'Production Pilot',
      'production': 'Production'
    };

    const sectorLabels = {
      government: 'Government',
      finance: 'Finance',
      healthcare: 'Healthcare',
      education: 'Education',
      retail: 'Retail',
      travel: 'Travel',
      hospitality: 'Hospitality',
      employment: 'Employment',
      telecom: 'Telecom',
      utilities: 'Utilities',
      insurance: 'Insurance',
      'real-estate': 'Real Estate',
      automotive: 'Automotive',
      entertainment: 'Entertainment',
      other: 'Other'
    };

    // Use country flag as fallback logo
    const logoUrl = rp.logo || (rp.country ? `https://flagcdn.com/w80/${rp.country.toLowerCase()}.png` : null);
    const featuredClass = rp.isFeatured ? 'fides-rp-card-featured' : '';

    return `
      <div class="fides-rp-card ${featuredClass}" data-rp-id="${rp.id}" role="button" tabindex="0">
        <div class="fides-rp-header readiness-${rp.readiness}">
          ${logoUrl 
            ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(rp.name)}" class="fides-rp-logo">`
            : `<div class="fides-rp-logo-placeholder">${icons.globe}</div>`
          }
          <div class="fides-rp-info">
            <h3 class="fides-rp-name">${escapeHtml(rp.name)}</h3>
            <p class="fides-rp-provider">${escapeHtml(rp.provider.name)}</p>
          </div>
          ${rp.isFeatured 
            ? '<span class="fides-featured-badge">⭐ Featured</span>' 
            : `<span class="fides-rp-readiness-badge ${rp.readiness}">${readinessLabels[rp.readiness]}</span>`
          }
        </div>
        <div class="fides-rp-body">
          ${rp.description ? `<p class="fides-rp-description">${escapeHtml(rp.description)}</p>` : ''}
          
          ${rp.supportedWallets && rp.supportedWallets.length > 0 ? `
            <div class="fides-rp-section">
              <h4 class="fides-rp-section-title">Supported Wallets</h4>
              <div class="fides-tags">
                ${rp.supportedWallets.slice(0, 3).map(w => {
                  // Handle both string and object format
                  const name = typeof w === 'string' ? w : w.name;
                  const walletId = typeof w === 'object' ? w.walletCatalogId : null;
                  
                  if (walletId && window.fidesRPCatalog && window.fidesRPCatalog.walletCatalogUrl) {
                    return `<a href="${window.fidesRPCatalog.walletCatalogUrl}/?wallet=${escapeHtml(walletId)}" target="_blank" rel="noopener" class="fides-tag wallet-link" onclick="event.stopPropagation();">${icons.externalLink} ${escapeHtml(name)}</a>`;
                  }
                  return `<span class="fides-tag">${escapeHtml(name)}</span>`;
                }).join('')}
                ${rp.supportedWallets.length > 3 ? `<span class="fides-tag">+${rp.supportedWallets.length - 3}</span>` : ''}
              </div>
            </div>
          ` : ''}
          
          ${rp.acceptedCredentials && rp.acceptedCredentials.length > 0 ? `
            <div class="fides-rp-section">
              <h4 class="fides-rp-section-title">Accepted Credentials</h4>
              <div class="fides-tags">
                ${rp.acceptedCredentials.slice(0, 4).map(c => `<span class="fides-tag">${escapeHtml(c)}</span>`).join('')}
                ${rp.acceptedCredentials.length > 4 ? `<span class="fides-tag">+${rp.acceptedCredentials.length - 4}</span>` : ''}
              </div>
            </div>
          ` : ''}
        </div>
        <div class="fides-rp-footer">
          <div class="fides-rp-links">
            ${rp.website ? `
              <a href="${escapeHtml(rp.website)}" target="_blank" rel="noopener" class="fides-rp-visit-button" onclick="event.stopPropagation();">
                ${icons.externalLink} Visit Website
              </a>
            ` : ''}
            ${rp.video ? `
              <a href="${escapeHtml(rp.video)}" target="_blank" rel="noopener" class="fides-rp-video-button" onclick="event.stopPropagation();">
                ${icons.play} Video
              </a>
            ` : ''}
          </div>
          <span class="fides-view-details">${icons.eye} View details</span>
        </div>
      </div>
    `;
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

    const statusLabels = {
      development: 'In Development',
      beta: 'Beta',
      live: 'Live',
      deprecated: 'Deprecated'
    };

    const currentTheme = container.getAttribute('data-theme') || 'dark';
    
    // Use country flag as fallback logo
    const modalLogoUrl = rp.logo || (rp.country ? `https://flagcdn.com/w80/${rp.country.toLowerCase()}.png` : null);

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
                <p class="fides-modal-provider">${icons.building} ${escapeHtml(rp.provider.name)}${rp.provider.did ? ` <a href="${getBluePagesUrl(rp.provider.did)}" target="_blank" rel="noopener" class="fides-modal-provider-link" aria-label="View in Blue Pages">${icons.externalLink} View in Blue Pages</a>` : ''}</p>
              </div>
            </div>
            <button class="fides-modal-close" id="fides-modal-close" aria-label="Close modal">
              ${icons.xLarge}
            </button>
          </div>
          
          <div class="fides-modal-body">
            <!-- Type & Status badges with action button -->
            <div class="fides-modal-badges">
              <div class="fides-modal-badges-left">
                <span class="fides-modal-badge readiness-${rp.readiness}">
                  ${readinessLabels[rp.readiness]}
                </span>
                ${rp.status ? `
                  <span class="fides-modal-badge status-${rp.status}">
                    ${statusLabels[rp.status] || rp.status}
                  </span>
                ` : ''}
              </div>
              ${rp.website ? `
                <a href="${escapeHtml(rp.website)}" target="_blank" rel="noopener" class="fides-modal-visit-button">
                  ${icons.externalLink} Visit Website
                </a>
              ` : ''}
            </div>

            <!-- Description -->
            ${rp.description ? `
              <div class="fides-modal-section">
                <p class="fides-modal-description">${escapeHtml(rp.description)}</p>
              </div>
            ` : ''}

            <!-- Quick info grid -->
            <div class="fides-modal-grid">
              <!-- Sectors -->
              ${rp.sectors && rp.sectors.length > 0 ? `
                <div class="fides-modal-grid-item">
                  <div class="fides-modal-grid-label">
                    ${icons.building} Sectors
                  </div>
                  <div class="fides-modal-grid-value">
                    ${rp.sectors.map(s => `<span class="fides-tag sector">${escapeHtml(s)}</span>`).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Accepted Credentials -->
              ${rp.acceptedCredentials && rp.acceptedCredentials.length > 0 ? `
                <div class="fides-modal-grid-item">
                  <div class="fides-modal-grid-label">
                    ${icons.fileCheck} Accepted Credentials
                  </div>
                  <div class="fides-modal-grid-value">
                    ${rp.acceptedCredentials.map(c => `<span class="fides-tag">${escapeHtml(c)}</span>`).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Credential Formats -->
              ${rp.credentialFormats && rp.credentialFormats.length > 0 ? `
                <div class="fides-modal-grid-item">
                  <div class="fides-modal-grid-label">
                    ${icons.fileCheck} Credential Formats
                  </div>
                  <div class="fides-modal-grid-value">
                    ${rp.credentialFormats.map(f => `<span class="fides-tag">${escapeHtml(f)}</span>`).join('')}
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
            ${rp.useCases && rp.useCases.length > 0 ? `
              <div class="fides-modal-features">
                <h4 class="fides-modal-section-title">Use Cases</h4>
                <ul class="fides-features-list">
                  ${rp.useCases.map(u => `
                    <li>${icons.check} ${escapeHtml(u)}</li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}

            <!-- Links -->
            <div class="fides-modal-links">
              ${rp.video ? `
                <a href="${escapeHtml(rp.video)}" target="_blank" rel="noopener" class="fides-modal-link primary">
                  ${icons.video} Watch Video
                </a>
              ` : ''}
              ${rp.documentation ? `
                <a href="${escapeHtml(rp.documentation)}" target="_blank" rel="noopener" class="fides-modal-link">
                  ${icons.book} Documentation
                </a>
              ` : ''}
              ${rp.testCredentials ? `
                <a href="${escapeHtml(rp.testCredentials)}" target="_blank" rel="noopener" class="fides-modal-link">
                  ${icons.fileCheck} Test Credentials
                </a>
              ` : ''}
            </div>

            <!-- Provider info -->
            <div class="fides-modal-provider-section">
              <h4 class="fides-modal-section-title">Provider Information</h4>
              <div class="fides-modal-provider-info">
                <div class="fides-modal-provider-detail">
                  <span class="fides-modal-provider-label">Organization:</span>
                  <span class="fides-modal-provider-value">${escapeHtml(rp.provider.name)}</span>
                </div>
                ${rp.provider.website ? `
                  <div class="fides-modal-provider-detail">
                    <span class="fides-modal-provider-label">Website:</span>
                    <a href="${escapeHtml(rp.provider.website)}" target="_blank" rel="noopener" class="fides-modal-provider-value">${escapeHtml(rp.provider.website)}</a>
                  </div>
                ` : ''}
              </div>
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
    const modal = overlay.querySelector('.fides-modal');

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
      selectedRP = rp;
      renderModal(rp);
    }
  }

  /**
   * Attach event listeners
   */
  function attachEventListeners() {
    // Search input
    const searchInput = document.getElementById('fides-search');
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
        const input = document.getElementById('fides-search');
        if (input) input.value = '';
        // Use grid-only render
        renderRPGridOnly();
      });
    }

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
      toggle.addEventListener('click', () => {
        const filterGroup = toggle.closest('.fides-filter-group');
        if (filterGroup) {
          filterGroup.classList.toggle('collapsed');
          const isCollapsed = filterGroup.classList.contains('collapsed');
          toggle.setAttribute('aria-expanded', !isCollapsed);
          filterGroupState[filterGroup.dataset.filterGroup] = !isCollapsed;
        }
      });
    });

    // Filter checkboxes
    container.querySelectorAll('.fides-filter-checkbox input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const filterType = checkbox.dataset.filter;
        const value = checkbox.dataset.value;
        
        if (checkbox.checked) {
          if (!filters[filterType].includes(value)) {
            filters[filterType].push(value);
          }
        } else {
          filters[filterType] = filters[filterType].filter(v => v !== value);
        }
        
        render();
      });
    });

    // Clear filters
    const clearBtn = document.getElementById('fides-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        filters = {
          search: filters.search,
          type: settings.type ? [settings.type] : [],
          sectors: settings.sector ? [settings.sector] : [],
          country: [],
          credentialFormats: [],
          presentationProtocols: [],
          interoperabilityProfiles: [],
          supportedWallets: []
        };
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
   * Utility: Escape HTML
   */
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Generate Blue Pages URL for provider DID
   */
  function getBluePagesUrl(did) {
    if (!did) return null;
    const encodedDid = encodeURIComponent(did);
    return `${BLUE_PAGES_URL}/${encodedDid}/`;
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

