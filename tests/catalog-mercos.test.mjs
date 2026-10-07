import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {cartSummary,buildMessage,restoreCart,serializeCart} from '../public/catalogo-lab/core.mjs';
const {products}=JSON.parse(await readFile(new URL('../public/catalogo-lab/catalog-preview.json',import.meta.url)));

test('a persisted cart uses Mercos prices in totals and the generated message',()=>{
  const cart=restoreCart(serializeCart({'OLK-FND-LPS-30':3}));
  assert.equal(cartSummary(cart,products).totalCents,5970);
  const text=buildMessage(cart,products,{demo:true});
  assert.match(text,/DEMONSTRAÇÃO/);
  assert.match(text,/Unitário: R\$\s*19,90/);
  assert.match(text,/Subtotal: R\$\s*59,70/);
});
test('a previous cart with a now hidden product requires removal before a message',()=>{
  const cart={'OLK-FND-LPS-30':2,'PHL-MSK-TWT-300':1};
  const summary=cartSummary(cart,products);
  assert.equal(summary.totalCents,3980);
  assert.equal(summary.issues.length,1);
  assert.throws(()=>buildMessage(cart,products,{demo:true}));
  delete cart['PHL-MSK-TWT-300'];
  assert.doesNotThrow(()=>buildMessage(cart,products,{demo:true}));
});
test('all five image candidates exist locally and link to the official source',async()=>{
  for(const product of products.filter(p=>p.image)){
    const file=new URL('../public/catalogo-lab/'+product.image,import.meta.url);
    assert.ok((await stat(file)).size>1000);
    assert.match(product.imageSource,/^https:\/\/www\.rigolim\.com\.br\//);
    assert.ok(product.reviewPending.includes('Embalagem da foto oficial'));
  }
});
