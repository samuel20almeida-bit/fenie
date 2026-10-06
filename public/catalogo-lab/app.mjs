import { money, validateCatalog, searchProducts, cartSummary, restoreCart, serializeCart, buildMessage, captureOrigin, MAX_QUANTITY } from './core.mjs';
const storageKey = 'fenie:catalog-lab:cart:v1';
let products = [], cart = {}, origin = {}, catalogReady = false;
let filters = { query: '', brand: '', category: '', sort: 'relevance' };
const drafts = {};
const view = document.querySelector('#view');
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
try { cart = restoreCart(localStorage.getItem(storageKey)); } catch { /* browser storage may be unavailable */ }
try { origin = captureOrigin(location.search, JSON.parse(sessionStorage.getItem('fenie:origin') || '{}')); sessionStorage.setItem('fenie:origin', JSON.stringify(origin)); } catch { origin = captureOrigin(location.search); }
function notify(message) { const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(notify.timer); notify.timer = setTimeout(() => el.classList.remove('show'), 2500); }
function save() { try { localStorage.setItem(storageKey, serializeCart(cart)); } catch { notify('O navegador não permite salvar o carrinho.'); } updateBadge(); }
function updateBadge() { document.querySelector('#cartBadge').textContent = cartSummary(cart, products).count; }
function pack(p) { return `<div class="pack" aria-label="Embalagem ilustrativa"><div class="${['jar','bottle','tube'].includes(p.type) ? p.type : 'bottle'}"><div class="label">${esc(p.brand)}<small>ILUSTRATIVO</small></div></div></div>`; }
function stepper(id, count, context = 'draft') { return `<div class="stepper"><button data-action="quantity" data-id="${esc(id)}" data-context="${context}" data-delta="-1" aria-label="Diminuir quantidade" ${count <= 1 ? 'disabled' : ''}>−</button><span>${count}</span><button data-action="quantity" data-id="${esc(id)}" data-context="${context}" data-delta="1" aria-label="Aumentar quantidade" ${count >= MAX_QUANTITY ? 'disabled' : ''}>+</button></div>`; }
function status(p) { return p.status === 'consult' ? '<p class="status badge-consult">Disponibilidade sob consulta</p>' : p.status === 'unavailable' ? '<p class="status">Temporariamente indisponível</p>' : ''; }
function card(p) { return `<article class="product-card"><a href="#/produto/${p.slug}" style="color:inherit;text-decoration:none"><div class="product-visual">${pack(p)}</div><div class="product-info"><div class="brandline">${esc(p.brand)}</div><h3 class="prodname">${esc(p.name)}</h3><div class="size">${esc(p.size)}</div><div class="price">${money(p.priceCents)}</div>${status(p)}</div></a><div class="product-info" style="padding-top:0"><div class="card-actions">${stepper(p.id,drafts[p.id] || 1)}<button class="add-btn" data-action="add" data-id="${esc(p.id)}" ${p.status === 'unavailable' ? 'disabled' : ''}>Adicionar</button></div></div></article>`; }
function results() {
  const list = searchProducts(products,filters);
  document.querySelector('#results').innerHTML = `<div class="section-head"><h2>${list.length} produtos</h2><button class="section-link" data-action="clear">Limpar filtros</button></div>${list.length ? `<div class="product-grid">${list.map(card).join('')}</div>` : '<div class="empty"><h3>Não encontramos esse produto.</h3><p>Tente outro nome, marca, categoria ou SKU.</p><button class="primary" data-action="clear">Voltar ao catálogo</button><p style="margin-top:14px">O contato comercial será habilitado no catálogo real.</p></div>'}`;
}
const options = (values, selected) => '<option value="">Todas</option>' + values.map(v => `<option value="${esc(v)}" ${v === selected ? 'selected' : ''}>${esc(v)}</option>`).join('');
function home() {
  view.innerHTML = `<div class="main"><div class="search-wrap"><label for="search">Buscar no catálogo</label><input class="search" id="search" value="${esc(filters.query)}" placeholder="Produto, marca, categoria ou SKU" type="search"></div><div class="hero"><div class="eyebrow">Fenié PRO</div><h1>Seu salão abastecido, sem perder tempo.</h1><p>Escolha os produtos, ajuste as quantidades e confira a mensagem de pedido.</p></div><div class="filterbar"><label>Marca<select id="brand">${options([...new Set(products.map(p => p.brand))],filters.brand)}</select></label><label>Categoria<select id="category">${options([...new Set(products.map(p => p.category))],filters.category)}</select></label><label>Ordenação<select id="sort">${[['relevance','Relevância'],['name','Nome A–Z'],['priceAsc','Menor preço'],['priceDesc','Maior preço']].map(([v,label]) => `<option value="${v}" ${filters.sort===v?'selected':''}>${label}</option>`).join('')}</select></label></div><section id="results" class="section" aria-live="polite"></section></div>`;
  results();
}
function product(slug) {
  const p = products.find(p => p.slug === slug && p.status !== 'hidden');
  if (!p) { view.innerHTML = '<div class="main empty"><h1>Produto não encontrado.</h1><a href="#/">Voltar ao catálogo</a></div>'; return; }
  view.innerHTML = `<div class="main"><p><a href="#/">← Catálogo</a></p><div class="detail-layout"><div class="detail-visual">${pack(p)}</div><div><div class="detail-brand">${esc(p.brand)}</div><h1 class="detail-name">${esc(p.name)}</h1><div class="detail-size">${esc(p.size)} · ${esc(p.sku)}</div><div class="detail-price">${money(p.priceCents)}</div>${status(p)}<div class="qty-row"><span>Quantidade</span>${stepper(p.id,drafts[p.id]||1)}</div><button class="primary" data-action="add" data-id="${esc(p.id)}" ${p.status==='unavailable'?'disabled':''}>Adicionar ao carrinho</button><div class="detail-block"><h3>Sobre este exemplo</h3><p>${esc(p.description)}</p></div><div class="notice">Descrição, preço e embalagem são ilustrativos. O conteúdo real virá do cadastro revisado.</div></div></div></div>`;
}
function cartView() {
  const s = cartSummary(cart,products);
  if (!s.items.length && !s.issues.length) { view.innerHTML = '<div class="main"><h1>Seu pedido</h1><div class="empty"><h3>Seu carrinho está vazio.</h3><p>Adicione os produtos que deseja consultar.</p><a class="secondary" href="#/" style="display:block;padding:14px;text-decoration:none">Ver produtos</a></div></div>'; return; }
  view.innerHTML = `<div class="main"><p><a href="#/">← Continuar comprando</a></p><h1>Seu pedido</h1>${s.issues.map(i => `<div class="alert">${esc(i.reason)} <button data-action="remove" data-id="${esc(i.id)}">Remover item</button></div>`).join('')}<div class="cart-list">${s.items.map(({product:p,quantity,subtotalCents}) => `<article class="cart-item"><div class="cart-thumb">${pack(p)}</div><div><h2 class="cart-name">${esc(p.name)}</h2><div class="cart-meta">${esc(p.brand)} · ${esc(p.size)} · ${money(p.priceCents)} por unidade</div>${status(p)}<div class="cart-lower">${stepper(p.id,quantity,'cart')}<span class="cart-sub">${money(subtotalCents)}</span></div><button class="remove" data-action="remove" data-id="${esc(p.id)}">Remover</button></div></article>`).join('')}</div><div class="summary"><div class="summary-total"><span>Subtotal</span><span>${money(s.totalCents)}</span></div><div class="notice">Frete, disponibilidade, pagamento e condições comerciais serão confirmados pela equipe Fenié.</div><button class="primary" data-action="review" ${s.issues.length || !s.items.length ? 'disabled' : ''}>Revisar pedido</button></div></div>`;
}
function review() {
  const s = cartSummary(cart, products);
  if (!s.items.length || s.issues.length) { location.hash = '/carrinho'; return; }
  view.innerHTML = `<div class="main"><p><a href="#/carrinho">← Editar carrinho</a></p><h1>Revisar pedido</h1><div class="review-card">${s.items.map(({product:p,quantity,subtotalCents}) => `<div class="review-item"><div class="review-left">${quantity} × ${esc(p.name)}<small>${esc(p.size)} · ${money(p.priceCents)} por unidade</small></div><span class="review-price">${money(subtotalCents)}</span></div>`).join('')}<div class="summary-total"><span>Subtotal</span><span>${money(s.totalCents)}</span></div></div><div class="field"><label for="clientName">Nome / Salão (opcional)</label><input id="clientName" maxlength="120" placeholder="Ex.: Studio Bella"></div><div class="notice">Esta demonstração permite conferir a mensagem. O envio de pedidos reais será habilitado após a revisão do catálogo.</div><button class="primary" data-action="message">Gerar mensagem de demonstração</button><section id="messageArea" style="margin-top:18px" aria-live="polite"></section></div>`;
}
function route() {
  if (!catalogReady) return;
  const path = location.hash.slice(1) || '/';
  if (path.startsWith('/produto/')) product(path.slice('/produto/'.length));
  else if (path === '/carrinho') cartView();
  else if (path === '/resumo') review();
  else home();
  updateBadge();
}
async function load() {
  catalogReady = false;
  view.innerHTML = '<div class="main"><p role="status">Carregando catálogo…</p></div>';
  try {
    const response = await fetch('./demo.json',{ cache:'no-store' });
    if (!response.ok) throw new Error('Falha de carregamento');
    products = validateCatalog(await response.json()).products;
    catalogReady = true; route();
  } catch { view.innerHTML = '<div class="main empty"><h1>Não foi possível carregar.</h1><p>Tente novamente.</p><button class="primary" data-action="retry">Tentar novamente</button></div>'; }
}
document.addEventListener('input',e => { if (e.target.id==='search') { filters.query=e.target.value; results(); } });
document.addEventListener('change',e => { if (['brand','category','sort'].includes(e.target.id)) { filters[e.target.id]=e.target.value; results(); } });
document.addEventListener('click',async e => {
  const button = e.target.closest('button[data-action]'); if (!button || button.disabled) return;
  const { action,id,context,delta }=button.dataset;
  if (action==='retry') return load();
  if (!catalogReady) return;
  if (action==='focus-search') { if ((location.hash.slice(1)||'/')!=='/') location.hash='/'; else home(); requestAnimationFrame(() => document.querySelector('#search')?.focus()); }
  if (action==='clear') { filters={query:'',brand:'',category:'',sort:'relevance'}; home(); }
  if (action==='quantity') { const target=context==='cart'?cart:drafts; target[id]=Math.min(MAX_QUANTITY,Math.max(1,(target[id]||1)+Number(delta))); if(context==='cart')save(); const productRoute=location.hash.startsWith('#/produto/'); if(context==='cart')cartView(); else if(productRoute)product(location.hash.slice('#/produto/'.length)); else results(); }
  if (action==='add') { const p=products.find(p=>p.id===id); if(!p || ['hidden','unavailable'].includes(p.status))return; const sum=(cart[id]||0)+(drafts[id]||1); if(sum>MAX_QUANTITY)return notify('Limite de 999 unidades por produto.'); cart[id]=sum; save(); notify('Adicionado ao carrinho ✓'); }
  if (action==='remove') { delete cart[id]; save(); cartView(); notify('Item removido.'); }
  if (action==='review') location.hash='/resumo';
  if (action==='message') { const text=buildMessage(cart,products,{name:document.querySelector('#clientName').value,origin,demo:true}); document.querySelector('#messageArea').innerHTML='<h2>Mensagem pronta</h2><pre class="msg-preview"></pre><button class="secondary" data-action="copy">Copiar mensagem</button>'; document.querySelector('.msg-preview').textContent=text; }
  if (action==='copy') { try { await navigator.clipboard.writeText(document.querySelector('.msg-preview').textContent); notify('Mensagem copiada.'); } catch { notify('Selecione a mensagem para copiar manualmente.'); } }
});
window.addEventListener('hashchange',() => { route(); window.scrollTo(0,0); view.focus({preventScroll:true}); });
load();
