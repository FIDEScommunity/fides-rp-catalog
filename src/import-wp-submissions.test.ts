import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  buildImportPlan,
  emptyState,
  loadCommittedExportPayload,
  mergeRpIntoCatalog,
  type WpExportEntry,
} from '../scripts/import-wp-submissions.ts';

test('loadCommittedExportPayload returns null when the file is absent', async () => {
  const missing = path.join(os.tmpdir(), `fides-missing-${Date.now()}.json`);
  assert.equal(await loadCommittedExportPayload(missing), null);
});

test('loadCommittedExportPayload parses a committed export file', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'fides-export-'));
  const file = path.join(dir, 'rp.json');
  const payload = {
    schemaVersion: '1.0.0',
    catalogType: 'rp',
    generatedAt: new Date().toISOString(),
    entries: [
      {
        itemId: 'example-rp',
        slug: 'fides',
        filename: 'rp-catalog.json',
        source: 'wordpress',
        document: {
          orgId: 'org:fides',
          relyingParties: [{ id: 'example-rp', name: 'Example', readiness: 'production' }],
        },
      },
    ],
  };
  await fs.writeFile(file, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  const loaded = await loadCommittedExportPayload(file);
  assert.equal(loaded?.entries.length, 1);
  assert.equal(loaded?.entries[0].slug, 'fides');
  await fs.rm(dir, { recursive: true, force: true });
});

test('loadCommittedExportPayload throws a clear error on malformed JSON', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'fides-export-bad-'));
  const file = path.join(dir, 'rp.json');
  await fs.writeFile(file, '{ not json', 'utf8');
  await assert.rejects(loadCommittedExportPayload(file), /Invalid committed export/);
  await fs.rm(dir, { recursive: true, force: true });
});

test('mergeRpIntoCatalog appends and updates by RP id', () => {
  const entryA: WpExportEntry = {
    itemId: 'example-rp',
    slug: 'fides',
    filename: 'rp-catalog.json',
    source: 'wordpress',
    document: {
      orgId: 'org:fides',
      relyingParties: [{ id: 'example-rp', name: 'Example', readiness: 'use-case-demo' }],
    },
  };
  const entryB: WpExportEntry = {
    itemId: 'example-rp',
    slug: 'fides',
    filename: 'rp-catalog.json',
    source: 'wordpress',
    document: {
      orgId: 'org:fides',
      relyingParties: [{ id: 'example-rp', name: 'Example v2', readiness: 'production' }],
    },
  };
  const other: WpExportEntry = {
    itemId: 'other-rp',
    slug: 'fides',
    filename: 'rp-catalog.json',
    source: 'wordpress',
    document: {
      orgId: 'org:fides',
      relyingParties: [{ id: 'other-rp', name: 'Other', readiness: 'production' }],
    },
  };

  let doc = mergeRpIntoCatalog(null, entryA);
  assert.equal(doc.relyingParties?.length, 1);
  assert.equal(doc.relyingParties?.[0]?.name, 'Example');

  doc = mergeRpIntoCatalog(doc, other);
  assert.equal(doc.relyingParties?.length, 2);

  doc = mergeRpIntoCatalog(doc, entryB);
  assert.equal(doc.relyingParties?.length, 2);
  assert.equal(doc.relyingParties?.find((r) => r.id === 'example-rp')?.name, 'Example v2');
});

test('buildImportPlan groups by slug and plans prune', () => {
  const entries: WpExportEntry[] = [
    {
      itemId: 'r1',
      slug: 'fides',
      filename: 'rp-catalog.json',
      source: 'wordpress',
      document: {
        orgId: 'org:fides',
        relyingParties: [{ id: 'r1', name: 'R1', readiness: 'production' }],
      },
    },
  ];
  const previous = emptyState();
  previous.managedRps = [{ slug: 'oldco', rpId: 'legacy-rp' }];
  const plan = buildImportPlan(entries, previous);
  assert.equal(plan.groups.length, 1);
  assert.equal(plan.groups[0]?.slug, 'fides');
  assert.equal(plan.prune.length, 1);
});

test('export-to-community pipeline merges create then update for same RP id', () => {
  const createExport: WpExportEntry = {
    itemId: 'pipeline-rp',
    slug: 'acme',
    filename: 'rp-catalog.json',
    source: 'wordpress',
    publishedAt: '2026-06-22T10:00:00.000Z',
    document: {
      orgId: 'org:acme',
      relyingParties: [{
        id: 'pipeline-rp',
        name: 'Pipeline RP',
        readiness: 'use-case-demo',
        description: 'Initial submission',
      }],
    },
  };
  const updateExport: WpExportEntry = {
    itemId: 'pipeline-rp',
    slug: 'acme',
    filename: 'rp-catalog.json',
    source: 'wordpress',
    publishedAt: '2026-06-23T12:00:00.000Z',
    document: {
      orgId: 'org:acme',
      relyingParties: [{
        id: 'pipeline-rp',
        name: 'Pipeline RP',
        readiness: 'production',
        description: 'After moderation update',
      }],
    },
  };

  const plan = buildImportPlan([createExport, updateExport], emptyState());
  assert.equal(plan.groups.length, 1);
  assert.equal(plan.groups[0]?.entries.length, 2);
  assert.equal(plan.skipped.length, 0);

  let doc = null as ReturnType<typeof mergeRpIntoCatalog> | null;
  for (const entry of plan.groups[0]!.entries) {
    doc = mergeRpIntoCatalog(doc, entry);
  }

  assert.equal(doc?.orgId, 'org:acme');
  assert.equal(doc?.relyingParties?.length, 1);
  const rp = doc?.relyingParties?.[0];
  assert.equal(rp?.id, 'pipeline-rp');
  assert.equal(rp?.readiness, 'production');
  assert.equal(rp?.description, 'After moderation update');
  assert.ok(doc?.lastUpdated);
});

test('rpFromEntry prefers embedded RP id over itemId metadata', () => {
  const entry: WpExportEntry = {
    itemId: 'meta-id',
    slug: 'acme',
    filename: 'rp-catalog.json',
    source: 'wordpress',
    document: {
      orgId: 'org:acme',
      relyingParties: [{ id: 'embedded-id', name: 'Embedded', readiness: 'production' }],
    },
  };
  const rp = mergeRpIntoCatalog(null, entry).relyingParties?.[0];
  assert.equal(rp?.id, 'embedded-id');
});
