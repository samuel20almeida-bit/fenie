import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CATEGORIES, categoryFor, navigateProducts, availableLines } from '../public/catalogo-lab/navigation.mjs';
const products=JSON.parse(await readFile(new URL('../public/catalogo-lab/catalog-preview.json',import.meta.url))).products;

test('draft categories preserve every SKU exactly once and do not alter commercial data',()=>{
  const before=JSON.stringify(products);
  const categoryIds=new Set(CATEGORIES.map(c=>c.id));
  for(const p of products)assert.ok(categoryIds.has(categoryFor(p)));
  const grouped=CATEGORIES.flatMap(c=>navigateProducts(products,{category:c.id}));
  assert.equal(grouped.length,products.length);
  assert.equal(new Set(grouped.map(p=>p.sku)).size,products.length);
  assert.equal(JSON.stringify(products),before);
});
test('explicit product type wins over a multi-product line name',()=>{
  assert.equal(categoryFor({name:'Shampoo Royal Care 250ml',line:'ROYAL',brand:'OLENKA'}),'tratamento');
  assert.equal(categoryFor({name:'Alisante Royal Soft 1kg',line:'ROYAL',brand:'OLENKA'}),'transformacao');
  assert.equal(categoryFor({name:'Pó para Descoloração Capilar 450g',brand:'MUP COLOR'}),'descoloracao');
  assert.equal(categoryFor({name:'Creme Ativador de Cachos 200ml',brand:'EXEMPLO'}),'finalizacao');
  assert.equal(categoryFor({name:'Produto sem tipo reconhecível',brand:'EXEMPLO'}),'outros');
});
test('brand, draft category, source line, SKU search and ordering compose correctly',()=>{
  const filters={brand:'OLENKA',category:'tratamento'};
  const lines=availableLines(products,filters);
  assert.ok(lines.includes('Shampoos e condicionadores'));
  const list=navigateProducts(products,{...filters,line:'Shampoos e condicionadores',query:'shampoo',sort:'priceAsc'});
  assert.ok(list.length>0);
  assert.ok(list.every(p=>p.brand==='OLENKA'&&p.line==='Shampoos e condicionadores'&&categoryFor(p)==='tratamento'));
  assert.ok(list.every((p,i)=>!i||p.priceCents>=list[i-1].priceCents));
  const sku=list[0].sku;
  assert.equal(navigateProducts(products,{query:sku})[0].sku,sku);
  assert.equal(availableLines(products,{brand:'Marca que não existe'}).length,0);
});
