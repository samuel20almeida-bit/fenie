import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {applyPhotos} from '../scripts/import-catalog-photos.mjs';

const catalog = JSON.parse(await readFile(new URL('../public/catalogo-lab/catalog-preview.json', import.meta.url)));
const manifest = JSON.parse(await readFile(new URL('../docs/catalogo-v1/fontes-fotos.json', import.meta.url)));
const supplied = JSON.parse(await readFile(new URL('../docs/catalogo-v1/fotos-drive-olenka.json', import.meta.url)));
const productFor = sku => catalog.products.find(p => p.sku === sku);
const commercial = p => Object.fromEntries(Object.entries(p).filter(([key]) => !['image','imageAlt','imageSource','reviewPending'].includes(key)));

test('photo import preserves all commercial fields, ignores manufacturer prices and is idempotent', () => {
  const before = structuredClone(catalog);
  before.products.forEach(p => { delete p.image; delete p.imageAlt; delete p.imageSource; });
  const hostile = structuredClone(manifest);
  hostile.photos.forEach(p => { p.priceCents = 1; p.size = '999 kg'; p.status = 'active'; });
  const after = applyPhotos(before, hostile);
  assert.deepEqual(after.products.map(commercial), before.products.map(commercial));
  assert.deepEqual(before.products.map(p => p.image), before.products.map(() => undefined));
  assert.deepEqual(applyPhotos(after, manifest), after);
});

test('141 photos have SKU-specific provenance; different makeup shades use different originals', () => {
  assert.equal(manifest.photos.length, 141);
  assert.equal(new Set(manifest.photos.map(p => p.sku)).size, 141);
  assert.equal(catalog.products.filter(p => p.image?.startsWith('./')).length, 23);
  assert.equal(catalog.products.filter(p => p.image?.startsWith('https://')).length, 134);
  const shades = manifest.photos.filter(p => p.brand === 'MUP MAKEUP');
  assert.equal(shades.length, 56);
  assert.equal(new Set(shades.map(p => p.image)).size, 56);
  assert.equal(new Set(shades.map(p => p.sha256)).size, 56);
  for (const photo of manifest.photos) {
    const current = supplied.photos.find(p => p.sku === photo.sku) ?? photo;
    assert.equal(productFor(photo.sku).image, current.catalogImage);
    assert.equal(productFor(photo.sku).imageSource, current.page);
    assert.ok(productFor(photo.sku).imageAlt.includes(productFor(photo.sku).name));
  }
});

test('conflicting weights and ambiguous versions remain without images', () => {
  for (const sku of ['PHL-MSK-EXT-500','PHL-MSK-EXT-300','PHL-MSK-BIO-300','RGL-FXD-FIX-200','RG-FIN-CSP','MAK-BTB-NUD-1','MAK-DMQ-200','MAK-NEC-STD-M','MAK-NEC-STD-P']) {
    assert.ok(productFor(sku), sku);
    assert.equal(productFor(sku).image, undefined, sku);
  }
});

test('photo import rejects unknown, duplicate, retained, mismatched and unofficial sources', () => {
  const mutations = [
    m => { m.photos[0].sku = 'UNKNOWN'; },
    m => { m.photos.push(structuredClone(m.photos[0])); },
    m => { m.withheld.push({sku:m.photos[0].sku}); },
    m => { m.photos[0].mercosName = 'Outra embalagem'; },
    m => { m.photos[0].page = 'https://example.com/produto'; },
    m => { m.photos[0].image = 'https://images.tcdn.com.br.example.com/foto.jpg'; },
    m => { m.photos[0].catalogImage = './assets/products/../../secreto.jpg'; },
  ];
  for (const mutate of mutations) {
    const m = structuredClone(manifest); mutate(m);
    assert.throws(() => applyPhotos(catalog, m));
  }
});
