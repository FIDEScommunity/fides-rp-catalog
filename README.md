# FIDES Relying Party Catalog

An open catalog of relying parties (verifiers) that accept verifiable credentials, maintained by the FIDES Community.

## Overview

This repository contains:
- **community-catalogs/**: Relying party catalog entries contributed by the community
- **schemas/**: JSON Schema for validating RP catalog entries
- **src/**: Crawler and aggregation tools
- **wordpress-plugin/**: WordPress plugin for displaying the RP catalog
- **data/**: Aggregated data (auto-generated)

## For RP Providers

To add your relying party to the catalog:

1. Fork this repository
2. Create a folder in `community-catalogs/` with your organization name
3. Add an `rp-catalog.json` file following the schema
4. Submit a Pull Request

### Example RP Catalog Entry

```json
{
  "$schema": "https://fides.community/schemas/rp-catalog/v1",
  "provider": {
    "name": "Your Organization",
    "website": "https://your-website.com",
    "logo": "https://your-logo-url.com/logo.png"
  },
  "relyingParties": [
    {
      "id": "your-verifier-demo",
      "name": "Your Verifier Demo",
      "description": "Description of your verifier service",
      "website": "https://demo.your-website.com",
      "type": "demo",
      "status": "live",
      "sectors": ["government", "finance"],
      "useCases": ["identity-verification", "age-verification"],
      "acceptedCredentials": ["PID", "mDL"],
      "credentialFormats": ["SD-JWT-VC", "mDL/mDoc"],
      "presentationProtocols": ["OpenID4VP"],
      "interoperabilityProfiles": ["DIIP v4"],
      "supportedWallets": ["Paradym Wallet", "Sphereon Wallet"]
    }
  ]
}
```

## RP Types

- **demo**: Demonstration/testing environment
- **sandbox**: Development/integration testing
- **production**: Live production service

## Sectors

- government, finance, healthcare, education, retail
- travel, hospitality, employment, telecom, utilities
- insurance, real-estate, automotive, entertainment, other

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
npm install
```

### Run Crawler

```bash
npm run crawl
```

### Validate Catalogs

```bash
npm run validate
```

## Data & catalog UI

- **Semantic dates**: The crawler sets `updatedAt` (fallback: item/catalog/git last-commit/fetchedAt) and `firstSeenAt` (persisted in `data/rp-history-state.json`) so "New last 30 days" and "Updated last 30 days" reflect real changes, not crawl time.
- **KPIs**: The plugin shows four key figures—Relying party websites, New last 30 days, Updated last 30 days, Countries—with click actions (e.g. toggle "New" filter, sort by last updated).
- **Quick filters**: Sidebar quick filters "Added last 30 days", "Updated last 30 days", and "Includes video" with (n) counts; facets are computed over the visible set (respecting shortcode pre-filters like `type` or `sector`).
- **Sort**: Sort by "Last updated" or "Name"; preference is stored in localStorage.

See [docs/DESIGN_DECISIONS.md](docs/DESIGN_DECISIONS.md) for more detail.

## WordPress Plugin

The WordPress plugin can be found in `wordpress-plugin/fides-rp-catalog/`.

### Installation

1. Download/zip the `fides-rp-catalog` folder
2. Upload to WordPress via Plugins > Add New > Upload Plugin
3. Activate the plugin

### Usage

```
[fides_rp_catalog]
[fides_rp_catalog type="demo" theme="fides"]
[fides_rp_catalog sector="government" columns="2"]
```

### Plugin features (v1.10+)

- KPI cards: Relying party websites, New last 30 days, Updated last 30 days, Countries (with click actions).
- Quick filters: Added last 30 days, Updated last 30 days, Includes video (with counts).
- Sort by Last updated or Name (persisted).
- Filter option counts (n) over the visible set when using shortcode pre-filters.

## License

Apache 2.0 - See [LICENSE](LICENSE) for details.

## Related Projects

- [FIDES Wallet Catalog](https://github.com/FIDEScommunity/fides-wallet-catalog) - Catalog of digital identity wallets
- [FIDES RP Catalog](https://github.com/FIDEScommunity/fides-rp-catalog) - This repository
- [FIDES Community](https://fides.community) - European digital identity community

