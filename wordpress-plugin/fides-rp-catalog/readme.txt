=== FIDES RP Catalog ===
Contributors: fidescommunity
Requires at least: 5.0
Tested up to: 6.7
Stable tag: 2.7.4
License: Apache-2.0
License URI: https://www.apache.org/licenses/LICENSE-2.0

Relying party catalog with search, filters, and optional SSR/SEO via fides-community-tools-tiles.

== Changelog ==

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
