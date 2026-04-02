# Design Decisions – FIDES RP Catalog

---

## 1. URL Parameters

### 1.1 `?rps=` for pre-filtering by ID

**Decision:** The RP catalog supports a `?rps=id1,id2,...` URL parameter that pre-filters the catalog to a specific set of relying parties on page load.

**Rationale:**
- Enables deep linking from the credential catalog's RP box directly to a pre-filtered view.
- Consistent with the same pattern used in the wallet catalog (`?wallets=`).
- Commas are valid URL sub-delimiters; individual IDs are `encodeURIComponent`-encoded at the source.

**Implementation:**
- `readQueryParams()` in `rp-catalog.js` parses `?rps=` on init.
- The parsed IDs are stored in `originalIds` (module-level) and `filters.ids` (live state).
- `getFilteredAndSortedRPs()` checks `filters.ids` first, before any other filters.
- `getActiveFilterCount()` adds `1` when `filters.ids.length > 0` so the sidebar Clear button is visible.

### 1.2 "Linked relying parties" quick filter when arriving via `?rps=`

**Decision:** When the page is loaded with a `?rps=` parameter (i.e. `originalIds.length > 0`), a "Linked relying parties (n)" checkbox appears in the Quick filters section, pre-checked. Unchecking it shows all RPs; re-checking restores the pre-filter. Clicking "Clear" in the sidebar removes the filter and the `?rps=` parameter from the URL permanently (for that session).

**Rationale:**
- Makes the pre-filter visible and self-documenting; users understand why the list is narrowed.
- Allows toggling between the full catalog and the linked subset without navigating back.
- Consistent with "Linked wallets" quick filter in the wallet catalog.

**Implementation:**
- `originalIds` stores the IDs from the URL and is never mutated by toggling.
- `filters.ids` holds the live state (empty = show all, `[...originalIds]` = show only linked).
- The checkbox `data-filter="linkedRPs"` triggers a special case in the change handler: `filters.ids = isChecked ? [...originalIds] : []`.
- The Clear button resets `filters.ids = []`, sets `originalIds = []`, and removes `?rps=` from the URL via `history.replaceState`.

---

## 2. Source `rp-catalog.json` and `orgId`

**Decision:** Community catalogs use **`$schema`**, **`orgId`**, and **`relyingParties`** only (no embedded **`provider`** object). The **`orgId`** value matches the FIDES Organization Catalog entry id (`org:…`), as in **`issuer-catalog.json`** and **`credential-catalog.json`**.

**Rationale:**
- Single source of truth for organization name, DID, website, and logo.
- Avoids drift between RP JSON and the organization catalog.
- Aligns contributor expectations across FIDES catalog repositories.

**Implementation:**
- `schemas/rp-catalog.schema.json` requires **`orgId`** with the same pattern as the issuer catalog schema.
- `npm run crawl` loads organization **`aggregated.json`** (GitHub raw, with local sibling-repo fallback on dev hosts), resolves each **`orgId`**, and writes denormalized **`provider`** plus **`orgId`** on every RP in **`data/aggregated.json`** for the WordPress UI and cross-catalog tooling (e.g. organization catalog RP matching still uses **`provider.name`** / **`provider.did`** on aggregated rows).
