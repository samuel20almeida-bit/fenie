import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateEditorial,collectionProducts,featuredProducts,editorialSearchProducts} from '../public/catalogo-lab/merchandising.mjs';
import {navigateProducts} from '../public/catalogo-lab/navigation.mjs';
import {cartSummary,buildMessage} from '../public/catalogo-lab/core.mjs';
const products=JSON.parse(await readFile(new URL('../public/catalogo-lab/catalog-preview.json',import.meta.url))).products;
const editorial=JSON.parse(await readFile(new URL('../public/catalogo-lab/editorial.json',import.meta.url)));

test('24 manufacturer summaries and Olenka priority use exact existing photographed SKUs',()=>{
  assert.equal(validateEditorial(editorial,products),editorial);
  assert.equal(editorial.products.length,24);
  assert.deepEqual(editorial.collections.map(c=>c.skus.length),[12,6,6]);
  assert.equal(new Set(editorial.collections.flatMap(c=>c.skus)).size,24);
  const featured=featuredProducts(products,editorial);
  assert.equal(featured.length,6);
  assert.equal(editorial.priorityBrand,'OLENKA');
  assert.ok(featured.every(p=>p.brand==='OLENKA'));
  assert.equal(products.filter(p=>p.brand===editorial.priorityBrand).length,96);
});
test('selection, category, brand and benefit search compose without changing catalog or prices',()=>{
  const before=JSON.stringify(products);
  const selected=collectionProducts(products,editorial,'finalizacao');
  const found=navigateProducts(editorialSearchProducts(selected,editorial),{brand:'RIGOLIM',query:'desembaraço',sort:'priceAsc'});
  assert.ok(found.length>0);
  assert.ok(found.every(p=>editorial.collections[1].skus.includes(p.sku)));
  assert.equal(navigateProducts(editorialSearchProducts(selected,editorial),{brand:'PROHALL'}).length,0);
  assert.equal(collectionProducts(products,editorial).length,701);
  assert.equal(collectionProducts(products,editorial,'desconhecida').length,0);
  assert.equal(JSON.stringify(products),before);
  for(const p of found)assert.equal(p.priceCents,products.find(x=>x.sku===p.sku).priceCents);
});
test('curated shopping flow totals two quantities and generates a demonstration with original names and SKUs',()=>{
  const [a,b]=featuredProducts(products,editorial);
  const cart={[a.id]:2,[b.id]:3};
  assert.equal(cartSummary(cart,products).totalCents,a.priceCents*2+b.priceCents*3);
  const text=buildMessage(cart,products,{demo:true});
  assert.ok(text.includes(a.name)&&text.includes(b.name)&&text.includes(a.sku));
  assert.match(text,/DEMONSTRAÇÃO/);
});
test('editorial validation blocks changed identities, duplicates, counterfeit sources and price overrides',()=>{
  for(const mutate of [
    d=>{d.products[0].mercosName='Outra versão';},
    d=>{d.products.push(structuredClone(d.products[0]));},
    d=>{d.products[0].sourceUrl='https://lojaprohall.com.br.example.com/produto';},
    d=>{d.products[0].priceCents=1;},
    d=>{d.collections[0].skus.push('SKU-AUSENTE');},
    d=>{d.featured.push(d.featured[0]);},
    d=>{d.featured[0]='OLK-SH-ROY-1000';},
    d=>{d.featured[0]='PHL-MSK-BIO-500';},
    d=>{d.priorityBrand='MARCA INEXISTENTE';},
  ]){const copy=structuredClone(editorial);mutate(copy);assert.throws(()=>validateEditorial(copy,products));}
});
