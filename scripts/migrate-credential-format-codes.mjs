/**
 * One-off migration: legacy vcFormat strings -> canonical snake_case codes.
 * Run from repo root: node scripts/migrate-credential-format-codes.mjs
 */
import fs from "fs";
import path from "path";

const OLD_TO_NEW = {
  "SD-JWT": "sd_jwt_vc",
  "SD-JWT-VC": "sd_jwt_vc",
  "mDL/mDoc": "mdoc",
  "JWT-VC": "jwt_vc",
  "JSON-LD VC": "vcdm_2_0",
  "AnonCreds": "anoncreds",
  "Idemix": "idemix",
  "Apple Wallet Pass": "apple_wallet_pass",
  "Google Wallet Pass": "google_wallet_pass",
  "CBOR-LD": "vcdm_2_0",
};

function migrateFormats(arr) {
  if (!Array.isArray(arr)) return arr;
  const next = arr.map((x) => OLD_TO_NEW[x] ?? x);
  return [...new Set(next)];
}

function migrateRpCatalog(data) {
  let touched = false;
  for (const rp of data.relyingParties || []) {
    if (!rp.vcFormat?.length) continue;
    const n = migrateFormats(rp.vcFormat);
    if (JSON.stringify(n) !== JSON.stringify(rp.vcFormat)) touched = true;
    rp.vcFormat = n;
  }
  return touched;
}

function walkJsonFiles(root, filename) {
  const out = [];
  function walk(dir) {
    for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, name.name);
      if (name.isDirectory()) walk(p);
      else if (name.isFile() && name.name === filename) out.push(p);
    }
  }
  walk(root);
  return out;
}

const root = process.cwd();
const sub = path.join(root, "community-catalogs");
if (!fs.existsSync(sub)) {
  console.error("No community-catalogs directory");
  process.exit(1);
}
const files = walkJsonFiles(sub, "rp-catalog.json");
let n = 0;
for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const data = JSON.parse(raw);
  if (migrateRpCatalog(data)) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
    n++;
    console.log("Updated", path.relative(root, file));
  }
}
console.log("files changed:", n);
