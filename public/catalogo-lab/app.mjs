import { money, validateCatalog, cartSummary, restoreCart, serializeCart, buildMessage, captureOrigin, quantity, MAX_QUANTITY } from './core.mjs';
import { validateEditorial, collectionProducts, featuredProducts, editorialSearchProducts } from './merchandising.mjs';
import { CATEGORIES, categoryFor, navigateProducts, availableLines } from './navigation.mjs';
import { SALON_GROUPS, SALON_CONTENT, validateSalon, salonProducts, complementaryProducts, mergeReplenishment } from './salon.mjs';

const storageKey = 'fenie:catalog-lab:cart:v1';
const view = document.querySelector('#view');
const searchInput = document.querySelector('#search');
const initialFilters = () => ({ query:'', brand:'', category:'', line:'', sort:'relevance', collection:'', goal:'' });
let editorial = null, contentBySku = new Map(), zoomTrigger = null;
const photoDialog = document.querySelector('#photoZoom');
const selectionBase = () => salonProducts(collectionProducts(products,editorial,filters.collection),filters.goal);
const selectionName = () => editorial?.collections.find(c=>c.id===filters.collection)?.title || '';
let products = [], cart = {}, origin = {}, catalogReady = false, pageLimit = 24, filters = initialFilters(), jumpToBrands = false;
let salonReady = false, replenishment = {}, jumpToSection = '';
const replenishmentKey = 'fenie:catalog-lab:replenishment:v1';
const drafts = Object.create(null);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const path = () => location.hash.slice(1) || '/';
const brandName = brand => ({'MUP MAKEUP':'MUP Makeup','MUP COLOR':'MUP Color','SPA DO FIO':'Spa do Fio','PAPEL PARA MECHAS':'Papel para Mechas'}[brand] || brand.charAt(0)+brand.slice(1).toLowerCase());
const categoryName = id => CATEGORIES.find(c => c.id === id)?.name || 'Produto profissional';
try { cart = restoreCart(localStorage.getItem(storageKey)); } catch { /* storage is optional */ }
try { replenishment = restoreCart(localStorage.getItem(replenishmentKey)); } catch { /* storage is optional */ }
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
  dock.hidden=!s.items.length || ['/carrinho','/resumo','/reposicao'].includes(path());
  document.body.classList.toggle('has-order',!dock.hidden);
  if(!dock.hidden) dock.innerHTML=`<div><small>${s.count} ${s.count===1?'unidade no pedido':'unidades no pedido'}</small><strong>${money(s.totalCents)}</strong></div><a href="#/carrinho" class="primary">Revisar pedido <span aria-hidden="true">→</span></a>`;
}
function pack(p, fallback=false) { return p.image&&!fallback?`<div class="product-photo"><img src="${esc(p.image)}" alt="${esc(p.imageAlt)}" loading="lazy" decoding="async" data-product-image="${esc(p.id)}"><small>Embalagem em conferência</small></div>`:`<div class="image-pending" role="img" aria-label="Foto oficial de ${esc(p.name)} pendente"><span class="pack-mark">${esc(brandName(p.brand))}</span><span class="pack-line">${esc(p.size)}</span><small>Foto oficial pendente</small></div>`; }
function stepper(id,count,context='draft') { return `<div class="stepper"><button data-action="quantity" data-id="${esc(id)}" data-context="${context}" data-delta="-1" aria-label="Diminuir quantidade" ${count<=1?'disabled':''}>−</button><label class="sr-only" for="qty-${context}-${esc(id)}">Quantidade</label><input id="qty-${context}-${esc(id)}" data-quantity="${esc(id)}" data-context="${context}" value="${count}" type="number" min="1" max="${MAX_QUANTITY}" step="1" inputmode="numeric"><button data-action="quantity" data-id="${esc(id)}" data-context="${context}" data-delta="1" aria-label="Aumentar quantidade" ${count>=MAX_QUANTITY?'disabled':''}>+</button></div>`; }
function status(p) { return p.status==='consult'?'<p class="status"><span aria-hidden="true"></span>Disponibilidade a confirmar</p>':p.status==='unavailable'?'<p class="status unavailable">Temporariamente indisponível</p>':''; }
function card(p,context='draft') { return `<article class="product-card"><a href="#/produto/${p.slug}" class="product-link"><div class="product-visual">${pack(p)}</div><div class="product-info"><div class="brandline">${esc(brandName(p.brand))}</div><h3>${esc(contentBySku.get(p.sku)?.displayName || p.name)}</h3>${contentBySku.has(p.sku)?`<p class="product-benefit">${esc(contentBySku.get(p.sku).benefits[0])}</p>`:''}<div class="size">${esc(p.size)}</div><div class="price">${money(p.priceCents)}</div></div></a><div class="card-bottom">${status(p)}<div class="card-actions">${stepper(p.id,drafts[p.id]||1,context)}<button class="add-btn" data-action="add" data-id="${esc(p.id)}" aria-label="Adicionar ${esc(p.name)} ao pedido" ${p.status==='unavailable'?'disabled':''}>Adicionar <span aria-hidden="true">+</span></button></div></div></article>`; }
function curatedHome() {
  if(!editorial)return '';
  return `<section id="selecoes" class="curation" aria-label="Seleções para a rotina profissional"><div class="section-head"><div><p class="eyebrow">SELEÇÕES FENIÉ</p><h2>Escolha pelo que você precisa.</h2></div><p class="curation-intro">Cuidado, acabamento e beleza em uma seleção para conhecer melhor.</p></div><div class="collection-grid">${editorial.collections.map(c=>{const cover=products.find(p=>p.sku===c.coverSku);return `<button class="collection-card" data-action="collection" data-collection="${esc(c.id)}"><div class="collection-copy"><span class="eyebrow">${c.skus.length} produtos selecionados</span><h3>${esc(c.title)}</h3><p>${esc(c.description)}</p><span class="collection-cta">Explorar seleção <span aria-hidden="true">↗</span></span></div><img src="${esc(cover.image)}" alt="" loading="lazy" decoding="async" data-collection-cover></button>`;}).join('')}</div></section>`;
}
function priorityHome() {
  if(!editorial?.priorityBrand)return '';
  const brand=editorial.priorityBrand, featured=featuredProducts(products,editorial);
  if(!featured.length)return '';
  return `<section class="priority-brand" aria-label="Olenka em destaque"><div class="section-head"><div><p class="eyebrow">NOSSA MARCA EM DESTAQUE</p><h2>${esc(brandName(brand))} em destaque.</h2></div><div class="priority-intro"><p>${products.filter(p=>p.brand===brand).length} produtos para explorar.</p><button class="text-link" data-action="brand" data-brand="${esc(brand)}">Ver todos os produtos ${esc(brandName(brand))} →</button></div></div><div class="product-grid featured-grid">${featured.map(p=>card(p,'featured')).join('')}</div></section>`;
}
function salonJourney() {
  if(!salonReady)return '';
  return `<section class="salon-journey" aria-label="Comprar para o seu salão"><button data-action="goal" data-goal="profissional"><span class="journey-icon">${icon('bottle')}</span><span><strong>Abastecer meus serviços</strong><small>Seleção profissional Olenka</small></span><i aria-hidden="true">↗</i></button><button data-action="goal" data-goal="bancada"><span class="journey-icon">${icon('grid')}</span><span><strong>Montar minha bancada</strong><small>Cuidados em casa para revenda</small></span><i aria-hidden="true">↗</i></button><a href="#/reposicao"><span class="journey-icon">${icon('sheets')}</span><span><strong>Planejar minha reposição</strong><small>Salve e ajuste sua lista de produtos</small></span><i aria-hidden="true">↗</i></a></section>`;
}
function salonTips() {
  return `<section class="salon-tips" id="dicas-salao" aria-label="Dicas para salões"><div class="section-head"><div><p class="eyebrow">PARCERIA COM O SEU SALÃO</p><h2>Do atendimento à próxima visita.</h2></div><p>Ideias práticas para sua bancada, sua equipe e sua reposição.</p></div><div class="tip-grid"><article><span class="tip-number">01 · BANCADA</span><h3>Organize por necessidade.</h3><p>Aproxime shampoo e máscara da mesma linha. Deixe nome, indicação e preço de revenda visíveis para o cliente.</p><details><summary>Colocar em prática</summary><p>Comece por uma linha que sua equipe conhece. Separe os itens de revenda dos produtos de uso no serviço e acompanhe o que sai antes de ampliar a bancada.</p><button class="text-link" data-action="goal" data-goal="bancada">Conhecer a seleção Olenka →</button></details></article><article><span class="tip-number">02 · ATENDIMENTO</span><h3>Explique o cuidado em casa.</h3><p>Pergunte como o cliente cuida do cabelo e apresente uma rotina que ele consiga seguir, com orientação profissional.</p><details><summary>Uma conversa para a equipe</summary><p>“Como você cuida dos fios entre as visitas? Posso te mostrar uma opção para sua rotina?” Explique a indicação e o uso, informe o preço e deixe o cliente escolher.</p><p>Na próxima visita, pergunte como foi o uso. Ajuste a orientação à experiência do cliente.</p></details></article><article><span class="tip-number">03 · REPOSIÇÃO</span><h3>Compre pelo giro real.</h3><p>Confira o consumo nos serviços e as vendas da bancada separadamente. Salve uma lista para revisar no próximo pedido.</p><details><summary>Uma rotina simples</summary><p>Faça uma conferência semanal de estoque e validade. Considere o prazo de entrega, ajuste as quantidades da lista e revise o total antes de adicionar ao pedido.</p><a class="text-link" href="#/reposicao">Abrir minha reposição →</a></details></article></div></section>`;
}
function retailGuidance(p) {
  if(!salonReady||!SALON_GROUPS.bancada.skus.includes(p.sku))return '';
  return `<aside class="retail-guidance" aria-label="Orientação para revenda"><p class="eyebrow">PARA SUA BANCADA</p><h2>Transforme a indicação em orientação.</h2><p>Apresente este produto para os clientes cuja necessidade corresponde à indicação acima. Explique o uso e como ele entra na rotina em casa.</p><details><summary>Como apresentar ao cliente</summary><p>“Pela sua rotina e pela avaliação dos fios, esta pode ser uma opção de cuidado em casa. Vou te explicar como usar e você decide se faz sentido.”</p><p>Informe o preço praticado pelo seu salão antes da compra.</p></details></aside>`;
}
function relatedSelection(p) {
  const related=salonReady?complementaryProducts(products,p.sku):[];
  if(!related.length)return '';
  return `<section class="related-selection" aria-label="Produtos complementares para a bancada"><div class="section-head"><div><p class="eyebrow">ROTINA DE CUIDADOS EM CASA</p><h2>Conheça os complementares.</h2></div><p>Royal Care e Happy End aparecem juntos na orientação oficial Olenka. Escolha os itens adequados ao seu cliente.</p></div><div class="product-grid">${related.map(item=>card(item,'related')).join('')}</div><button class="text-link" data-action="goal" data-goal="bancada">Ver toda a seleção para bancada →</button></section>`;
}
function persistReplenishment(next) {
  try { localStorage.setItem(replenishmentKey,serializeCart(next));replenishment=next;return true; }
  catch { notify('O navegador não permite salvar a lista de reposição.');return false; }
}
function replenishmentView() {
  const s=cartSummary(replenishment,products);
  if(!s.items.length&&!s.issues.length) {
    view.innerHTML='<div class="main replenishment-empty"><p class="eyebrow">REPOSIÇÃO DO SEU SALÃO</p><h1>Sua próxima compra começa aqui.</h1><p>Monte um pedido com os produtos que costuma usar ou revender e escolha “Salvar lista de reposição”. Na próxima visita, revise as quantidades e os preços.</p><a class="primary" href="#/">Escolher produtos →</a><small>Uma lista neste navegador, por até 30 dias. Nenhuma compra ou assinatura é criada.</small></div>';
    return;
  }
  view.innerHTML=`<div class="main"><a href="#/" class="back-link">← Continuar escolhendo</a><div class="page-heading"><p class="eyebrow">REPOSIÇÃO DO SEU SALÃO</p><h1>Minha lista de reposição</h1><p>Revise as quantidades. Os valores usam a tabela atual carregada no catálogo.</p></div>${s.issues.map(i=>`<div class="alert">${esc(i.reason)} <button data-action="remove-saved" data-id="${esc(i.id)}">Remover da lista</button></div>`).join('')}<div class="cart-layout"><div class="cart-list">${s.items.map(({product:p,quantity:q,subtotalCents})=>`<article class="cart-item"><a class="cart-thumb" href="#/produto/${p.slug}">${pack(p)}</a><div class="cart-item-content"><p class="brandline">${esc(brandName(p.brand))}</p><a href="#/produto/${p.slug}" class="cart-name">${esc(p.name)}</a><p class="cart-meta">${esc(p.size)} · ${money(p.priceCents)} por unidade</p><div class="cart-lower">${stepper(p.id,q,'replenishment')}<strong>${money(subtotalCents)}</strong><button class="remove" data-action="remove-saved" data-id="${esc(p.id)}">Remover da lista</button></div></div></article>`).join('')}</div><aside class="summary"><p class="eyebrow">SUA LISTA SALVA</p><div class="summary-total"><span>Subtotal da lista</span><strong>${money(s.totalCents)}</strong></div><p>Ao adicionar, as quantidades são somadas aos itens que já estão no pedido.</p><button class="primary" data-action="load-replenishment" ${s.issues.length||!s.items.length?'disabled':''}>Adicionar lista ao pedido →</button><button class="secondary" data-action="clear-replenishment">Limpar lista</button><small>Salva somente neste navegador por até 30 dias. Esta lista não é um histórico de compras. Disponibilidade, entrega e condições são confirmadas pela Fenié.</small></aside></div></div>`;
}
function goHomeSection(target) {
  jumpToSection=target;
  if(path()!=='/'){location.hash='/';return;}
  home();updateBadge();jumpToSection='';document.querySelector(target)?.scrollIntoView();
}
function editorialDetails(p) {
  const c=contentBySku.get(p.sku);
  if(!c)return '<section class="product-editorial"><h2>Conheça o produto</h2><p>Indicação, benefícios e modo de uso estão em preparação. Consulte o atendimento para orientação sobre este produto.</p></section>';
  return `<section class="product-editorial" aria-label="Informações do produto"><p class="product-summary">${esc(c.summary)}</p><h2>Para quem é indicado</h2><p>${esc(c.indication)}</p><h2>Benefícios</h2><ul class="benefit-list">${c.benefits.map(b=>`<li>${esc(b)}</li>`).join('')}</ul><details class="usage-details" open><summary>${c.usageCompleteness==='overview'?'Orientação de uso':'Como usar'}</summary><ol>${c.howToUse.map(step=>`<li>${esc(step)}</li>`).join('')}</ol><p class="label-note">Siga também as orientações e os cuidados da embalagem comercializada.</p></details><details class="source-details"><summary>Fonte das informações</summary><p>Resumo da descrição oficial do fabricante, conferido em ${esc(c.reviewedAt)}.</p><a href="${esc(c.sourceUrl)}" target="_blank" rel="noopener noreferrer">Consultar descrição oficial ↗</a></details></section>`;
}
function openPhoto(id,trigger) {
  const p=products.find(p=>p.id===id);
  if(!p?.image)return;
  zoomTrigger=trigger;photoDialog.classList.remove('is-magnified');
  photoDialog.innerHTML=`<div class="zoom-panel"><header class="zoom-header"><div><p class="eyebrow">${esc(brandName(p.brand))}</p><h2 id="zoomTitle">${esc(p.name)}</h2></div><button class="zoom-close" data-action="close-photo" aria-label="Fechar foto ampliada">×</button></header><div class="zoom-stage" tabindex="0" aria-label="Foto do produto; ao ampliar, role para ver os detalhes"><img src="${esc(p.image)}" alt="${esc(p.imageAlt)}" decoding="async" data-zoom-image><p class="zoom-error" hidden>Não foi possível carregar a foto. Feche e tente novamente.</p></div><footer class="zoom-footer"><p>Embalagem em conferência · ${esc(p.size)}</p><button class="secondary" data-action="magnify-photo" aria-pressed="false">Ampliar 2×</button></footer></div>`;
  photoDialog.showModal();document.body.classList.add('photo-modal-open');
}
photoDialog.addEventListener('close',()=>{document.body.classList.remove('photo-modal-open');photoDialog.classList.remove('is-magnified');if(zoomTrigger?.isConnected)zoomTrigger.focus();zoomTrigger=null;});
photoDialog.addEventListener('click',e=>{if(e.target===photoDialog)photoDialog.close();});
photoDialog.addEventListener('error',e=>{if(e.target.hasAttribute('data-zoom-image')){e.target.hidden=true;photoDialog.querySelector('.zoom-error').hidden=false;photoDialog.querySelector('[data-action="magnify-photo"]').disabled=true;}},true);
function resultMarkup() {
  const list=navigateProducts(editorialSearchProducts(selectionBase(),editorial),filters);
  const active=[['query',filters.query?`Busca: ${filters.query}`:''],['brand',brandName(filters.brand)],['category',categoryName(filters.category)],['line',filters.line],['collection',`Seleção: ${selectionName()}`],['goal',SALON_GROUPS[filters.goal]?.title || '']].filter(([key])=>filters[key]);
  return `<section id="results" class="results-section" aria-label="Produtos do catálogo"><div class="section-head"><div><p class="eyebrow">CATÁLOGO PROFISSIONAL</p><h2>${filters.goal?esc(SALON_GROUPS[filters.goal]?.title):filters.collection?esc(selectionName()):filters.brand?esc(brandName(filters.brand)):filters.category?esc(categoryName(filters.category)):'Explore o catálogo completo'}</h2></div><span class="result-count" role="status">${list.length} ${list.length===1?'produto':'produtos'}</span></div>${filters.goal?`<p class="goal-description">${esc(SALON_GROUPS[filters.goal]?.description)}</p>`:''}${active.length?`<div class="active-filters">${active.map(([key,label])=>`<button data-action="remove-filter" data-key="${key}">${esc(label)} <span aria-hidden="true">×</span><span class="sr-only">Remover filtro</span></button>`).join('')}<button class="clear-all" data-action="clear">Limpar tudo</button></div>`:''}${list.length?`<div class="product-grid">${list.slice(0,pageLimit).map(p=>card(p)).join('')}</div><div class="load-more"><p>Mostrando ${Math.min(pageLimit,list.length)} de ${list.length} produtos</p>${list.length>pageLimit?'<button class="secondary" data-action="more">Mostrar mais produtos <span aria-hidden="true">↓</span></button>':''}</div>`:'<div class="empty"><span class="empty-icon">⌕</span><h3>Não encontramos esse produto.</h3><p>Tente outro nome, marca ou código, ou ajuste os filtros.</p><button class="primary" data-action="clear">Ver todos os produtos</button><small>O contato comercial será habilitado após a revisão desta prévia.</small></div>'}</section>`;
}
const options = (values,selected,label='Todas') => `<option value="">${label}</option>`+values.map(v=>`<option value="${esc(v)}" ${v===selected?'selected':''}>${esc(v)}</option>`).join('');
function home() {
  const active=Boolean(filters.query||filters.brand||filters.category||filters.line||filters.collection||filters.goal);
  const brands=[...new Set(selectionBase().map(p=>p.brand))].filter(b=>b!=='Marca a confirmar').sort((a,b)=>Number(b===editorial?.priorityBrand)-Number(a===editorial?.priorityBrand));
  const categoryPool=filters.brand?selectionBase().filter(p=>p.brand===filters.brand):selectionBase();
  const counts=Object.fromEntries(CATEGORIES.map(c=>[c.id,categoryPool.filter(p=>categoryFor(p)===c.id).length]));
  const lines=availableLines(selectionBase(),filters);
  const categories=`<section class="category-section" aria-label="Comprar por categoria"><div class="compact-head"><h2>Categorias</h2></div><div class="category-list">${CATEGORIES.filter(c=>counts[c.id]).map(c=>`<button class="category-tile ${filters.category===c.id?'selected':''}" data-action="category" data-category="${c.id}" aria-pressed="${filters.category===c.id}"><span class="category-icon">${icon(c.icon)}</span><span>${esc(c.short)}</span><small>${counts[c.id]}</small></button>`).join('')}</div></section>`;
  const brandSection=`<section class="brands-section" id="brands" aria-label="Comprar por marca"><div class="section-head"><div><p class="eyebrow">AS MARCAS DA FENIÉ</p><h2>Encontre a sua preferida.</h2></div><span>${brands.length} marcas</span></div><div class="brand-list">${brands.map(b=>`<button data-action="brand" data-brand="${esc(b)}" aria-label="Ver produtos ${esc(brandName(b))}"><span>${esc(brandName(b))}</span><small>${products.filter(p=>p.brand===b).length} produtos <i aria-hidden="true">↗</i></small></button>`).join('')}</div></section>`;
  const filterSection=`<details class="filters" open><summary>Filtrar e ordenar <span aria-hidden="true">+</span></summary><div class="filterbar"><label for="brand">Marca</label><select id="brand"><option value="">Todas as marcas</option>${brands.map(b=>`<option value="${esc(b)}" ${b===filters.brand?'selected':''}>${esc(brandName(b))}</option>`).join('')}</select><label for="category">Categoria</label><select id="category"><option value="">Todas as categorias</option>${CATEGORIES.filter(c=>counts[c.id]).map(c=>`<option value="${c.id}" ${c.id===filters.category?'selected':''}>${esc(c.name)}</option>`).join('')}</select><label for="line">Grupo de produtos</label><select id="line">${options(lines,filters.line,'Todos os grupos')}</select><label for="sort">Ordenação</label><select id="sort">${[['relevance','Ordem do catálogo'],['name','Nome A–Z'],['priceAsc','Menor preço'],['priceDesc','Maior preço']].map(([v,label])=>`<option value="${v}" ${filters.sort===v?'selected':''}>${label}</option>`).join('')}</select></div></details>`;
  view.innerHTML=`<div class="main home">${!active?`<section class="catalog-intro" aria-label="Boas-vindas ao catálogo"><div class="intro-copy"><p class="eyebrow">CATÁLOGO PROFISSIONAL FENIÉ</p><h1>O cuidado certo.<br>Para o seu salão.</h1><p>Abasteça seus serviços, escolha produtos para revenda e organize a próxima reposição. Comece pela Olenka.</p><div class="intro-actions"><button class="primary" data-action="goal" data-goal="bancada">Montar minha bancada <span aria-hidden="true">↗</span></button><button data-action="goal" data-goal="profissional" class="intro-link">Uso profissional →</button></div><div class="intro-note"><span>Compras para salões</span><span>Olenka em destaque</span></div></div><div class="intro-photo"><img src="/images/hero/olenka-royal-look-1200.webp" width="1200" height="963" alt="Campanha Olenka com produtos Royal Look e cuidados profissionais" fetchpriority="high"></div></section>${salonJourney()}${priorityHome()}${salonTips()}${curatedHome()}${brandSection}`:''}<div class="catalog-shell"><aside class="catalog-sidebar" aria-label="Refinar catálogo">${categories}${filterSection}</aside>${resultMarkup()}</div><section class="service-strip"><div><p class="eyebrow">ATENDIMENTO FENIÉ</p><h2>Uma escolha. Uma conversa.</h2><p>Monte sua seleção. A equipe confirma disponibilidade, entrega e condições comerciais com você.</p></div><div class="preview-note"><strong>Catálogo em revisão</strong><p>Preços da tabela padrão Mercos de 07/10/2026. Fotos e embalagens em conferência; pedidos reais desativados.</p></div></section><footer class="footer"><a href="#/" class="footer-logo" aria-label="Fenié PRO — início do catálogo"><span class="brand-logo"><img src="./assets/fenie-logo-original.png" alt="Fenié PRO" width="2048" height="1228"></span></a><p>Produtos profissionais. Atendimento próximo.</p><a href="#/carrinho">Conferir meu pedido →</a></footer></div>`;
  document.querySelector('#clearSearch').hidden=!filters.query;
}
function refreshFilters() {
  const lines=availableLines(selectionBase(),filters);
  if(filters.line && !lines.includes(filters.line)) filters.line='';
  pageLimit=24; home(); updateBadge();
}
function product(slug) {
  const p=products.find(p=>p.slug===slug&&p.status!=='hidden');
  if(!p) { view.innerHTML='<div class="main empty"><h1>Produto não encontrado.</h1><a href="#/" class="secondary">Voltar ao catálogo</a></div>';return; }
  view.innerHTML=`<div class="main"><nav class="breadcrumbs" aria-label="Caminho do produto"><a href="#/">Catálogo</a><span aria-hidden="true">/</span><button data-action="brand" data-brand="${esc(p.brand)}">${esc(brandName(p.brand))}</button></nav><section class="detail-layout"><div class="detail-visual">${pack(p)}${p.image?`<button class="photo-zoom-trigger" data-action="zoom-photo" data-id="${esc(p.id)}" aria-label="Ampliar foto de ${esc(p.name)}">⌕ Ampliar foto</button>`:''}</div><div class="detail-content"><p class="eyebrow">${esc(brandName(p.brand))}</p><h1>${esc(p.name)}</h1><p class="detail-meta">${esc(p.size)} <span>·</span> SKU ${esc(p.sku)}</p><div class="detail-price">${money(p.priceCents)}<small>por unidade de venda · tabela padrão Mercos</small></div>${status(p)}<div class="purchase-row">${stepper(p.id,drafts[p.id]||1)}<button class="primary" data-action="add" data-id="${esc(p.id)}" ${p.status==='unavailable'?'disabled':''}>Adicionar ao pedido <span aria-hidden="true">+</span></button></div>${editorialDetails(p)}${retailGuidance(p)}<div class="detail-specs"><h2>Embalagem e identificação</h2><dl><div><dt>Marca</dt><dd>${esc(brandName(p.brand))}</dd></div><div><dt>Grupo</dt><dd>${esc(p.line)}</dd></div><div><dt>Embalagem</dt><dd>${esc(p.size)}</dd></div><div><dt>Código</dt><dd>${esc(p.sku)}</dd></div></dl></div><div class="notice"><strong>Conferência comercial</strong><p>Foto e embalagem em conferência. Disponibilidade e condições comerciais serão confirmadas pelo atendimento Fenié.</p></div></div></section>${relatedSelection(p)}</div>`;
}
function cartView() {
  const s=cartSummary(cart,products);
  if(!s.items.length&&!s.issues.length) { view.innerHTML='<div class="main empty"><p class="eyebrow">MEU PEDIDO</p><h1>Seu pedido começa com uma escolha.</h1><p>Explore as marcas e adicione os produtos para o seu salão.</p><a class="primary" href="#/">Explorar catálogo →</a></div>';return; }
  view.innerHTML=`<div class="main"><a href="#/" class="back-link">← Continuar escolhendo</a><div class="page-heading"><p class="eyebrow">SEU SALÃO, SEU PEDIDO</p><h1>Meu pedido</h1><p>${s.count} ${s.count===1?'unidade selecionada':'unidades selecionadas'}</p></div>${s.issues.map(i=>`<div class="alert">${esc(i.reason)} <button data-action="remove" data-id="${esc(i.id)}">Remover item</button></div>`).join('')}<div class="cart-layout"><div class="cart-list">${s.items.map(({product:p,quantity:q,subtotalCents})=>`<article class="cart-item"><a class="cart-thumb" href="#/produto/${p.slug}">${pack(p)}</a><div class="cart-item-content"><p class="brandline">${esc(brandName(p.brand))}</p><a href="#/produto/${p.slug}" class="cart-name">${esc(p.name)}</a><p class="cart-meta">${esc(p.size)} · ${money(p.priceCents)} por unidade</p><div class="cart-lower">${stepper(p.id,q,'cart')}<strong>${money(subtotalCents)}</strong><button class="remove" data-action="remove" data-id="${esc(p.id)}">Remover</button></div></div></article>`).join('')}</div><aside class="summary"><p class="eyebrow">RESUMO DO PEDIDO</p><div class="summary-total"><span>Subtotal</span><strong>${money(s.totalCents)}</strong></div><p>Tabela padrão Mercos · 07/10/2026. Frete e condições comerciais serão confirmados pela Fenié.</p><button class="primary" data-action="review" ${s.issues.length||!s.items.length?'disabled':''}>Revisar pedido →</button><button class="secondary save-replenishment" data-action="save-replenishment" ${s.issues.length||!s.items.length?'disabled':''}>Salvar lista de reposição</button><a class="saved-list-link" href="#/reposicao">Ver minha lista salva →</a><small>Lista guardada neste navegador por até 30 dias. Não registra uma compra.</small><small>Prévia de revisão. Nenhum pedido real será enviado.</small></aside></div></div>`;
}
function review() {
  const s=cartSummary(cart,products);
  if(!s.items.length||s.issues.length) {location.hash='/carrinho';return;}
  view.innerHTML=`<div class="main review-main"><a href="#/carrinho" class="back-link">← Editar pedido</a><div class="page-heading"><p class="eyebrow">ÚLTIMA CONFERÊNCIA</p><h1>Confira sua seleção.</h1><p>Verifique produtos e quantidades antes de gerar a mensagem.</p></div><div class="review-card">${s.items.map(({product:p,quantity:q,subtotalCents})=>`<div class="review-item"><div><strong>${q} × ${esc(p.name)}</strong><small>${esc(p.size)} · SKU ${esc(p.sku)} · ${money(p.priceCents)} por unidade</small></div><strong>${money(subtotalCents)}</strong></div>`).join('')}<div class="summary-total"><span>Subtotal dos produtos</span><strong>${money(s.totalCents)}</strong></div></div><div class="field"><label for="clientName">Nome / salão <span>(opcional)</span></label><input id="clientName" maxlength="120" placeholder="Como podemos identificar seu salão?"></div><div class="notice"><strong>Você está testando uma prévia.</strong><p>A mensagem será marcada como demonstração. O envio pelo WhatsApp será habilitado após a revisão comercial.</p></div><button class="primary" data-action="message">Gerar mensagem de demonstração →</button><section id="messageArea" class="message-area" aria-live="polite"></section></div>`;
}
function route() {
  if(photoDialog.open) photoDialog.close();
  if(!catalogReady)return;
  const current=path();
  if(current.startsWith('/produto/'))product(current.slice('/produto/'.length));
  else if(current==='/carrinho')cartView();
  else if(current==='/resumo')review();
  else if(current==='/reposicao')replenishmentView();
  else home();
  updateBadge();
  if(jumpToBrands) { jumpToBrands=false;document.querySelector('#brands')?.scrollIntoView(); }
  if(jumpToSection) { const target=jumpToSection;jumpToSection='';document.querySelector(target)?.scrollIntoView(); }
}
async function load() {
  catalogReady=false;
  view.innerHTML='<div class="main loading"><p role="status">Preparando o catálogo para você…</p></div>';
  try {
    const response=await fetch('./catalog-preview.json',{cache:'no-store'});
    if(!response.ok)throw Error('Falha de carregamento');
    products=validateCatalog(await response.json()).products;
    try {
      const contentResponse=await fetch('./editorial.json',{cache:'no-store'});
      if(!contentResponse.ok)throw Error('Conteúdo indisponível');
      editorial=validateEditorial(await contentResponse.json(),products);
      contentBySku=new Map(editorial.products.map(p=>[p.sku,p]));
    } catch { editorial=null;contentBySku=new Map(); }
    try { validateSalon(products);salonReady=true;for(const c of SALON_CONTENT)contentBySku.set(c.sku,c); } catch { salonReady=false; }
    catalogReady=true;route();
  } catch {view.innerHTML='<div class="main empty"><h1>Não foi possível carregar o catálogo.</h1><p>Confira sua conexão e tente novamente.</p><button class="primary" data-action="retry">Tentar novamente</button></div>';}
}
function showHome() {if(path()!=='/')location.hash='/';else{home();updateBadge();}}
function refreshQuantity(context,id,value) {
  if(context==='replenishment') {
    try {
      const next={...replenishment,[id]:quantity(value)};
      if(!persistReplenishment(next))return;
      const input=document.getElementById(`qty-replenishment-${id}`), count=replenishment[id];
      if(input){input.value=count;const buttons=input.closest('.stepper').querySelectorAll('button');buttons[0].disabled=count<=1;buttons[1].disabled=count>=MAX_QUANTITY;}
      const summary=cartSummary(replenishment,products), item=summary.items.find(i=>i.product.id===id);
      if(item&&input)input.closest('.cart-item').querySelector('.cart-lower strong').textContent=money(item.subtotalCents);
      document.querySelector('.summary-total strong').textContent=money(summary.totalCents);
    }
    catch { notify('Informe uma quantidade inteira de 1 a 999.');replenishmentView(); }
    return;
  }
  const target=context==='cart'?cart:drafts;
  try { target[id]=quantity(value); } catch { notify('Informe uma quantidade inteira de 1 a 999.'); }
  const count=target[id]||1;
  const inputs=context==='cart'?[document.getElementById(`qty-${context}-${id}`)]:[...document.querySelectorAll('input[data-quantity]')].filter(input=>input.dataset.quantity===id&&input.dataset.context!=='cart');
  const input=inputs[0];
  for(const control of inputs.filter(Boolean)) {
    control.value=count;
    const controls=control.closest('.stepper').querySelectorAll('button');
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
searchInput.addEventListener('input',()=>{if(!catalogReady)return;filters.query=searchInput.value;if(filters.line&&!availableLines(selectionBase(),filters).includes(filters.line))filters.line='';pageLimit=24;showHome();});
document.addEventListener('input',e=>{
  if(!catalogReady||!e.target.dataset.quantity)return;
  const value=Number(e.target.value);
  if(Number.isInteger(value)&&value>=1&&value<=MAX_QUANTITY) refreshQuantity(e.target.dataset.context,e.target.dataset.quantity,value);
});
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
  if(action==='goal') {
    if(!salonReady||!SALON_GROUPS[button.dataset.goal])return notify('Seleção em revisão. Explore o catálogo completo.');
    filters=initialFilters();filters.goal=button.dataset.goal;searchInput.value='';pageLimit=24;goHomeSection('#results');return;
  }
  if(action==='all'){filters=initialFilters();searchInput.value='';pageLimit=24;goHomeSection('#results');return;}
  if(action==='tips'){filters=initialFilters();searchInput.value='';pageLimit=24;goHomeSection('#dicas-salao');return;}
  if(action==='save-replenishment') {
    const s=cartSummary(cart,products);if(!s.items.length||s.issues.length)return notify('Revise o pedido antes de salvar a lista.');
    if(persistReplenishment({...cart}))notify('Lista de reposição salva neste navegador.');return;
  }
  if(action==='remove-saved'){const next={...replenishment};delete next[id];if(persistReplenishment(next))replenishmentView();return;}
  if(action==='clear-replenishment'){if(persistReplenishment({}))replenishmentView();return;}
  if(action==='load-replenishment') {
    try {cart=mergeReplenishment(replenishment,cart,products);save();location.hash='/carrinho';notify('Lista adicionada. Revise as quantidades do pedido.');}
    catch(error){notify(error.message);}return;
  }
  if(action==='clear'||action==='brands') {filters=initialFilters();searchInput.value='';pageLimit=24;jumpToBrands=action==='brands';showHome();if(jumpToBrands&&path()==='/'){jumpToBrands=false;document.querySelector('#brands')?.scrollIntoView();}return;}
  if(action==='clear-search'){filters.query='';searchInput.value='';showHome();searchInput.focus();return;}
  if(action==='collection'){filters=initialFilters();filters.collection=button.dataset.collection;searchInput.value='';pageLimit=24;showHome();document.querySelector('#results')?.scrollIntoView();return;}
  if(action==='zoom-photo'){openPhoto(id,button);return;}
  if(action==='close-photo'){photoDialog.close();return;}
  if(action==='magnify-photo'){const enlarged=photoDialog.classList.toggle('is-magnified');button.setAttribute('aria-pressed',String(enlarged));button.textContent=enlarged?'Ajustar à tela':'Ampliar 2×';return;}
  if(action==='category'){filters.category=button.dataset.category;filters.line='';pageLimit=24;showHome();document.querySelector('#results')?.scrollIntoView();return;}
  if(action==='brand'){filters=initialFilters();filters.brand=button.dataset.brand;searchInput.value='';pageLimit=24;showHome();document.querySelector('#results')?.scrollIntoView();return;}
  if(action==='remove-filter'){filters[button.dataset.key]='';searchInput.value=filters.query;refreshFilters();return;}
  if(action==='more'){pageLimit+=24;document.querySelector('#results').outerHTML=resultMarkup();return;}
  if(action==='quantity'){const target=context==='cart'?cart:context==='replenishment'?replenishment:drafts;refreshQuantity(context,id,Math.min(MAX_QUANTITY,Math.max(1,(target[id]||1)+Number(delta))));return;}
  if(action==='add') {const p=products.find(p=>p.id===id);if(!p||['hidden','unavailable'].includes(p.status))return;const sum=(cart[id]||0)+(drafts[id]||1);if(sum>MAX_QUANTITY)return notify('Limite de 999 unidades por produto.');cart[id]=sum;save();notify('Produto adicionado ao pedido.');return;}
  if(action==='remove'){delete cart[id];save();cartView();notify('Item removido.');return;}
  if(action==='review'){location.hash='/resumo';return;}
  if(action==='message'){const text=buildMessage(cart,products,{name:document.querySelector('#clientName').value,origin,demo:true});document.querySelector('#messageArea').innerHTML='<h2>Mensagem pronta</h2><pre class="msg-preview"></pre><button class="secondary" data-action="copy">Copiar mensagem</button>';document.querySelector('.msg-preview').textContent=text;return;}
  if(action==='copy'){try{await navigator.clipboard.writeText(document.querySelector('.msg-preview').textContent);notify('Mensagem copiada.');}catch{notify('Selecione a mensagem para copiar manualmente.');}}
});
window.addEventListener('hashchange',()=>{if(['#results','#selecoes'].includes(location.hash)){document.querySelector(location.hash)?.scrollIntoView();return;}const shouldJump=jumpToBrands||Boolean(jumpToSection);route();if(!shouldJump)window.scrollTo(0,0);view.focus({preventScroll:true});});
document.addEventListener('error',e=>{if(e.target.hasAttribute?.('data-collection-cover')){e.target.hidden=true;return;}const id=e.target.dataset?.productImage;if(!id)return;const p=products.find(p=>p.id===id);if(p)e.target.closest('.product-photo').outerHTML=pack(p,true);},true);
load();
