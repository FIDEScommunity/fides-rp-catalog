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

## License

Apache 2.0 - See [LICENSE](LICENSE) for details.

## Related Projects

- [FIDES Wallet Catalog](https://github.com/FIDEScommunity/fides-wallet-catalog) - Catalog of digital identity wallets
- [FIDES RP Catalog](https://github.com/FIDEScommunity/fides-rp-catalog) - This repository
- [FIDES Community](https://fides.community) - European digital identity community

