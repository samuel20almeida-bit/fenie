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
  const allowed = ['id','sku','slug','name','brand','line','category','sourceGroup','size','priceCents','status','order','keywords','reviewPending','image','imageAlt','imageSource'];
  for (const p of payload.products) assert.ok(Object.keys(p).every(key => allowed.includes(key)), `Unexpected public field for ${p.sku}`);
  assert.equal(payload.summary.commercialOrdersEnabled, false);
  assert.equal(payload.summary.previewProducts, 701);
  assert.equal(payload.summary.priceField, 'Mercos — Preço de Tabela');
  assert.equal(payload.products.filter(p=>p.image).length, 141);
  assert.equal(payload.summary.missingImages, 560);
  for (const sku of ['GLY-COL-989','GLY-MSQ-HYD-500','DOH-FNL-BTS-60','MAK-SOM-MAR','OLK-SH-BIO-280','MAK-PCL-BSC','PHL-SH-EXT-300','SFO-SH-ACM-1000']) assert.ok(!payload.products.some(p=>p.sku===sku));
});
