import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateCatalog } from '../public/catalogo-lab/core.mjs';

const payload = JSON.parse(await readFile(new URL('../public/catalogo-lab/catalog-preview.json', import.meta.url)));
test('staging is commercial-only, unique, under review and contains no ambiguous duplicate', () => {
  validateCatalog(payload);
  assert.equal(payload.reviewOnly, true);
  assert.equal(payload.products.length, payload.summary.previewProducts);
  assert.ok(payload.products.every(p => p.status === 'consult'));
  assert.ok(payload.products.every(p => p.sku !== 'MAK-SOM-MAR'));
  const allowed = ['id','sku','slug','name','brand','line','category','size','priceCents','status','order','keywords','reviewPending'];
  for (const p of payload.products) assert.ok(Object.keys(p).every(key => allowed.includes(key)), `Unexpected public field for ${p.sku}`);
  assert.equal(payload.summary.commercialOrdersEnabled, false);
});
