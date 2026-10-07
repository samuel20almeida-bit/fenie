import { money, validateCatalog, cartSummary, restoreCart, serializeCart, buildMessage, captureOrigin, quantity, MAX_QUANTITY } from './core.mjs';
import { CATEGORIES, categoryFor, navigateProducts, availableLines } from './navigation.mjs';

const storageKey = 'fenie:catalog-lab:cart:v1';
const view = document.querySelector('#view');
const searchInput = document.querySelector('#search');
const initialFilters = () => ({ query:'', brand:'', category:'', line:'', sort:'relevance' });
let products = [], cart = {}, origin = {}, catalogReady = false, pageLimit = 24, filters = initialFilters(), jumpToBrands = false;
const drafts = Object.create(null);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const path = () => location.hash.slice(1) || '/';
const brandName = brand => ({'MUP MAKEUP':'MUP Makeup','MUP COLOR':'MUP Color','SPA DO FIO':'Spa do Fio','PAPEL PARA MECHAS':'Papel para Mechas'}[brand] || brand.charAt(0)+brand.slice(1).toLowerCase());
const categoryName = id => CATEGORIES.find(c => c.id === id)?.name || 'Produto profissional';
try { cart = restoreCart(localStorage.getItem(storageKey)); } catch { /* storage is optional */ }
try { origin = captureOrigin(location.search, JSON.parse(sessionStorage.getItem('fenie:origin') || '{}')); sessionStorage.setItem('fenie:origin',JSON.stringify(origin)); } catch { origin=captureOrigin(location.search); }

const icons = {
  color:'<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16V4Z"/>',
  drop:'<path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11Z"/><path d="M9 14a3 3 0 0 0 3 3"/>',
  spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/>',
  bottle:'<path d="M9 3h6v4l2 3v11H7V10l2-3V3Z"/><path d="M9 7h6M7 12h10M9 3h6"/>',
  wave:'<path d="M4 6c4-6 12 6 16 0M4 12c4-6 12 6 16 0M4 18c4-6 12 6 16 0"/>',
  brush:'<path d="m7 14 10-11 4 4-11 10M7 14l3 3c0 4-5 4-7 4 2-2 0-5 4-7Z"/>',
  sheets:'<path d="M7 3h14v14H7zM3 7v14h14M10 7h8M10 10h8M10 13h5"/>',
  grid:'<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>',
};
const icon = name => `<svg aria-hidden="true" viewBox="0 0 24 24">${icons[name] || icons.grid}</svg>`;
function notify(message) { const el=document.querySelector('#toast'); el.textContent=message; el.classList.add('show'); clearTimeout(notify.timer); notify.timer=setTimeout(()=>el.classList.remove('show'),2500); }
function save() { try { localStorage.setItem(storageKey,serializeCart(cart)); } catch { notify('O navegador não permite salvar o carrinho.'); } updateBadge(); }
function updateBadge() {
  const s=cartSummary(cart,products);
  document.querySelector('#cartBadge').textContent=s.count;
  document.querySelector('.cart-link').setAttribute('aria-label',`Abrir pedido, ${s.count} ${s.count===1?'unidade':'unidades'}`);
  const dock=document.querySelector('#orderDock');
  dock.hidden=!s.items.length || ['/carrinho','/resumo'].includes(path());
  document.body.classList.toggle('has-order',!dock.hidden);
  if(!dock.hidden) dock.innerHTML=`<div><small>${s.count} ${s.count===1?'unidade no pedido':'unidades no pedido'}</small><strong>${money(s.totalCents)}</strong></div><a href="#/carrinho" class="primary">Revisar pedido <span aria-hidden="true">→</span></a>`;
}
function pack(p) { return `<div class="image-pending" role="img" aria-label="Foto oficial de ${esc(p.name)} pendente"><span class="pack-mark">${esc(brandName(p.brand))}</span><span class="pack-line">${esc(p.size)}</span><small>Foto oficial pendente</small></div>`; }
function stepper(id,count,context='draft') { return `<div class="stepper"><button data-action="quantity" data-id="${esc(id)}" data-context="${context}" data-delta="-1" aria-label="Diminuir quantidade" ${count<=1?'disabled':''}>−</button><label class="sr-only" for="qty-${context}-${esc(id)}">Quantidade</label><input id="qty-${context}-${esc(id)}" data-quantity="${esc(id)}" data-context="${context}" value="${count}" type="number" min="1" max="${MAX_QUANTITY}" step="1" inputmode="numeric"><button data-action="quantity" data-id="${esc(id)}" data-context="${context}" data-delta="1" aria-label="Aumentar quantidade" ${count>=MAX_QUANTITY?'disabled':''}>+</button></div>`; }
function status(p) { return p.status==='consult'?'<p class="status"><span aria-hidden="true"></span>Disponibilidade a confirmar</p>':p.status==='unavailable'?'<p class="status unavailable">Temporariamente indisponível</p>':''; }
function card(p) { return `<article class="product-card"><a href="#/produto/${p.slug}" class="product-link"><div class="product-visual">${pack(p)}</div><div class="product-info"><div class="brandline">${esc(brandName(p.brand))}</div><h3>${esc(p.name)}</h3><div class="size">${esc(p.size)}</div><div class="price">${money(p.priceCents)}</div></div></a><div class="card-bottom">${status(p)}<div class="card-actions">${stepper(p.id,drafts[p.id]||1)}<button class="add-btn" data-action="add" data-id="${esc(p.id)}" aria-label="Adicionar ${esc(p.name)} ao pedido" ${p.status==='unavailable'?'disabled':''}>Adicionar <span aria-hidden="true">+</span></button></div></div></article>`; }
function resultMarkup() {
  const list=navigateProducts(products,filters);
  const active=[['query',filters.query?`Busca: ${filters.query}`:''],['brand',brandName(filters.brand)],['category',categoryName(filters.category)],['line',filters.line]].filter(([key])=>filters[key]);
  return `<section id="results" class="results-section" aria-label="Produtos do catálogo"><div class="section-head"><div><p class="eyebrow">CATÁLOGO PROFISSIONAL</p><h2>${filters.brand?esc(brandName(filters.brand)):filters.category?esc(categoryName(filters.category)):'Encontre seu próximo produto'}</h2></div><span class="result-count" role="status">${list.length} ${list.length===1?'produto':'produtos'}</span></div>${active.length?`<div class="active-filters">${active.map(([key,label])=>`<button data-action="remove-filter" data-key="${key}">${esc(label)} <span aria-hidden="true">×</span><span class="sr-only">Remover filtro</span></button>`).join('')}<button class="clear-all" data-action="clear">Limpar tudo</button></div>`:''}${list.length?`<div class="product-grid">${list.slice(0,pageLimit).map(card).join('')}</div><div class="load-more"><p>Mostrando ${Math.min(pageLimit,list.length)} de ${list.length} produtos</p>${list.length>pageLimit?'<button class="secondary" data-action="more">Mostrar mais produtos <span aria-hidden="true">↓</span></button>':''}</div>`:'<div class="empty"><span class="empty-icon">⌕</span><h3>Não encontramos esse produto.</h3><p>Tente outro nome, marca ou código, ou ajuste os filtros.</p><button class="primary" data-action="clear">Ver todos os produtos</button><small>O contato comercial será habilitado após a revisão desta prévia.</small></div>'}</section>`;
}
const options = (values,selected,label='Todas') => `<option value="">${label}</option>`+values.map(v=>`<option value="${esc(v)}" ${v===selected?'selected':''}>${esc(v)}</option>`).join('');
function home() {
  const active=Boolean(filters.query||filters.brand||filters.category||filters.line);
  const brands=[...new Set(products.map(p=>p.brand))];
  const counts=Object.fromEntries(CATEGORIES.map(c=>[c.id,products.filter(p=>categoryFor(p)===c.id).length]));
  const lines=availableLines(products,filters);
  view.innerHTML=`<div class="main home">${!active?`<section class="hero" aria-label="Boas-vindas ao catálogo"><div class="hero-content"><p class="eyebrow">FENIÉ PRO · CATÁLOGO PROFISSIONAL</p><h1>Seu próximo resultado<br>começa aqui.</h1><p>Explore nossas marcas, escolha os produtos e monte o pedido para o seu salão.</p><a class="hero-cta" href="#results">Explorar produtos <span aria-hidden="true">↗</span></a></div><span class="hero-caption">Produtos profissionais. Atendimento próximo.</span></section>`:''}<section class="category-section" aria-label="Comprar por categoria"><div class="compact-head"><h2>O que seu salão precisa?</h2><span>Categorias em revisão</span></div><div class="category-list">${CATEGORIES.filter(c=>counts[c.id]).map(c=>`<button class="category-tile ${filters.category===c.id?'selected':''}" data-action="category" data-category="${c.id}" aria-pressed="${filters.category===c.id}"><span class="category-icon">${icon(c.icon)}</span><span>${esc(c.short)}</span><small>${counts[c.id]} produtos</small></button>`).join('')}</div></section>${!active?`<section class="brands-section" id="brands" aria-label="Comprar por marca"><div class="compact-head"><h2>Marcas para a rotina profissional</h2><span>${brands.length} marcas no catálogo</span></div><div class="brand-list">${brands.map(b=>`<button data-action="brand" data-brand="${esc(b)}" aria-label="Ver produtos ${esc(brandName(b))}"><span>${esc(brandName(b))}</span><small>${products.filter(p=>p.brand===b).length} produtos <i aria-hidden="true">↗</i></small></button>`).join('')}</div></section>`:''}<details class="filters" ${active?'open':''}><summary>Filtrar e ordenar <span aria-hidden="true">+</span></summary><div class="filterbar"><label for="brand">Marca</label><select id="brand">${'<option value="">Todas as marcas</option>'+brands.map(b=>`<option value="${esc(b)}" ${b===filters.brand?'selected':''}>${esc(brandName(b))}</option>`).join('')}</select><label for="category">Categoria</label><select id="category"><option value="">Todas as categorias</option>${CATEGORIES.filter(c=>counts[c.id]).map(c=>`<option value="${c.id}" ${c.id===filters.category?'selected':''}>${esc(c.name)}</option>`).join('')}</select><label for="line">Linha</label><select id="line">${options(lines,filters.line,'Todas as linhas')}</select><label for="sort">Ordenação</label><select id="sort">${[['relevance','Ordem do catálogo'],['name','Nome A–Z'],['priceAsc','Menor preço'],['priceDesc','Maior preço']].map(([v,label])=>`<option value="${v}" ${filters.sort===v?'selected':''}>${label}</option>`).join('')}</select></div></details>${resultMarkup()}<section class="service-strip"><div><p class="eyebrow">ATENDIMENTO FENIÉ</p><h2>Escolha com mais clareza.</h2><p>Disponibilidade, frete e condições comerciais serão confirmados pela equipe no atendimento.</p></div><div class="preview-note"><strong>Você está em uma prévia.</strong><p>Fotos oficiais, revisão comercial e envio pelo WhatsApp estão na próxima etapa.</p></div></section><footer class="footer"><span class="footer-brand">FENIÉ <small>PRO</small></span><p>Produtos profissionais, educação e atendimento próximo.</p><a href="#/carrinho">Conferir meu pedido →</a></footer></div>`;
  document.querySelector('#clearSearch').hidden=!filters.query;
}
function refreshFilters() {
  const lines=availableLines(products,filters);
  if(filters.line && !lines.includes(filters.line)) filters.line='';
  pageLimit=24; home(); updateBadge();
}
function product(slug) {
  const p=products.find(p=>p.slug===slug&&p.status!=='hidden');
  if(!p) { view.innerHTML='<div class="main empty"><h1>Produto não encontrado.</h1><a href="#/" class="secondary">Voltar ao catálogo</a></div>';return; }
  view.innerHTML=`<div class="main"><nav class="breadcrumbs" aria-label="Caminho do produto"><a href="#/">Catálogo</a><span aria-hidden="true">/</span><button data-action="brand" data-brand="${esc(p.brand)}">${esc(brandName(p.brand))}</button></nav><section class="detail-layout"><div class="detail-visual">${pack(p)}</div><div class="detail-content"><p class="eyebrow">${esc(brandName(p.brand))}</p><h1>${esc(p.name)}</h1><p class="detail-meta">${esc(p.size)} <span>·</span> SKU ${esc(p.sku)}</p><div class="detail-price">${money(p.priceCents)}<small>por unidade · preço em revisão</small></div>${status(p)}<div class="purchase-row">${stepper(p.id,drafts[p.id]||1)}<button class="primary" data-action="add" data-id="${esc(p.id)}" ${p.status==='unavailable'?'disabled':''}>Adicionar ao pedido <span aria-hidden="true">+</span></button></div><div class="detail-specs"><h2>Informações do produto</h2><dl><div><dt>Marca</dt><dd>${esc(brandName(p.brand))}</dd></div><div><dt>Linha</dt><dd>${esc(p.line)}</dd></div><div><dt>Embalagem</dt><dd>${esc(p.size)}</dd></div><div><dt>Código</dt><dd>${esc(p.sku)}</dd></div></dl></div><div class="notice"><strong>Conteúdo em revisão</strong><p>Foto oficial, indicação e modo de uso serão adicionados após conferência. Disponibilidade e condições comerciais dependem do atendimento.</p></div></div></section></div>`;
}
function cartView() {
  const s=cartSummary(cart,products);
  if(!s.items.length&&!s.issues.length) { view.innerHTML='<div class="main empty"><p class="eyebrow">MEU PEDIDO</p><h1>Seu pedido começa com uma escolha.</h1><p>Explore as marcas e adicione os produtos para o seu salão.</p><a class="primary" href="#/">Explorar catálogo →</a></div>';return; }
  view.innerHTML=`<div class="main"><a href="#/" class="back-link">← Continuar escolhendo</a><div class="page-heading"><p class="eyebrow">SEU SALÃO, SEU PEDIDO</p><h1>Meu pedido</h1><p>${s.count} ${s.count===1?'unidade selecionada':'unidades selecionadas'}</p></div>${s.issues.map(i=>`<div class="alert">${esc(i.reason)} <button data-action="remove" data-id="${esc(i.id)}">Remover item</button></div>`).join('')}<div class="cart-layout"><div class="cart-list">${s.items.map(({product:p,quantity:q,subtotalCents})=>`<article class="cart-item"><a class="cart-thumb" href="#/produto/${p.slug}">${pack(p)}</a><div class="cart-item-content"><p class="brandline">${esc(brandName(p.brand))}</p><a href="#/produto/${p.slug}" class="cart-name">${esc(p.name)}</a><p class="cart-meta">${esc(p.size)} · ${money(p.priceCents)} por unidade</p><div class="cart-lower">${stepper(p.id,q,'cart')}<strong>${money(subtotalCents)}</strong><button class="remove" data-action="remove" data-id="${esc(p.id)}">Remover</button></div></div></article>`).join('')}</div><aside class="summary"><p class="eyebrow">RESUMO DO PEDIDO</p><div class="summary-total"><span>Subtotal</span><strong>${money(s.totalCents)}</strong></div><p>Frete e condições comerciais serão confirmados pela Fenié.</p><button class="primary" data-action="review" ${s.issues.length||!s.items.length?'disabled':''}>Revisar pedido →</button><small>Prévia de revisão. Nenhum pedido real será enviado.</small></aside></div></div>`;
}
function review() {
  const s=cartSummary(cart,products);
  if(!s.items.length||s.issues.length) {location.hash='/carrinho';return;}
  view.innerHTML=`<div class="main review-main"><a href="#/carrinho" class="back-link">← Editar pedido</a><div class="page-heading"><p class="eyebrow">ÚLTIMA CONFERÊNCIA</p><h1>Confira sua seleção.</h1><p>Verifique produtos e quantidades antes de gerar a mensagem.</p></div><div class="review-card">${s.items.map(({product:p,quantity:q,subtotalCents})=>`<div class="review-item"><div><strong>${q} × ${esc(p.name)}</strong><small>${esc(p.size)} · SKU ${esc(p.sku)} · ${money(p.priceCents)} por unidade</small></div><strong>${money(subtotalCents)}</strong></div>`).join('')}<div class="summary-total"><span>Subtotal dos produtos</span><strong>${money(s.totalCents)}</strong></div></div><div class="field"><label for="clientName">Nome / salão <span>(opcional)</span></label><input id="clientName" maxlength="120" placeholder="Como podemos identificar seu salão?"></div><div class="notice"><strong>Você está testando uma prévia.</strong><p>A mensagem será marcada como demonstração. O envio pelo WhatsApp será habilitado após a revisão comercial.</p></div><button class="primary" data-action="message">Gerar mensagem de demonstração →</button><section id="messageArea" class="message-area" aria-live="polite"></section></div>`;
}
function route() {
  if(!catalogReady)return;
  const current=path();
  if(current.startsWith('/produto/'))product(current.slice('/produto/'.length));
  else if(current==='/carrinho')cartView();
  else if(current==='/resumo')review();
  else home();
  updateBadge();
  if(jumpToBrands) { jumpToBrands=false;document.querySelector('#brands')?.scrollIntoView(); }
}
async function load() {
  catalogReady=false;
  view.innerHTML='<div class="main loading"><p role="status">Preparando o catálogo para você…</p></div>';
  try {
    const response=await fetch('./catalog-preview.json',{cache:'no-store'});
    if(!response.ok)throw Error('Falha de carregamento');
    products=validateCatalog(await response.json()).products;
    catalogReady=true;route();
  } catch {view.innerHTML='<div class="main empty"><h1>Não foi possível carregar o catálogo.</h1><p>Confira sua conexão e tente novamente.</p><button class="primary" data-action="retry">Tentar novamente</button></div>';}
}
function showHome() {if(path()!=='/')location.hash='/';else{home();updateBadge();}}
function refreshQuantity(context,id,value) {
  const target=context==='cart'?cart:drafts;
  try { target[id]=quantity(value); } catch { notify('Informe uma quantidade inteira de 1 a 999.'); }
  const count=target[id]||1;
  const input=document.getElementById(`qty-${context}-${id}`);
  if(input) {
    input.value=count;
    const controls=input.closest('.stepper').querySelectorAll('button');
    controls[0].disabled=count<=1;controls[1].disabled=count>=MAX_QUANTITY;
  }
  if(context==='cart') {
    save();
    const summary=cartSummary(cart,products);
    const item=summary.items.find(({product})=>product.id===id);
    if(item&&input) input.closest('.cart-item').querySelector('.cart-lower strong').textContent=money(item.subtotalCents);
    document.querySelector('.summary-total strong').textContent=money(summary.totalCents);
    document.querySelector('.page-heading>p:last-child').textContent=`${summary.count} ${summary.count===1?'unidade selecionada':'unidades selecionadas'}`;
  }
}
document.querySelector('#searchForm').addEventListener('submit',e=>{e.preventDefault();if(!catalogReady)return;showHome();document.querySelector('#results')?.scrollIntoView();});
searchInput.addEventListener('input',()=>{if(!catalogReady)return;filters.query=searchInput.value;if(filters.line&&!availableLines(products,filters).includes(filters.line))filters.line='';pageLimit=24;showHome();});
document.addEventListener('change',e=>{
  if(!catalogReady)return;
  if(e.target.dataset.quantity) {refreshQuantity(e.target.dataset.context,e.target.dataset.quantity,Number(e.target.value));return;}
  if(['brand','category','line','sort'].includes(e.target.id)){filters[e.target.id]=e.target.value;refreshFilters();}
});
document.addEventListener('click',async e=>{
  const button=e.target.closest('button[data-action]');if(!button||button.disabled)return;
  const {action,id,context,delta}=button.dataset;
  if(action==='retry')return load();
  if(!catalogReady)return;
  if(action==='clear'||action==='brands') {filters=initialFilters();searchInput.value='';pageLimit=24;jumpToBrands=action==='brands';showHome();if(jumpToBrands&&path()==='/'){jumpToBrands=false;document.querySelector('#brands')?.scrollIntoView();}return;}
  if(action==='clear-search'){filters.query='';searchInput.value='';showHome();searchInput.focus();return;}
  if(action==='category'||action==='brand'){filters=initialFilters();filters[action]=button.dataset[action];searchInput.value='';pageLimit=24;showHome();document.querySelector('#results')?.scrollIntoView();return;}
  if(action==='remove-filter'){filters[button.dataset.key]='';searchInput.value=filters.query;refreshFilters();return;}
  if(action==='more'){pageLimit+=24;document.querySelector('#results').outerHTML=resultMarkup();return;}
  if(action==='quantity'){const target=context==='cart'?cart:drafts;refreshQuantity(context,id,Math.min(MAX_QUANTITY,Math.max(1,(target[id]||1)+Number(delta))));return;}
  if(action==='add') {const p=products.find(p=>p.id===id);if(!p||['hidden','unavailable'].includes(p.status))return;const sum=(cart[id]||0)+(drafts[id]||1);if(sum>MAX_QUANTITY)return notify('Limite de 999 unidades por produto.');cart[id]=sum;save();notify('Produto adicionado ao pedido.');return;}
  if(action==='remove'){delete cart[id];save();cartView();notify('Item removido.');return;}
  if(action==='review'){location.hash='/resumo';return;}
  if(action==='message'){const text=buildMessage(cart,products,{name:document.querySelector('#clientName').value,origin,demo:true});document.querySelector('#messageArea').innerHTML='<h2>Mensagem pronta</h2><pre class="msg-preview"></pre><button class="secondary" data-action="copy">Copiar mensagem</button>';document.querySelector('.msg-preview').textContent=text;return;}
  if(action==='copy'){try{await navigator.clipboard.writeText(document.querySelector('.msg-preview').textContent);notify('Mensagem copiada.');}catch{notify('Selecione a mensagem para copiar manualmente.');}}
});
window.addEventListener('hashchange',()=>{if(location.hash==='#results'){document.querySelector('#results')?.scrollIntoView();return;}const shouldJump=jumpToBrands;route();if(!shouldJump)window.scrollTo(0,0);view.focus({preventScroll:true});});
load();
