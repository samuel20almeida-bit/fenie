const sourceHosts = {PROHALL:'lojaprohall.com.br',RIGOLIM:'www.rigolim.com.br','MUP MAKEUP':'www.mupmakeup.com'};
export function validateEditorial(data, products) {
  if (data?.version !== 1 || !Array.isArray(data.products) || !Array.isArray(data.collections) || !Array.isArray(data.featured)) throw Error('Conteúdo editorial inválido');
  const bySku = new Map(products.map(p => [p.sku,p])), seen = new Set();
  const fields = new Set(['sku','brand','mercosName','displayName','summary','indication','benefits','howToUse','usageCompleteness','sourceUrl','sourceName','reviewedAt']);
  for (const item of data.products) {
    const p = bySku.get(item.sku);
    if (!p || !p.image || seen.has(item.sku) || p.name !== item.mercosName || p.brand !== item.brand) throw Error(`Conteúdo não corresponde ao SKU: ${item.sku}`);
    if (Object.keys(item).some(k => !fields.has(k))) throw Error('Campo editorial não permitido');
    for (const key of ['displayName','summary','indication','sourceName','reviewedAt']) if (typeof item[key] !== 'string' || !item[key].trim()) throw Error(`Campo editorial ausente: ${key}`);
    for (const key of ['benefits','howToUse']) if (!Array.isArray(item[key]) || !item[key].length || item[key].some(v => typeof v !== 'string' || !v.trim())) throw Error(`Lista editorial inválida: ${key}`);
    if (!['steps','overview'].includes(item.usageCompleteness)) throw Error('Orientação de uso inválida');
    const url = new URL(item.sourceUrl);
    if (url.protocol !== 'https:' || url.hostname !== sourceHosts[item.brand] || url.username || url.password || url.port) throw Error('Fonte editorial não conferida');
    seen.add(item.sku);
  }
  const ids = new Set();
  for (const group of data.collections) {
    if (!/^[a-z]+$/.test(group.id) || ids.has(group.id) || !group.title?.trim() || !group.description?.trim() || !Array.isArray(group.skus) || !group.skus.length || new Set(group.skus).size !== group.skus.length || group.skus.some(sku => !seen.has(sku)) || !group.skus.includes(group.coverSku)) throw Error('Seleção editorial inválida');
    ids.add(group.id);
  }
  if (new Set(data.featured).size !== data.featured.length || data.featured.some(sku => !seen.has(sku))) throw Error('Destaques inválidos');
  return data;
}

export function collectionProducts(products, editorial, collection = '') {
  if (!collection) return products;
  const skus = new Set(editorial?.collections.find(c => c.id === collection)?.skus ?? []);
  return products.filter(p => skus.has(p.sku));
}

export function featuredProducts(products, editorial) {
  const bySku = new Map(products.map(p => [p.sku,p]));
  return (editorial?.featured ?? []).map(sku => bySku.get(sku)).filter(p => p && p.image && !['hidden','unavailable'].includes(p.status));
}

export function editorialSearchProducts(products, editorial) {
  const bySku = new Map((editorial?.products ?? []).map(p => [p.sku,p]));
  return products.map(p => {
    const content = bySku.get(p.sku);
    return content ? {...p, keywords:[...(p.keywords ?? []),content.indication,...content.benefits]} : p;
  });
}
