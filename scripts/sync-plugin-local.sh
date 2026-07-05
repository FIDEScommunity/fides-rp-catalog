#!/usr/bin/env bash
# Sync WordPress plugin to Local (utrecht-demo). Override with RP_CATALOG_PLUGIN_SRC / RP_CATALOG_PLUGIN_DEST.
set -euo pipefail
SRC="${RP_CATALOG_PLUGIN_SRC:-/Users/victorvanderhulst/Projects/rp-catalog/wordpress-plugin/fides-rp-catalog/}"
DEST="${RP_CATALOG_PLUGIN_DEST:-/Users/victorvanderhulst/Local Sites/utrecht-demo/app/public/wp-content/plugins/fides-rp-catalog/}"
rsync -av --delete "$SRC" "$DEST"
