# Community RP Catalogs

This directory contains relying party catalog entries contributed by the community.

## How to Contribute

1. **Fork** this repository
2. **Ensure your organization exists** in the [FIDES Organization Catalog](https://github.com/FIDEScommunity/fides-organization-catalog) and note its **`id`** (e.g. `org:ewc`)
3. **Create a folder** with your organization name (lowercase, hyphens for spaces), matching the organization-catalog folder slug when possible
4. **Add an `rp-catalog.json` file** with **`$schema`**, **`orgId`**, and **`relyingParties`**
5. **Submit a Pull Request**

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

Your `rp-catalog.json` must conform to **`schemas/rp-catalog.schema.json`**.

This mirrors the **issuer** and **credential** catalogs: you reference the organization with **`orgId`** only. Do **not** embed a `provider` object—name, website, logo, and DID come from the organization catalog and are filled in when **`npm run crawl`** runs.

### Required top-level fields

- **`$schema`** — must be `https://fides.community/schemas/rp-catalog/v1`
- **`orgId`** — organization catalog id (`org:…`), must exist in the organization catalog
- **`relyingParties`** — non-empty array of relying parties

### Required per relying party

- **`id`** — Unique identifier (lowercase, hyphens)
- **`name`** — Display name
- **`readiness`** — One of: `technical-demo`, `use-case-demo`, `production-pilot`, `production`
- **`country`** — ISO 3166-1 alpha-2 country code (e.g. `NL`, `DE`) or `EU`

### Recommended fields

- **`relyingParties[].website`** — URL to the verifier service
- **`relyingParties[].description`** — Brief description
- **`relyingParties[].sectors`** — Industry sectors served
- **`relyingParties[].acceptedCredentials`** — Human-readable labels
- **`relyingParties[].acceptedCredentialRefs`** — `{ "credentialCatalogId": "cred:…" }` for cross-catalog tooling
- **`relyingParties[].vcFormat`** — Supported VC formats (canonical codes: `sd_jwt_vc`, `mdoc`, etc.)
- **`relyingParties[].presentationProtocols`** — Supported protocols (OpenID4VP, etc.)
- **`relyingParties[].interoperabilityProfiles`** — DIIP v4, EWC v3, etc.
- **`relyingParties[].supportedWallets`** — Wallets that work with this RP (see below)

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
