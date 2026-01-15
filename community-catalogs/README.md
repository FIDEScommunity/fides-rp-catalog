# Community RP Catalogs

This directory contains relying party catalog entries contributed by the community.

## How to Contribute

1. **Fork** this repository
2. **Create a folder** with your organization name (lowercase, hyphens for spaces)
3. **Add an `rp-catalog.json` file** following the schema
4. **Submit a Pull Request**

## Folder Structure

```
community-catalogs/
├── your-organization/
│   └── rp-catalog.json
├── another-org/
│   └── rp-catalog.json
└── README.md
```

## Schema

Your `rp-catalog.json` must conform to the schema at `schemas/rp-catalog.schema.json`.

### Required Fields

- `provider.name` - Your organization name
- `relyingParties[].id` - Unique identifier (lowercase, hyphens)
- `relyingParties[].name` - Display name
- `relyingParties[].readiness` - One of: `technical-demo`, `use-case-demo`, `production-pilot`, `production`
- `relyingParties[].country` - ISO 3166-1 alpha-2 country code (e.g., `NL`, `DE`) or `EU`

### Recommended Fields

- `provider.website` - Your organization website
- `provider.logo` - URL to your logo (use Google Favicon API: `https://www.google.com/s2/favicons?domain=yourdomain.com&sz=128`)
- `relyingParties[].website` - URL to the verifier service
- `relyingParties[].description` - Brief description
- `relyingParties[].sectors` - Industry sectors served
- `relyingParties[].acceptedCredentials` - Types of credentials accepted
- `relyingParties[].credentialFormats` - Supported formats (SD-JWT-VC, mDL/mDoc, etc.)
- `relyingParties[].presentationProtocols` - Supported protocols (OpenID4VP, etc.)
- `relyingParties[].interoperabilityProfiles` - DIIP v4, EWC v3, etc.
- `relyingParties[].supportedWallets` - Wallets that work with this RP (see below)

## Wallet Deep Links

You can link to wallets in the FIDES Wallet Catalog by using the object format for `supportedWallets`:

```json
"supportedWallets": [
  { "name": "Sphereon Wallet", "walletCatalogId": "sphereon-wallet" },
  { "name": "Paradym Wallet", "walletCatalogId": "paradym-wallet" },
  "Yivi"
]
```

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Display name shown in the UI |
| `walletCatalogId` | No | Wallet ID from FIDES Wallet Catalog (enables clickable deep link) |

**Finding wallet IDs**: Browse the [FIDES Wallet Catalog](https://wallets.fides.community) and note the `?wallet=` parameter when clicking a wallet, or check the `id` field in `community-catalogs/*/wallet-catalog.json` files.

Simple strings are also supported (without deep link):
```json
"supportedWallets": ["Wallet A", "Wallet B"]
```

## Validation

Your PR will be automatically validated against the schema. Make sure your JSON is valid before submitting.

## Questions?

Open an issue or contact the FIDES Community at https://fides.community



