=== FIDES RP Catalog ===
Contributors: fidescommunity
Requires at least: 5.0
Tested up to: 6.7
Stable tag: 2.8.13
License: Apache-2.0
License URI: https://www.apache.org/licenses/LICENSE-2.0

Relying party catalog with search, filters, and optional SSR/SEO via fides-community-tools-tiles.

== Changelog ==

= 2.8.13 =
* Sync shared catalog analytics for uniform wallet and organization detail/outbound events with Matomo outlink deduplication (tiles ≥ 1.13.21).

= 2.8.12 =
* Sync shared modal UI: Use cases accordion scroll arrows overlay cards on narrow screens (tiles ≥ 1.13.18).

= 2.8.11 =
* Sync shared modal UI: Use cases accordion scrolls horizontally when more than two cases are linked (tiles ≥ 1.13.17).

= 2.8.10 =
* Sync shared modal UI: Use cases accordion uses a two-column layout on narrow screens; a single linked case spans the full row (tiles ≥ 1.13.15).

= 2.8.9 =
* Sync shared modal UI: use-case card Matomo Use Case Click tracking.

= 2.8.8 =
* Sync shared modal UI: Use cases accordion shows cards (closed by default).

= 2.8.7 =
* Official listing badge requires explicit catalogTier Pro; curated Community
  can keep full fields via catalogListingDepth (tiles ≥ 1.10.0).

= 2.8.6 =
* After sign-in, Back from the logged-in page reloads a stale guest catalog
  snapshot so the like star sees the session (needs tiles ≥ 1.9.23).

= 2.8.5 =
* After magic-link sign-in, Back reloads a cached logged-out catalog page so
  the like star sees the new session.

= 2.8.4 =
* Store RP submission descriptions as plain text so ampersands are not
  double-escaped as &amp; in the catalog modal.

= 2.8.3 =
* After GitHub fails, use a 12-hour browser cache and the WP last-known-good aggregated feed before the bundled plugin snapshot.

= 2.8.2 =
* Show a dismissible notice when GitHub catalog data is unreachable and the plugin snapshot is used.

= 2.8.1 =
* Restore readable light/FIDES RP modal colors and fixed header/body scrolling
  by resynchronizing the canonical shared modal stylesheet.

= 2.8.0 =
* Add an “or Ask FIDES” button beside RP search when FIDES Assistant 0.6.1 or
  newer is active, with search prefill and an RP-specific placeholder.
* Remove the Show on map link and its configuration from the RP listing.

= 2.7.13 =
* RP modal: Use cases accordion moved above Specifications / Ecosystem Model; bare name+likes table, same-window deep links (synced fides-catalog-ui).

= 2.7.12 =
* Fix light/fides modal contrast (accordions, ecosystem, close, Open in catalog), header-fixed scrolling, and issuer/credential table column layout.

= 2.7.11 =
* Mobile filters: keep the drawer open when expanding groups or selecting options; keep body scroll lock in sync (shared FidesCatalogUI.createMobileFiltersController from tiles ≥ 1.8.28).

= 2.7.10 =
* RP detail modal: restore subtle Last updated footer above the contact footer; dates use the browser locale (bundled fides-catalog-ui from tiles ≥ 1.8.20).

= 2.7.9 =
* Fix RP modal country label: pass countryNames to shared modal so globe shows full name (e.g. Sweden) instead of ISO code (SE).

= 2.7.8 =
* RP modal header: country flag replaced with globe icon and full country name (bundled fides-catalog-ui from tiles ≥ 1.8.19).

= 2.7.7 =
* RP modal mobile: one key|value per row; Documentation link button matches primary button width (tiles 1.8.16).

= 2.7.6 =
* RP modal mobile: key|value pairs stay side-by-side; Documentation/API link buttons shrink to content width (tiles 1.8.15).

= 2.7.5 =
* RP modal Links: Website and Test credentials stay filled primary buttons; Documentation and API endpoint use outline style (tiles 1.8.14).

= 2.7.4 =
* RP modal Links: outline buttons without solid fill (bundled modal library from tiles 1.8.13).

= 2.7.3 =
* Restore RP modal Links app-store buttons; mobile CSS only scales them down (reverts 2.7.2 pill change). Ecosystem vertical stack on mobile unchanged.

= 2.7.2 =
* RP modal mobile layout: ecosystem model stacks vertically (aligned with issuer catalog); external links use compact pills instead of large app-store buttons (bundled modal library from fides-community-tools-tiles 1.8.11).

= 2.7.1 =
* RP modal: documentation and API endpoint links moved into the Links row; removed the empty Resources section (bundled modal library synced from fides-community-tools-tiles 1.8.10).

= 2.7.0 =
* Ship RP submission stack: adapter, forms PHP, `rp-form.js` / `rp-form.css`, media normalizer (fixes fatal error from 2.6.0 require paths without class files).
* GitHub Actions `wp-submissions-sync` workflow and `import-wp-submissions` tooling (`repository_dispatch` push sync per CATALOG-SUBMISSION-GOVERNANCE §14).
* Initial `data/wp-submission-state.json` for WordPress-managed RP tracking.

= 2.6.0 =
* RP detail modal: FIDES Ecosystem Model, accordion tables (issuers, credentials, supported wallets, reverse-linked use cases), Explain link, ecosystem stat boxes scroll to accordions (requires fides-community-tools-tiles ≥ 1.8.9 bundled modal library).
* Grid cards: provider header, centered logo, Country / Readiness / Sector meta strip, Official listing badges when tier UI is enabled.
* Quick filters: “Official listings only” replaces “Featured first”.
* Settings: use case catalog URL, use case / wallet / issuer aggregated JSON URLs, ecosystem explorer URL for modal Explain link.
* Bundled `assets/lib/fides-catalog-ui.*` synced from fides-community-tools-tiles 1.8.9.

= 2.5.0 =
* RP submission forms: media accordion with up to 10 cover images and 3 demo videos (same limits as wallet/org forms), including image upload via the shared card-image endpoint.
* Schema: `media` object on relying parties (`media.videos` max 3, `media.images` max 10); legacy `video` field removed (use `media.videos`).

= 2.4.0 =
* Added WordPress submission flow: `[fides_rp_submit_form]` and `[fides_rp_update_form]` shortcodes (shared moderation in fides-community-tools-tiles).
* Supported wallets and accepted credentials use catalog lookups; interop profiles load from the interop profiles catalog; use cases are reverse-linked from the use case catalog on export.
* Modal pencil links to the update form for eligible users (requires fides-community-tools-tiles with shared catalog UI).

= 2.3.6 =
* Mobile detail modal layout via updated bundled `assets/lib/fides-catalog-ui.*` (sync from fides-community-tools-tiles ≥ 1.7.8).
