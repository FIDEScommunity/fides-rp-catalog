# FIDES RP Catalog Schema Reference

Quick reference for contributors: which fields accept fixed values (enums) vs free text.

Organization **name, DID, website, logo, and contact** are **not** in this file—they live in the [FIDES Organization Catalog](https://github.com/FIDEScommunity/fides-organization-catalog). Reference them with **`orgId`** (same idea as issuer and credential `credential-catalog.json` files).

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Required field |
| 🔒 | Fixed values (enum) - must use exact values listed |
| 📝 | Free text |
| 🔗 | URL format |
| 📧 | Email format |
| 🆔 | Pattern-based (regex) |

---

## Catalog root (source `rp-catalog.json`)

| Field | Required | Type | Valid Values |
|-------|----------|------|--------------|
| `$schema` | ✅ | 🔒 | Must be `https://fides.community/schemas/rp-catalog/v1` |
| `orgId` | ✅ | 🆔 | `org:` + slug, e.g. `org:ewc` — must exist in organization catalog |
| `relyingParties` | ✅ | array | At least one RP (see below) |
| `lastUpdated` | | ISO 8601 | Optional |

---

## Relying Party Fields

| Field | Required | Type | Valid Values |
|-------|----------|------|--------------|
| `id` | ✅ | 🆔 | lowercase, hyphens only (`my-verifier`) |
| `name` | ✅ | 📝 | Any text |
| `readiness` | ✅ | 🔒 | `technical-demo`, `use-case-demo`, `production-pilot`, `production` |
| `country` | ✅ | 🆔 | ISO 3166-1 alpha-2 (`NL`, `DE`, `US`) or `EU` |
| `description` | | 📝 | Any text |
| `logo` | | 🔗 | URL (displayed on tile instead of country flag) |
| `website` | | 🔗 | URL |
| `video` | | 🔗 | URL to video demonstration |
| `documentation` | | 🔗 | URL |
| `testCredentials` | | 🔗 | URL |
| `apiEndpoint` | | 🔗 | URL |

---

## Status & Classification

| Field | Type | Valid Values |
|-------|------|--------------|
| `status` | 🔒 | `development`, `beta`, `live`, `deprecated` |
| `sectors` | 🔒 | `government`, `finance`, `healthcare`, `education`, `retail`, `travel`, `hospitality`, `employment`, `telecom`, `utilities`, `insurance`, `real-estate`, `automotive`, `entertainment`, `other` |

---

## Credential Formats & Protocols

| Field | Type | Valid Values |
|-------|------|--------------|
| `credentialFormats` | 🔒 | `SD-JWT-VC`, `JWT-VC`, `JSON-LD VC`, `AnonCreds`, `Idemix`, `mDL/mDoc`, `X.509` |
| `presentationProtocols` | 📝 | Common: `OpenID4VP`, `ISO 18013-5`, `IRMA Protocol` |
| `interoperabilityProfiles` | 🔒 | `DIIP v4`, `EWC v3`, `HAIP v1`, `EUDI Wallet ARF` |

---

## Free Text Arrays

| Field | Type | Description |
|-------|------|-------------|
| `useCases` | 📝 | e.g., `Login`, `KYC`, `Age verification`, `Identity proofing` |
| `acceptedCredentials` | 📝 | e.g., `PID`, `mDL`, `Diploma`, `Criminal Record Check` |
| `features` | 📝 | Additional capabilities |
| `languages` | 📝 | ISO 639-1 codes: `en`, `nl`, `de`, `fr` |

---

## Supported Wallets

The `supportedWallets` field accepts two formats:

### Simple string (no deep link)
```json
"supportedWallets": ["Wallet A", "Wallet B"]
```

### Object with deep link to Wallet Catalog
```json
"supportedWallets": [
  { "name": "Heidi", "walletCatalogId": "heidi-wallet" },
  { "name": "iGrant Data Wallet", "walletCatalogId": "igrant-data-wallet" }
]
```

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `name` | ✅ | 📝 | Display name |
| `walletCatalogId` | | 🆔 | Wallet ID from FIDES Wallet Catalog (enables clickable link) |

**Finding wallet IDs**: Browse https://wallets.fides.community and check the `?wallet=` parameter, or look at the `id` field in wallet-catalog JSON files.

---

## Minimal Example

```json
{
  "$schema": "https://fides.community/schemas/rp-catalog/v1",
  "orgId": "org:example-org",
  "relyingParties": [
    {
      "id": "my-verifier",
      "name": "My Verifier Service",
      "readiness": "use-case-demo",
      "country": "NL"
    }
  ]
}
```

---

## Full Example

```json
{
  "$schema": "https://fides.community/schemas/rp-catalog/v1",
  "orgId": "org:example-org",
  "relyingParties": [
    {
      "id": "example-verifier",
      "name": "Example Identity Verifier",
      "description": "Verify user identity using wallet credentials",
      "website": "https://verify.example.com",
      "video": "https://youtube.com/watch?v=example",
      "readiness": "production",
      "country": "NL",
      "status": "live",
      "sectors": ["finance", "government"],
      "useCases": ["Login", "KYC", "Age verification"],
      "acceptedCredentials": ["PID", "mDL"],
      "credentialFormats": ["SD-JWT-VC", "mDL/mDoc"],
      "presentationProtocols": ["OpenID4VP"],
      "interoperabilityProfiles": ["DIIP v4"],
      "supportedWallets": [
        { "name": "Heidi", "walletCatalogId": "heidi-wallet" },
        { "name": "iGrant Data Wallet", "walletCatalogId": "igrant-data-wallet" }
      ],
      "languages": ["en", "nl"]
    }
  ]
}
```

---

## Readiness Levels Explained

| Value | Description |
|-------|-------------|
| `technical-demo` | Technical demonstration, testing interoperability |
| `use-case-demo` | Demonstrates a real use case, but with demo/test data |
| `production-pilot` | Limited production with real users |
| `production` | Fully live service |

---

## Need a value added?

If you need a new enum value (e.g., a new sector or credential format), open an issue or PR on GitHub:
https://github.com/FIDEScommunity/fides-rp-catalog

---

*© 2026 FIDES Labs BV*
