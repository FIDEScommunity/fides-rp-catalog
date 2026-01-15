# FIDES RP Catalog Schema Reference

Quick reference for providers to see which fields accept fixed values (enums) vs free text.

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

## Provider Fields

| Field | Required | Type | Valid Values |
|-------|----------|------|--------------|
| `provider.name` | ✅ | 📝 | Any text |
| `provider.did` | | 🆔 | `did:method:...` |
| `provider.website` | | 🔗 | URL |
| `provider.logo` | | 🔗 | URL |
| `provider.contact.email` | | 📧 | Email |
| `provider.contact.support` | | 🔗 | URL |

---

## Relying Party Fields

| Field | Required | Type | Valid Values |
|-------|----------|------|--------------|
| `id` | ✅ | 🆔 | lowercase, hyphens only (`my-verifier`) |
| `name` | ✅ | 📝 | Any text |
| `readiness` | ✅ | 🔒 | `technical-demo`, `use-case-demo`, `production-pilot`, `production` |
| `country` | ✅ | 🆔 | ISO 3166-1 alpha-2 (`NL`, `DE`, `US`) or `EU` |
| `description` | | 📝 | Any text |
| `logo` | | 🔗 | URL |
| `website` | | 🔗 | URL |
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
| `credentialFormats` | 🔒 | `SD-JWT-VC`, `JWT-VC`, `JSON-LD VC`, `AnonCreds`, `mDL/mDoc`, `X.509` |
| `presentationProtocols` | 📝 | Common: `OpenID4VP`, `ISO 18013-5`, `Yivi / IRMA disclosure via QR` |
| `interoperabilityProfiles` | 🔒 | `DIIP v4`, `EWC v3` |

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
  "provider": {
    "name": "My Organization"
  },
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
  "provider": {
    "name": "Example Corp",
    "website": "https://example.com",
    "logo": "https://www.google.com/s2/favicons?domain=example.com&sz=128"
  },
  "relyingParties": [
    {
      "id": "example-verifier",
      "name": "Example Identity Verifier",
      "description": "Verify user identity using wallet credentials",
      "website": "https://verify.example.com",
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
