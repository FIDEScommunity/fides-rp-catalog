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
    laptop: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>'
  };

  // Selected RP for modal
  let selectedRP = null;

  // Configuration
  const config = window.fidesRPCatalog || {
    pluginUrl: '',
    githubDataUrl: 'https://raw.githubusercontent.com/FIDEScommunity/fides-rp-catalog/main/data/aggregated.json'
  };

  // State
  let relyingParties = [];
  let filters = {
    search: '',
    type: [],
    sectors: [],
    credentialFormats: [],
    interoperabilityProfiles: []
  };
  let showFiltersPanel = false;

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
   * Filter relying parties based on current filters
   */
  function getFilteredRPs() {
    return relyingParties.filter(rp => {
      // Search
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matches = 
          rp.name.toLowerCase().includes(search) ||
          (rp.description || '').toLowerCase().includes(search) ||
          rp.provider.name.toLowerCase().includes(search);
        if (!matches) return false;
      }

      // Type
      if (filters.type.length > 0) {
        if (!filters.type.includes(rp.type)) return false;
      }

      // Sectors
      if (filters.sectors.length > 0) {
        const hasMatch = filters.sectors.some(s => (rp.sectors || []).includes(s));
        if (!hasMatch) return false;
      }

      // Credential formats
      if (filters.credentialFormats.length > 0) {
        const hasMatch = filters.credentialFormats.some(f => (rp.credentialFormats || []).includes(f));
        if (!hasMatch) return false;
      }

      // Interoperability profiles
      if (filters.interoperabilityProfiles.length > 0) {
        const hasMatch = filters.interoperabilityProfiles.some(p => (rp.interoperabilityProfiles || []).includes(p));
        if (!hasMatch) return false;
      }

      return true;
    });
  }

  /**
   * Count active filters
   */
  function getActiveFilterCount() {
    let count = 0;
    if (!settings.type) count += filters.type.length;
    if (!settings.sector) count += filters.sectors.length;
    count += filters.credentialFormats.length;
    count += filters.interoperabilityProfiles.length;
    return count;
  }

  /**
   * Render the catalog
   */
  function render() {
    const filtered = getFilteredRPs();
    const activeFilterCount = getActiveFilterCount();
    
    // Save focus state
    const searchInput = document.getElementById('fides-search');
    const wasSearchFocused = searchInput && document.activeElement === searchInput;
    const cursorPosition = wasSearchFocused ? searchInput.selectionStart : 0;
    
    let html = '';

    // Search
    if (settings.showSearch) {
      html += `
        <div class="fides-search-container">
          <div class="fides-search-wrapper">
            <span class="fides-search-icon">${icons.search}</span>
            <input 
              type="text" 
              class="fides-search-input" 
              placeholder="Search by name, description or provider..."
              value="${escapeHtml(filters.search)}"
              id="fides-search"
            >
            <button class="fides-search-clear ${filters.search ? '' : 'hidden'}" id="fides-search-clear" type="button">
              ${icons.xSmall}
            </button>
          </div>
        </div>
      `;
    }

    // Filter toggle bar
    if (settings.showFilters) {
      html += `
        <div class="fides-filter-bar">
          <div class="fides-filter-bar-left">
            <button class="fides-filter-toggle ${showFiltersPanel ? 'active' : ''}" id="fides-filter-toggle">
              ${icons.filter}
              <span>Filters</span>
              ${activeFilterCount > 0 ? `<span class="fides-filter-count">${activeFilterCount}</span>` : ''}
            </button>
            ${activeFilterCount > 0 ? `
              <button class="fides-clear-all" id="fides-clear">
                ${icons.x} Clear filters
              </button>
            ` : ''}
          </div>
          <div class="fides-results-count">
            ${filtered.length} relying part${filtered.length !== 1 ? 'ies' : 'y'} found
          </div>
        </div>
      `;

      // Filters panel
      if (showFiltersPanel) {
        html += `
          <div class="fides-filters">
            ${!settings.type ? `
              <div class="fides-filter-group">
                <span class="fides-filter-label">Type</span>
                <div class="fides-filter-buttons">
                  <button class="fides-filter-btn ${filters.type.includes('demo') ? 'active' : ''}" data-filter="type" data-value="demo">Demo</button>
                  <button class="fides-filter-btn ${filters.type.includes('sandbox') ? 'active' : ''}" data-filter="type" data-value="sandbox">Sandbox</button>
                  <button class="fides-filter-btn ${filters.type.includes('production') ? 'active' : ''}" data-filter="type" data-value="production">Production</button>
                </div>
              </div>
            ` : ''}
            ${!settings.sector ? `
              <div class="fides-filter-group">
                <span class="fides-filter-label">Sector</span>
                <div class="fides-filter-buttons">
                  <button class="fides-filter-btn ${filters.sectors.includes('government') ? 'active' : ''}" data-filter="sectors" data-value="government">Government</button>
                  <button class="fides-filter-btn ${filters.sectors.includes('finance') ? 'active' : ''}" data-filter="sectors" data-value="finance">Finance</button>
                  <button class="fides-filter-btn ${filters.sectors.includes('healthcare') ? 'active' : ''}" data-filter="sectors" data-value="healthcare">Healthcare</button>
                  <button class="fides-filter-btn ${filters.sectors.includes('education') ? 'active' : ''}" data-filter="sectors" data-value="education">Education</button>
                  <button class="fides-filter-btn ${filters.sectors.includes('retail') ? 'active' : ''}" data-filter="sectors" data-value="retail">Retail</button>
                </div>
              </div>
            ` : ''}
            <div class="fides-filter-group">
              <span class="fides-filter-label">Interop Profile</span>
              <div class="fides-filter-buttons">
                <button class="fides-filter-btn ${filters.interoperabilityProfiles.includes('DIIP v4') ? 'active' : ''}" data-filter="interoperabilityProfiles" data-value="DIIP v4">DIIP v4</button>
                <button class="fides-filter-btn ${filters.interoperabilityProfiles.includes('EWC v3') ? 'active' : ''}" data-filter="interoperabilityProfiles" data-value="EWC v3">EWC v3</button>
              </div>
            </div>
            <div class="fides-filter-group">
              <span class="fides-filter-label">Credential Format</span>
              <div class="fides-filter-buttons">
                <button class="fides-filter-btn ${filters.credentialFormats.includes('SD-JWT-VC') ? 'active' : ''}" data-filter="credentialFormats" data-value="SD-JWT-VC">SD-JWT-VC</button>
                <button class="fides-filter-btn ${filters.credentialFormats.includes('mDL/mDoc') ? 'active' : ''}" data-filter="credentialFormats" data-value="mDL/mDoc">mDL/mDoc</button>
                <button class="fides-filter-btn ${filters.credentialFormats.includes('JWT-VC') ? 'active' : ''}" data-filter="credentialFormats" data-value="JWT-VC">JWT-VC</button>
              </div>
            </div>
          </div>
        `;
      }
    } else {
      html += `
        <div class="fides-results-info">
          <span>${filtered.length} relying part${filtered.length !== 1 ? 'ies' : 'y'} found</span>
        </div>
      `;
    }

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
          <h3 class="fides-empty-title">No relying parties found</h3>
          <p class="fides-empty-text">Adjust your filters or try a different search query.</p>
        </div>
      `;
    }

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
   * Render a single RP card
   */
  function renderRPCard(rp) {
    const typeLabels = {
      demo: 'Demo',
      sandbox: 'Sandbox',
      production: 'Production'
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

    return `
      <div class="fides-rp-card" data-rp-id="${rp.id}" role="button" tabindex="0">
        <div class="fides-rp-header type-${rp.type}">
          ${rp.logo 
            ? `<img src="${escapeHtml(rp.logo)}" alt="${escapeHtml(rp.name)}" class="fides-rp-logo">`
            : `<div class="fides-rp-logo-placeholder">${icons.globe}</div>`
          }
          <div class="fides-rp-info">
            <h3 class="fides-rp-name">${escapeHtml(rp.name)}</h3>
            <p class="fides-rp-provider">${escapeHtml(rp.provider.name)}</p>
          </div>
          <span class="fides-rp-type-badge ${rp.type}">${typeLabels[rp.type]}</span>
        </div>
        <div class="fides-rp-body">
          ${rp.description ? `<p class="fides-rp-description">${escapeHtml(rp.description)}</p>` : ''}
          
          ${rp.sectors && rp.sectors.length > 0 ? `
            <div class="fides-tags">
              ${rp.sectors.slice(0, 3).map(s => `
                <span class="fides-tag sector">${sectorLabels[s] || s}</span>
              `).join('')}
              ${rp.sectors.length > 3 ? `<span class="fides-tag sector">+${rp.sectors.length - 3}</span>` : ''}
            </div>
          ` : ''}

          ${rp.interoperabilityProfiles && rp.interoperabilityProfiles.length > 0 ? `
            <div class="fides-tags">
              ${rp.interoperabilityProfiles.map(p => `
                <span class="fides-tag interop">${escapeHtml(p)}</span>
              `).join('')}
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
              <a href="${escapeHtml(rp.website)}" target="_blank" rel="noopener" class="fides-rp-link" onclick="event.stopPropagation();">
                ${icons.externalLink} Visit
              </a>
            ` : ''}
          </div>
          <span class="fides-view-details">View details →</span>
        </div>
      </div>
    `;
  }

  /**
   * Render the RP detail modal
   */
  function renderModal(rp) {
    const typeLabels = {
      demo: 'Demo',
      sandbox: 'Sandbox',
      production: 'Production'
    };

    const statusLabels = {
      development: 'In Development',
      beta: 'Beta',
      live: 'Live',
      deprecated: 'Deprecated'
    };

    const currentTheme = container.getAttribute('data-theme') || 'dark';

    const modalHtml = `
      <div class="fides-modal-overlay" id="fides-modal-overlay" data-theme="${currentTheme}">
        <div class="fides-modal" role="dialog" aria-modal="true" aria-labelledby="fides-modal-title">
          <div class="fides-modal-header">
            <div class="fides-modal-header-content">
              ${rp.logo 
                ? `<img src="${escapeHtml(rp.logo)}" alt="${escapeHtml(rp.name)}" class="fides-modal-logo">`
                : `<div class="fides-modal-logo-placeholder">${icons.globe}</div>`
              }
              <div class="fides-modal-title-wrap">
                <h2 class="fides-modal-title" id="fides-modal-title">${escapeHtml(rp.name)}</h2>
                <p class="fides-modal-provider">${icons.building} ${escapeHtml(rp.provider.name)}</p>
              </div>
            </div>
            <button class="fides-modal-close" id="fides-modal-close" aria-label="Close modal">
              ${icons.xLarge}
            </button>
          </div>
          
          <div class="fides-modal-body">
            <!-- Type & Status badges -->
            <div class="fides-modal-badges">
              <span class="fides-modal-badge type-${rp.type}">
                ${typeLabels[rp.type]}
              </span>
              ${rp.status ? `
                <span class="fides-modal-badge status-${rp.status}">
                  ${statusLabels[rp.status] || rp.status}
                </span>
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
                    ${rp.supportedWallets.map(w => `<span class="fides-tag">${escapeHtml(w)}</span>`).join('')}
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
              ${rp.website ? `
                <a href="${escapeHtml(rp.website)}" target="_blank" rel="noopener" class="fides-modal-link primary">
                  ${icons.externalLink} Visit Website
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
        render();
      }, 300));
    }

    // Search clear button
    const searchClear = document.getElementById('fides-search-clear');
    if (searchClear) {
      searchClear.addEventListener('click', () => {
        filters.search = '';
        render();
      });
    }

    // Filter toggle
    const filterToggle = document.getElementById('fides-filter-toggle');
    if (filterToggle) {
      filterToggle.addEventListener('click', () => {
        showFiltersPanel = !showFiltersPanel;
        render();
      });
    }

    // Filter buttons
    container.querySelectorAll('.fides-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const filterType = btn.dataset.filter;
        const value = btn.dataset.value;
        
        if (filters[filterType].includes(value)) {
          filters[filterType] = filters[filterType].filter(v => v !== value);
        } else {
          filters[filterType].push(value);
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
          credentialFormats: [],
          interoperabilityProfiles: []
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

