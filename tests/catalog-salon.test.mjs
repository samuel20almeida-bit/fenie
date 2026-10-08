import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {SALON_CONTENT, validateSalon, salonProducts, complementaryProducts, mergeReplenishment} from '../public/catalogo-lab/salon.mjs';
import {cartSummary, serializeCart, restoreCart} from '../public/catalogo-lab/core.mjs';
import {navigateProducts} from '../public/catalogo-lab/navigation.mjs';
const products=JSON.parse(await readFile(new URL('../public/catalogo-lab/catalog-preview.json',import.meta.url))).products;

test('B2B selections use exact Mercos identities and compose with brand/category without changing commercial data',()=>{
  const before=JSON.stringify(products);
  assert.equal(validateSalon(products).length,4);
  assert.equal(salonProducts(products,'profissional').length,5);
  const retail=salonProducts(products,'bancada');
  assert.equal(retail.length,4);
  assert.ok(retail.every(p=>p.brand==='OLENKA'));
  assert.equal(navigateProducts(retail,{brand:'RIGOLIM'}).length,0);
  assert.ok(navigateProducts(retail,{category:'tratamento'}).length<=retail.length);
  assert.equal(salonProducts(products,'desconhecida').length,0);
  assert.equal(salonProducts(products).length,701);
  assert.equal(JSON.stringify(products),before);
  for(const field of ['priceCents','discount','stock','margin'])assert.ok(SALON_CONTENT.every(c=>!(field in c)));
  const changed=structuredClone(products);changed.find(p=>p.sku==='OLK-MSK-RYC-250').name='Outra embalagem';
  assert.throws(()=>validateSalon(changed));
});
test('complementary suggestions omit the viewed product, duplicate contents of the kit and unavailable items',()=>{
  const mask=complementaryProducts(products,'OLK-MSK-RYC-250');
  assert.deepEqual(mask.map(p=>p.sku),['OLK-SH-RYC-250','OLK-FND-CCC-250']);
  assert.deepEqual(complementaryProducts(products,'OLK-KIT-RYC-2').map(p=>p.sku),['OLK-FND-CCC-250']);
  assert.equal(complementaryProducts(products,'OLK-ALI-RLK-1000').length,0);
  const hidden=products.map(p=>p.sku==='OLK-SH-RYC-250'?{...p,status:'unavailable'}:p);
  assert.equal(complementaryProducts(hidden,'OLK-MSK-RYC-250').length,1);
});
test('saved replenishment stores only identifiers and quantities and recalculates using current catalog prices',()=>{
  const p=products.find(p=>p.sku==='OLK-MSK-RYC-250');
  const raw=serializeCart({[p.id]:2},1000), saved=restoreCart(raw,2000);
  assert.ok(!raw.includes('price')&&!raw.includes(p.name));
  const updated=products.map(x=>x.id===p.id?{...x,priceCents:6100}:x);
  const current={[p.id]:1};
  const merged=mergeReplenishment(saved,current,updated);
  assert.equal(merged[p.id],3);
  assert.equal(cartSummary(merged,updated).totalCents,18300);
  assert.equal(current[p.id],1);
  assert.equal(saved[p.id],2);
});
test('invalid, removed or overflowing replenishment rejects the whole merge without adding any item',()=>{
  const [a,b]=salonProducts(products,'bancada');
  const current={[a.id]:999};
  for(const saved of [{},{[a.id]:0},{[a.id]:1,[b.id]:2},{[b.id]:2,'removed-sku':1}]) {
    assert.throws(()=>mergeReplenishment(saved,current,products));
    assert.deepEqual(current,{[a.id]:999});
  }
  const unavailable=products.map(p=>p.id===b.id?{...p,status:'unavailable'}:p);
  assert.throws(()=>mergeReplenishment({[b.id]:2},{},unavailable));
});
