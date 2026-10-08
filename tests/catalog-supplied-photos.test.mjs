import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {applySuppliedPhotos} from '../scripts/import-supplied-photos.mjs';

const catalog = JSON.parse(await readFile(new URL('../public/catalogo-lab/catalog-preview.json', import.meta.url)));
const manifest = JSON.parse(await readFile(new URL('../docs/catalogo-v1/fotos-drive-olenka.json', import.meta.url)));
const commercial = p => Object.fromEntries(Object.entries(p).filter(([k]) => !['image','imageAlt','imageSource','reviewPending'].includes(k)));

test('supplied photos preserve Mercos data and cannot import prices or volumes', () => {
  const hostile = structuredClone(manifest);
  hostile.photos.forEach(p => {p.priceCents=1;p.status='hidden';});
  const after = applySuppliedPhotos(catalog, hostile);
  assert.deepEqual(after.products.map(commercial), catalog.products.map(commercial));
  assert.deepEqual(applySuppliedPhotos(after, manifest), after);
  assert.equal(after.products.length, 701);
});

test('18 Olenka sources match original bytes, identity and published paths', async () => {
  assert.equal(manifest.photos.length,18);
  assert.equal(catalog.products.filter(p=>p.image).length,157);
  for (const photo of manifest.photos) {
    const p=catalog.products.find(p=>p.sku===photo.sku);
    assert.equal(p.image,photo.catalogImage);
    assert.equal(p.imageSource,photo.page);
    assert.equal(p.brand,photo.brand);
    assert.equal(p.name,photo.mercosName);
    assert.equal(p.size,photo.size);
    const bytes=await readFile(new URL(`../public/catalogo-lab/assets/products/${photo.file}`,import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'),photo.sha256);
  }
  for(const row of manifest.withheld) assert.equal(catalog.products.find(p=>p.sku===row.sku)?.image,undefined);
});

test('supplied import rejects changed identities, unreviewed images and unsafe paths', () => {
  for(const mutate of [m=>m.photos[0].sku='UNKNOWN',m=>m.photos.push(m.photos[0]),m=>m.photos[0].size='999 ml',m=>m.photos[0].mercosName='Outro produto',m=>m.photos[0].review='line',m=>m.photos[0].file='../escape.png',m=>m.photos[0].page='https://drive.google.com.evil.test/file/d/abc/view',m=>m.withheld.push({sku:m.photos[0].sku})]) {
    const m=structuredClone(manifest);mutate(m);assert.throws(()=>applySuppliedPhotos(catalog,m));
  }
});
