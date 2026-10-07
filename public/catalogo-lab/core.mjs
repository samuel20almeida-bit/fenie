export const MAX_QUANTITY = 999;
export const CART_TTL = 30 * 24 * 60 * 60 * 1000;
export const money = cents => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function validateCatalog(data) {
  if (!data || !Array.isArray(data.products)) throw new Error('Catálogo inválido');
  const ids = new Set(), skus = new Set(), slugs = new Set();
  for (const p of data.products) {
    for (const field of ['id', 'sku', 'slug', 'name', 'brand', 'category', 'size']) {
      if (typeof p[field] !== 'string' || !p[field].trim()) throw new Error(`Campo obrigatório: ${field}`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)) throw new Error(`Slug inválido: ${p.sku}`);
    if (ids.has(p.id) || skus.has(p.sku) || slugs.has(p.slug)) throw new Error(`Produto duplicado: ${p.sku}`);
    ids.add(p.id); skus.add(p.sku); slugs.add(p.slug);
    if (!Number.isSafeInteger(p.priceCents) || p.priceCents < 0 || p.priceCents > 100000000) throw new Error(`Preço inválido: ${p.sku}`);
    if (!['active', 'unavailable', 'hidden', 'consult'].includes(p.status)) throw new Error(`Status inválido: ${p.sku}`);
    if (p.image && !/^https:\/\//.test(p.image) && !/^\.\/assets\/products\/[A-Za-z0-9_-]+\.(?:jpg|png|webp)$/.test(p.image)) throw new Error(`Imagem deve usar HTTPS ou um arquivo local de produto: ${p.sku}`);
    if (p.image && !p.imageAlt?.trim()) throw new Error(`Texto alternativo obrigatório: ${p.sku}`);
    if (p.keywords && (!Array.isArray(p.keywords) || p.keywords.some(k => typeof k !== 'string'))) throw new Error(`Palavras-chave inválidas: ${p.sku}`);
  }
  return data;
}

export function searchProducts(products, { query = '', brand = '', category = '', sort = 'relevance' } = {}) {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  const list = products.filter(p => p.status !== 'hidden' && (!brand || p.brand === brand) && (!category || p.category === category) && terms.every(term => normalize([p.name, p.brand, p.category, p.sku, p.line, ...(p.keywords ?? [])].join(' ')).includes(term)));
  return list.sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name, 'pt-BR') : sort === 'priceAsc' ? a.priceCents - b.priceCents : sort === 'priceDesc' ? b.priceCents - a.priceCents : (a.order ?? 0) - (b.order ?? 0));
}

export function quantity(value) {
  if (!Number.isSafeInteger(value) || value < 1 || value > MAX_QUANTITY) throw new Error('Quantidade deve ser inteira entre 1 e 999');
  return value;
}

export function restoreCart(raw, now = Date.now()) {
  try {
    const saved = JSON.parse(raw);
    if (saved.version !== 1 || !Number.isFinite(saved.savedAt) || now - saved.savedAt > CART_TTL || saved.savedAt > now || !Array.isArray(saved.items)) return {};
    const cart = {};
    for (const item of saved.items) {
      if (typeof item.id !== 'string' || !item.id.trim() || ['__proto__', 'constructor', 'prototype'].includes(item.id)) continue;
      try { cart[item.id] = quantity(item.quantity); } catch { /* ignore damaged lines */ }
    }
    return cart;
  } catch { return {}; }
}

export const serializeCart = (cart, now = Date.now()) => JSON.stringify({ version: 1, savedAt: now, items: Object.entries(cart).map(([id, quantity]) => ({ id, quantity })) });

export function cartSummary(cart, products) {
  const items = [], issues = [];
  for (const [id, value] of Object.entries(cart)) {
    const product = products.find(p => p.id === id);
    if (!product || ['hidden', 'unavailable'].includes(product.status)) { issues.push({ id, reason: 'Produto removido ou indisponível' }); continue; }
    try { quantity(value); } catch { issues.push({ id, reason: 'Quantidade inválida' }); continue; }
    items.push({ product, quantity: value, subtotalCents: product.priceCents * value });
  }
  return { items, issues, totalCents: items.reduce((n, i) => n + i.subtotalCents, 0), count: items.reduce((n, i) => n + i.quantity, 0) };
}

export function buildMessage(cart, products, { name = '', origin = {}, demo = false } = {}) {
  const summary = cartSummary(cart, products);
  if (!summary.items.length || summary.issues.length) throw new Error('Revise o carrinho antes de enviar');
  const lines = [demo ? 'DEMONSTRAÇÃO — NÃO É UM PEDIDO REAL' : 'Olá! Montei um pedido pelo Catálogo Fenié PRO.', '', 'PEDIDO'];
  summary.items.forEach(({ product: p, quantity, subtotalCents }, index) => lines.push('', `${index + 1}. ${p.brand} — ${p.name} — ${p.size}`, `SKU: ${p.sku}`, `Quantidade: ${quantity}`, `Unitário: ${money(p.priceCents)}`, `Subtotal: ${money(subtotalCents)}`));
  lines.push('', `Subtotal dos produtos: ${money(summary.totalCents)}`);
  if (name.trim()) lines.push(`Nome/Salão: ${name.trim().replace(/[\r\n]/g, ' ').slice(0, 120)}`);
  for (const key of ['seller', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'campanha']) if (typeof origin[key] === 'string' && origin[key]) lines.push(`${key}: ${origin[key].replace(/[\r\n]/g, ' ').slice(0, 120)}`);
  lines.push('', 'Gostaria de confirmar disponibilidade, condições comerciais e entrega.');
  return lines.join('\n');
}

export function whatsappUrl(phone, message) {
  if (!/^55\d{10,11}$/.test(phone)) throw new Error('Número brasileiro inválido');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function captureOrigin(search, prior = {}) {
  const params = new URLSearchParams(search);
  const result = {};
  for (const key of ['seller', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'campanha']) {
    const value = params.get(key) ?? (key === 'seller' ? params.get('vendedor') : null);
    if (value !== null) result[key] = value.replace(/[\r\n]/g, ' ').slice(0, 120);
    else if (typeof prior[key] === 'string') result[key] = prior[key].replace(/[\r\n]/g, ' ').slice(0, 120);
  }
  return result;
}
