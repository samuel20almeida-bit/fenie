import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateCatalog, searchProducts, quantity, cartSummary, serializeCart, restoreCart, buildMessage, whatsappUrl, captureOrigin, CART_TTL } from '../public/catalogo-lab/core.mjs';
const data = JSON.parse(await readFile(new URL('../public/catalogo-lab/demo.json', import.meta.url)));
const products = data.products;
test('validates unique SKU, slug, cents and status', () => {
  assert.equal(validateCatalog(data), data);
  assert.throws(() => validateCatalog({ products: [...products, products[0]] }));
  assert.throws(() => validateCatalog({ products: [{ ...products[0], priceCents: 12.9 }] }));
});
test('accepts local product images and rejects unsafe paths', () => {
  const p={...products[0],image:'./assets/products/RGL-SPT-VOL-200.jpg',imageAlt:'Produto Rigolim'};
  assert.doesNotThrow(()=>validateCatalog({products:[p]}));
  for(const image of ['../private.jpg','./assets/products/../private.jpg','javascript:alert(1)','data:image/png;base64,abc']) assert.throws(()=>validateCatalog({products:[{...p,image}]}));
});
test('search matches accents, SKU, keywords and combined filters', () => {
  assert.equal(searchProducts(products, { query: 'coloracao', brand: 'MUP Color', category: 'Coloração' }).length, 1);
  assert.equal(searchProducts(products, { query: products[0].sku }).length, 1);
  assert.equal(searchProducts(products, { query: 'zzzz' }).length, 0);
  assert.equal(searchProducts(products, { query: 'hidratacao' }).length, 2);
});
test('one, ten and multiple products use exact monetary arithmetic', () => {
  assert.equal(cartSummary({ [products[0].id]: 1 }, products).totalCents, products[0].priceCents);
  assert.equal(cartSummary({ [products[0].id]: 10 }, products).totalCents, products[0].priceCents * 10);
  assert.equal(cartSummary({ [products[0].id]: 2, [products[1].id]: 1 }, products).totalCents, 35470);
  assert.equal(cartSummary({}, products).totalCents, 0);
  for (const value of [0, -1, 1.5, NaN, Infinity, 1000, '2']) assert.throws(() => quantity(value));
});
test('restores valid cart and discards damaged, expired or prototype data', () => {
  assert.deepEqual(restoreCart(serializeCart({ 'web-mask': 10 }, 100), 101), { 'web-mask': 10 });
  assert.deepEqual(restoreCart(serializeCart({ 'web-mask': 1 }, 100), 101 + CART_TTL), {});
  assert.deepEqual(restoreCart('{oops'), {});
  assert.deepEqual(restoreCart('{"version":1,"savedAt":100,"items":[{"id":"__proto__","quantity":1},{"id":"x","quantity":-1}]}', 101), {});
});
test('uses current prices and blocks removed/unavailable items', () => {
  const changed = products.map(p => ({ ...p, priceCents: 1000 }));
  assert.equal(cartSummary({ 'web-mask': 2 }, changed).totalCents, 2000);
  assert.equal(cartSummary({ missing: 1 }, products).issues.length, 1);
  assert.throws(() => buildMessage({ missing: 1 }, products));
  assert.throws(() => buildMessage({ [products[0].id]: 1 }, [{ ...products[0], status: 'unavailable' }]));
  assert.equal(searchProducts([{ ...products[0], status: 'hidden' }]).length, 0);
});
test('structured message round trips through WhatsApp URL with attribution', () => {
  const message = buildMessage({ 'web-mask': 2, 'lipid-serum': 1 }, products, { name: 'Salão A & B', origin: { seller: 'daniele', utm_campaign: 'outubro' } });
  assert.match(message, /SKU: DEMO-001/);
  assert.match(message, /Quantidade: 2/);
  assert.match(message, /354,70/);
  assert.match(message, /seller: daniele/);
  assert.equal(new URL(whatsappUrl('5541998402800', message)).searchParams.get('text'), message);
  assert.throws(() => whatsappUrl('javascript:alert(1)', message));
});
test('origin persists across navigation and a new campaign replaces only its keys', () => {
  assert.deepEqual(captureOrigin('?vendedor=daniele&utm_source=instagram'), { seller: 'daniele', utm_source: 'instagram' });
  assert.deepEqual(captureOrigin('', { seller: 'daniele' }), { seller: 'daniele' });
  assert.deepEqual(captureOrigin('?seller=ricardo', { seller: 'daniele', utm_source: 'instagram' }), { seller: 'ricardo', utm_source: 'instagram' });
});
