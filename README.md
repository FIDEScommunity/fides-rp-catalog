# FIDES Relying Party Catalog

An open catalog of relying parties (verifiers) that accept verifiable credentials, maintained by the FIDES Community.

## Overview

This repository contains:

- **community-catalogs/**: Relying party catalog entries contributed by the community (`rp-catalog.json` per organization)
- **schemas/**: JSON Schema for validating RP catalog entries (`schemas/rp-catalog.schema.json`)
- **src/**: Crawler and aggregation tools (`npm run crawl` writes **`data/aggregated.json`**)
- **wordpress-plugin/**: WordPress plugin for displaying the catalog in a page or post
- **data/**: Aggregated JSON and supporting files (generated; **`data/aggregated.json`** is what the public UI loads by default)

GitHub Actions runs **validation** on catalog changes and a **scheduled crawl** that refreshes `data/aggregated.json` when community catalogs change (on the main upstream repo).

## For RP providers

To add or update a relying party:

1. Fork this repository (or open a branch if you have write access).
2. Create or use a folder under `community-catalogs/<your-organization>/`.
3. Add or edit `rp-catalog.json` so it validates against **`schemas/rp-catalog.schema.json`**.
4. Open a Pull Request.

Validate locally before you push:

```bash
npm install
npm run validate
# optional: npm run validate:featured && npm run validate:all
```

### Example `rp-catalog.json` (excerpt)

The schema is the source of truth. Organization name, DID, website, and logo are **not** duplicated here: set **`orgId`** to your entry in the [FIDES Organization Catalog](https://github.com/FIDEScommunity/fides-organization-catalog) (same pattern as **`issuer-catalog.json`** and **`credential-catalog.json`**). The crawler resolves org fields when building **`data/aggregated.json`**.

```json
{
  "$schema": "https://fides.community/schemas/rp-catalog/v1",
  "orgId": "org:your-org-slug",
  "relyingParties": [
    {
      "id": "your-verifier-demo",
      "name": "Your Verifier Demo",
      "description": "Short description of the verifier or demo site.",
      "website": "https://demo.your-website.com",
      "readiness": "use-case-demo",
      "country": "NL",
      "status": "live",
      "sectors": ["government", "finance"],
      "useCases": ["identity-verification", "age-verification"],
      "acceptedCredentials": ["PID", "Personal ID"],
      "acceptedCredentialRefs": [
        { "credentialCatalogId": "cred:example:pid:sd-jwt-vc" }
      ],
      "vcFormat": ["sd_jwt_vc", "mdoc"],
      "presentationProtocols": ["OpenID4VP"],
      "interoperabilityProfiles": ["DIIP v4"],
      "supportedWallets": [
        { "name": "Example Wallet", "walletCatalogId": "example-wallet-id" }
      ]
    }
  ]
}
```

Add your organization to the organization catalog first if it is not listed yet. Then use its **`id`** (e.g. `org:ewc`) as **`orgId`**.

**`acceptedCredentialRefs`** (objects with `credentialCatalogId` like `cred:…`) are the preferred link to the [FIDES Credential Catalog](https://github.com/FIDEScommunity/fides-credential-catalog). They power cross-catalog tooling and, in the WordPress plugin, **Ecosystem** and **Theme** filters (resolved via credential catalog `aggregated.json`). **`acceptedCredentials`** remains useful as human-readable labels.

## Readiness (`readiness`)

Each relying party must set **`readiness`** (not the old `type` field):

| Value | Meaning |
|--------|---------|
| `technical-demo` | Technical demonstration |
| `use-case-demo` | Use-case / scenario demo |
| `production-pilot` | Production pilot |
| `production` | Live production service |

Optional **`status`** describes operations: `development`, `beta`, `live`, `deprecated`.

## Sectors (`sectors`)

In JSON, **`sectors`** must use the **enum values defined in the schema**, for example: `government`, `finance`, `healthcare`, `education`, `retail`, `travel`, `hospitality`, `employment`, `telecom`, `utilities`, `insurance`, `real-estate`, `automotive`, `entertainment`, `other`.

The WordPress catalog UI maps these to **canonical sector codes** (e.g. `government` → `public_sector`) for filtering and alignment with the credential and organization catalogs. The shortcode attribute **`sector="public_sector"`** uses those canonical codes; legacy values such as **`government`** are still accepted and mapped.

## Development

### Prerequisites

- **Node.js 18+** (CI uses Node 24)
- npm

### Setup

```bash
npm install
```

### Crawler (regenerate `data/aggregated.json`)

```bash
npm run crawl
```

The crawler loads the [organization catalog `aggregated.json`](https://github.com/FIDEScommunity/fides-organization-catalog/blob/main/data/aggregated.json) (or a local clone at `../organization-catalog/data/aggregated.json` when developing on a `.local` / `localhost` machine) to validate **`orgId`** and attach denormalized **`provider`** data to each RP in the output.

### Validate catalogs

```bash
npm run validate
npm run validate:featured   # validates data/featured.json
npm run validate:all      # both
```

## Data and catalog UI behavior

- **Semantic dates**: The crawler sets `updatedAt` (with fallbacks such as git history / `fetchedAt`) and `firstSeenAt` (persisted in `data/rp-history-state.json`) so “new” and “updated” reflect real catalog changes, not only crawl time.
- **Organization link**: Community **`rp-catalog.json`** files declare **`orgId`** only; the crawler resolves **`provider`** (name, website, logo, DID) from the organization catalog and adds **`orgId`** on each RP in **`aggregated.json`** (for UI and deep links).
- **Default data URL**: The plugin loads RP data from **`data/aggregated.json`** (GitHub raw on public sites, with a **local plugin copy** preferred on typical `.local` dev hosts).
- **KPI row**: Total RPs in the current result, **New last 30 days**, **Updated last 30 days**, **Countries** (with interactions such as toggling the “new” filter or clearing country filter where implemented).
- **Sidebar filters**: Readiness, supported wallets, sector, **ecosystem** and **theme** (derived from linked credentials), country, credential format, presentation protocol, interop profile, plus quick options such as **Added last 30 days**, **Includes video**, **Featured first**, and **Linked RPs** when `?rps=` is present.
- **Ecosystem / Theme**: Loaded from the credential catalog **`aggregated.json`** URL configured in WordPress (see plugin settings). Each RP’s `acceptedCredentialRefs` are matched to credential IDs; ecosystems and themes are unioned for facets and filters.
- **Sort**: **Last updated** or **Name**; choice is stored in `localStorage`.
- **Vocabulary tooltips**: Filter groups can show **[i]** descriptions from the interop profiles vocabulary (with a bundled fallback JSON in the plugin).

See [docs/DESIGN_DECISIONS.md](docs/DESIGN_DECISIONS.md) for background.

## WordPress plugin

Location: **`wordpress-plugin/fides-rp-catalog/`** (current plugin header version: **2.0.x**).

### Installation

1. Zip the `fides-rp-catalog` folder (or deploy the folder by other means).
2. WordPress → **Plugins → Add New → Upload Plugin**.
3. Activate **FIDES RP Catalog**.

### Settings

Under **Settings → FIDES RP Catalog** you can set:

- **Wallet Catalog URL** — base URL for wallet deep links  
- **Blue Pages URL** — DID lookup base URL  
- **Credential Catalog URL** — page with the credential catalog shortcode (for `?credential=cred:…` links)  
- **Organization Catalog URL** — page with the organization catalog shortcode (for `?org=org:…` links from RP modals; source data uses **`orgId`** like issuer/credential catalogs)  
- **Credential catalog data (JSON)** — URL of credential **`aggregated.json`** (ecosystem/theme filters and labels)

`mapPageUrl` and default GitHub raw URLs for RP and vocabulary data are passed from PHP; adjust in code or options where your fork differs.

### Shortcode

```
[fides_rp_catalog]
[fides_rp_catalog type="use-case-demo" theme="fides"]
[fides_rp_catalog sector="public_sector" columns="2"]
```

| Attribute | Purpose | Default |
|-----------|---------|---------|
| `type` | Pre-filter by **readiness** (maps to `readiness` in data) | (none — show all) |
| `sector` | Pre-filter by **canonical** sector code, e.g. `public_sector`, `finance`, `healthcare` | (none) |
| `show_filters` | Show filter sidebar | `true` |
| `show_search` | Show search field | `true` |
| `columns` | Grid columns | `3` (`2`, `3`, or `4`) |
| `theme` | Color theme | `dark` (`dark`, `light`, `fides`) |

**`type`** values must match **`readiness`**: `technical-demo`, `use-case-demo`, `production-pilot`, `production`.

**Deep links (optional):** `?rp=<rp-id>` opens a detail view; `?rps=id1,id2` restricts the list to those IDs (with a sidebar toggle to return to the full set).

### Plugin features (high level)

- Responsive grid, modal detail (via shared **fides-catalog-ui** where present), search, sort, KPI strip.
- Faceted filters with counts on the visible set (respecting shortcode pre-filters).
- **Ecosystem** and **Theme** filters derived from **`acceptedCredentialRefs`** + credential catalog JSON.
- Links to wallet catalog, Blue Pages, map page, and credential catalog where configured.

## License

Apache 2.0 — see [LICENSE](LICENSE).

## Related projects

- [FIDES Wallet Catalog](https://github.com/FIDEScommunity/fides-wallet-catalog) — digital identity wallets  
- [FIDES Credential Catalog](https://github.com/FIDEScommunity/fides-credential-catalog) — credential types  
- [FIDES Organization Catalog](https://github.com/FIDEScommunity/fides-organization-catalog) — organizations (referenced via **`orgId`** in RP source JSON)  
- [FIDES RP Catalog](https://github.com/FIDEScommunity/fides-rp-catalog) — this repository  
- [FIDES Community](https://fides.community)
